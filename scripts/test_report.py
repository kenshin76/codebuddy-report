"""Regression checks for adding models without editing the frozen layout."""

from copy import deepcopy
import hashlib
import json
from pathlib import Path
import tempfile
import unittest

from build_report import ROOT, build, verify_template
from sync_sources import excerpt


class ReportDataTests(unittest.TestCase):
    def setUp(self):
        self.config = json.loads((ROOT / "report-config.json").read_text())
        self.models = [json.loads(p.read_text()) for p in sorted((ROOT / "models").glob("*.json"))]
        self.new = json.loads((ROOT / "templates/model.example.json").read_text())
        self.new.update(id="test-added", name="테스트 전용 모델", folder="test-only", order=999)

    def test_added_unknown_model_expands_all_data_tables(self):
        before = build(self.config, self.models)
        after = build(self.config, self.models + [self.new])
        added = next(m for m in after["models"] if m["id"] == self.new["id"])
        self.assertIsNone(added["rank"])
        self.assertIsNone(added["raw"])
        self.assertEqual(len(after["models"]), len(before["models"]) + 1)
        self.assertEqual(len(after["acceptanceTable"]["rows"]), 40)
        self.assertTrue(all(len(b) == len(a) + 1 for a, b in zip(before["acceptanceTable"]["rows"], after["acceptanceTable"]["rows"])))
        self.assertEqual(len(after["tokenTable"]["rows"]), len(before["tokenTable"]["rows"]) + 3)

    def test_observed_zero_is_not_missing(self):
        self.new.update(raw=0, scores=[0] * len(self.config["areas"]), apiPass=0)
        self.new["tokens"] = {key: {field: 0 for field in ("input", "regular", "read", "write", "output", "reason", "total")} for key in ("dev", "review", "total")}
        self.new["time"] = {key: 0 for key in ("dev", "review", "total")}
        result = build(self.config, self.models + [self.new])
        added = next(m for m in result["models"] if m["id"] == self.new["id"])
        self.assertIsNotNone(added["rank"])
        self.assertEqual(added["tokens"]["dev"]["total"], 0)
        self.assertEqual(added["apiPass"], 0)

    def test_duplicate_identity_is_rejected(self):
        with self.assertRaisesRegex(ValueError, "중복 모델 id"):
            build(self.config, self.models + [deepcopy(self.models[0])])

    def test_inconsistent_token_arithmetic_is_rejected(self):
        measured = next(m for m in self.models if m["id"] == "gpt")
        measured["tokens"]["dev"]["total"] += 1
        with self.assertRaisesRegex(ValueError, "입력\\+출력"):
            build(self.config, self.models)

    def test_unexecuted_api_case_is_separate_from_failure(self):
        built = build(self.config, self.models)
        balanced = next(m for m in built["models"] if m["id"] == "balanced")
        self.assertEqual(balanced["apiTotal"], 112)
        self.assertEqual(balanced["apiExecuted"], 111)
        self.assertEqual(balanced["apiNotRun"], 1)
        self.assertEqual(balanced["apiExecuted"] - balanced["apiPass"], 69)
        self.assertAlmostEqual(balanced["apiPass"] / balanced["apiExecuted"] * 100, 37.8378378378)
        balanced = next(m for m in self.models if m["id"] == "balanced")
        balanced["apiNotRun"] = 0
        with self.assertRaisesRegex(ValueError, "API 실행\\+미실행"):
            build(self.config, self.models)

    def test_web_excerpt_removes_relative_and_financial_columns(self):
        source = "# 자료\n\n| 모델 | 원점수 /100 | 80 환산 | 토큰 | credit |\n| --- | --- | --- | --- | --- |\n| 실제 모델 | 80 | 66.0 | 123456 | 45.0 |\n"
        rendered = excerpt(source, True)
        self.assertIn("| 실제 모델 | 80 | 123456 |", rendered)
        self.assertNotIn("credit", rendered)
        self.assertNotIn("66.0", rendered)

    def test_new_usage_scope_and_arithmetic(self):
        for mid, total, duration in (("balanced", 47110323, 4695000),):
            m = next(m for m in self.models if m["id"] == mid)
            self.assertEqual(m["tokens"]["total"]["total"], total)
            self.assertEqual(m["tokens"]["dev"]["total"] + m["tokens"]["review"]["total"], total)
            self.assertEqual(m["time"]["total"], duration)
            self.assertIsNone(m["fullTokens"])
            self.assertFalse(m["efficiencyComparable"])

    def test_tied_scores_share_rank(self):
        tied = deepcopy(next(m for m in self.models if m["id"] == "gpt"))
        tied.update(id="test-tie", name="동점 테스트 전용", tokenRows=None)
        result = build(self.config, self.models + [tied])
        ranks = {m["id"]: m["rank"] for m in result["models"]}
        self.assertEqual(ranks["gpt"], ranks["test-tie"])
        self.assertEqual(ranks["kimi"], ranks["gpt"] + 2)

    def test_build_does_not_mutate_existing_records(self):
        original = deepcopy(self.models)
        built = build(self.config, self.models)
        self.assertEqual(self.models, original)
        for source in self.models:
            result = next(m for m in built["models"] if m["id"] == source["id"])
            for key in ("raw", "scores", "tokens", "time", "acceptanceResults"):
                self.assertEqual(source[key], result[key])

    def test_appendix_preserves_review_source_values_and_scope(self):
        built = build(self.config, self.models)
        review = built["reviewBenchmark"]
        self.assertEqual((review["reviewCases"], review["rounds"], review["confirmedFindings"], review["highFindings"]), (10, 2, 151, 6))
        expected = {
            "hy4flash-free": (18.5, 12, 109, 0),
            "claude-sonnet-5-5": (71, 47, 132, 9),
            "gpt-6.1-terra": (22.5, 15, 19, 9),
            "claude-opus-5-5": (76, 50, 158, 19),
            "gpt-6.2-sol": (45.5, 30, 76, 24),
            "minimax-m3.1-flash": (20.5, 14, 114, 64),
            "deepseek-v4.1-flash": (55, 36, 144, 207),
            "hy4-preview": (30.5, 20, 622, 537),
            "glm-5.3": (37, 25, 454, 673),
            "kimi-k3.1-pro": (25, 17, 375, 819),
        }
        self.assertEqual(len(review["models"]), 10)
        for m in review["models"]:
            self.assertEqual(tuple(m[key] for key in ("averageFindings", "reportedFindingPercent", "averageReviewSeconds", "subscriptionCostCents")), expected[m["id"]])
        ranked = sorted(review["models"], key=lambda m: (m["subscriptionCostCents"], m["sourceOrder"]))
        self.assertEqual([m["id"] for m in ranked], list(expected))
        core = next(m for m in review["models"] if m["id"] == "gpt-6.1-terra")
        self.assertEqual(core["outputTokens"], 7000)
        self.assertEqual({m["id"] for m in built["models"]}, {m["id"] for m in self.models})
        self.assertNotIn("glm-5.3", {m["id"] for m in built["models"]})

    def test_credit_rates_cannot_mix_token_rates_or_negative_usage(self):
        rate = self.config["tokenPricing"]["rates"]["kimi"]
        rate["usdPerMillion"] = 6.43
        with self.assertRaisesRegex(ValueError, "혼합"):
            build(self.config, self.models)
        del rate["usdPerMillion"]
        rate["reviewCredits"] = -1
        with self.assertRaisesRegex(ValueError, "범위를 벗어"):
            build(self.config, self.models)

    def test_layout_changes_are_detected(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            css = root / "styles.css"
            css.write_text("original")
            contract = {"frozenFiles": {"styles.css": hashlib.sha256(css.read_bytes()).hexdigest()}}
            (root / "template-contract.json").write_text(json.dumps(contract))
            verify_template(root)
            css.write_text("unexpected layout change")
            with self.assertRaisesRegex(ValueError, "고정 양식 변경 감지"):
                verify_template(root)


if __name__ == "__main__":
    unittest.main()
