"""Validate model records and build data.js without changing the report layout."""

import argparse
from copy import deepcopy
from datetime import date
import hashlib
import json
import math
import os
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]


def require(condition, message):
    if not condition:
        raise ValueError(message)


def number(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value)


def optional_number(value, label, maximum=None, integer=False):
    require(value is None or number(value), label + ": 숫자 또는 null이어야 합니다")
    if value is not None:
        require(value >= 0 and (maximum is None or value <= maximum), label + ": 범위를 벗어났습니다")
        require(not integer or int(value) == value, label + ": 정수여야 합니다")


def validate_model(m, config):
    mid = m.get("id", "")
    provider = m.get("provider")
    if provider is not None:
        require(isinstance(provider, dict) and isinstance(provider.get("name"), str) and provider["name"].strip(), f"{mid}.provider: 회사명이 필요합니다")
        icon = provider.get("icon", "")
        require(isinstance(icon, str) and re.fullmatch(r"assets/providers/[a-z0-9_-]+\.(?:svg|png|webp)", icon) is not None, f"{mid}.provider.icon: 로컬 아이콘 경로가 필요합니다")
        require((ROOT / icon).is_file(), f"{mid}.provider.icon: 아이콘 파일을 찾을 수 없습니다")
    require(re.fullmatch(r"[a-z0-9][a-z0-9_-]*", mid) is not None, "모델 id는 영문 소문자·숫자·_·-로 작성하세요")
    require(mid != "new-model" and m.get("name") != "추가할 모델명", "예제의 ID와 이름을 실제 모델 정보로 바꾸세요")
    for key in ("name", "folder", "group", "groupLabel", "confidence", "tokenNote", "timeNote", "position", "strength", "weakness"):
        require(isinstance(m.get(key), str) and m[key].strip(), f"{mid}.{key}: 빈 문자열은 허용하지 않습니다")
    require(m["group"] in config["groups"], f"{mid}.group: 등록되지 않은 제품 구분입니다")
    require(number(m.get("order")), f"{mid}.order: 표시 순서가 필요합니다")
    require(isinstance(m.get("pinLast"), bool), f"{mid}.pinLast: true/false가 필요합니다")
    for key, maximum in (("raw", 100), ("implementation", 100), ("coverage", 100), ("docker", config["benchmark"]["dockerMax"])):
        optional_number(m.get(key), f"{mid}.{key}", maximum)
    require(m.get("apiTotal") == config["benchmark"]["apiTotal"], f"{mid}.apiTotal: 공통 API 검사 수와 일치해야 합니다")
    executed = m.get("apiExecuted", m["apiTotal"])
    optional_number(executed, f"{mid}.apiExecuted", m["apiTotal"], True)
    require(number(executed), f"{mid}.apiExecuted: 실행 검사 수가 필요합니다")
    optional_number(m.get("apiPass"), f"{mid}.apiPass", executed, True)
    if "apiNotRun" in m:
        optional_number(m["apiNotRun"], f"{mid}.apiNotRun", m["apiTotal"], True)
        require(number(m["apiNotRun"]) and executed + m["apiNotRun"] == m["apiTotal"], f"{mid}: API 실행+미실행 합계가 공통 검사 수와 다릅니다")
    optional_number(m.get("bugs"), f"{mid}.bugs", integer=True)
    scores = m.get("scores")
    require(isinstance(scores, list) and len(scores) == len(config["areas"]), f"{mid}.scores: 평가 영역 수가 다릅니다")
    for index, value in enumerate(scores):
        optional_number(value, f"{mid}.scores[{index}]", config["areas"][index][1])
    if m.get("raw") is not None and all(number(v) for v in scores):
        require(abs(sum(scores) - m["raw"]) < .001, f"{mid}: 영역별 점수 합과 총점이 다릅니다")
    for key, size, total in (("acceptance", 3, config["benchmark"]["acceptanceTotal"]), ("static", 5, config["benchmark"]["acceptanceTotal"]), ("severity", 3, m.get("bugs"))):
        values = m.get(key)
        require(values is None or (isinstance(values, list) and len(values) == size), f"{mid}.{key}: 값 개수가 다릅니다")
        if values is not None:
            for value in values:
                optional_number(value, f"{mid}.{key}", integer=True)
            if total is not None and all(number(v) for v in values):
                require(sum(values) == total, f"{mid}.{key}: 집계 합계가 다릅니다")
    if m.get("acceptance") is not None and all(number(v) for v in m["acceptance"]) and m.get("coverage") is not None:
        expected = sum(m["acceptance"][:2]) / config["benchmark"]["acceptanceTotal"] * 100
        require(abs(expected - m["coverage"]) < .001, f"{mid}: A 검증 커버리지가 집계와 다릅니다")
    require(isinstance(m.get("tokens"), dict) and isinstance(m.get("time"), dict), f"{mid}: tokens/time 객체가 필요합니다")
    for phase in ("dev", "review", "total"):
        require(phase in m["tokens"] and phase in m["time"], f"{mid}.{phase}: null이라도 키를 명시하세요")
        t = m["tokens"][phase]
        require(t is None or isinstance(t, dict), f"{mid}.tokens.{phase}: 객체 또는 null이 필요합니다")
        if t is not None:
            for key in ("input", "regular", "read", "write", "output", "reason", "total"):
                require(key in t, f"{mid}.tokens.{phase}.{key}: 누락되었습니다")
                optional_number(t[key], f"{mid}.tokens.{phase}.{key}", integer=True)
            if all(number(t[k]) for k in ("input", "regular", "read", "write")):
                require(t["input"] == t["regular"] + t["read"] + t["write"], f"{mid}.{phase}: 입력 토큰 분해가 맞지 않습니다")
            if all(number(t[k]) for k in ("input", "output", "total")):
                require(t["total"] == t["input"] + t["output"], f"{mid}.{phase}: 전체 토큰은 입력+출력이어야 합니다")
            if number(t["reason"]) and number(t["output"]):
                require(t["reason"] <= t["output"], f"{mid}.{phase}: 추론은 출력의 부분집합입니다")
        optional_number(m["time"][phase], f"{mid}.time.{phase}", integer=True)
    if all(number(m["time"][key]) for key in ("dev", "review", "total")):
        require(m["time"]["dev"] + m["time"]["review"] == m["time"]["total"], f"{mid}: 시간 total은 개발+검토 구간 합이어야 합니다")
    presentation = m.get("presentation", {})
    for kind in ("tokens", "time"):
        p = presentation.get(kind, {})
        require(isinstance(p.get("label"), str) and isinstance(p.get("partial"), bool), f"{mid}.presentation.{kind}: 상태와 부분 관측 여부가 필요합니다")
    tp = presentation["tokens"]
    require(isinstance(tp.get("phaseNotes"), dict) and isinstance(tp.get("extras"), list), f"{mid}: 토큰 범위 설명이 필요합니다")
    for phase in ("dev", "review"):
        if m["tokens"][phase] is None:
            require(tp.get("missingNote"), f"{mid}: 미수집 이유를 명시하세요")
    require(isinstance(m.get("summary"), dict), f"{mid}.summary가 필요합니다")
    rec = m["summary"].get("recommendation")
    require(rec is None or isinstance(rec, dict), f"{mid}: 권고는 객체 또는 null이어야 합니다")
    if rec is not None:
        require(all(isinstance(rec.get(k), str) and rec[k] for k in ("label", "action", "detail")), f"{mid}: 권고 명칭·조치·근거가 필요합니다")
        require(rec.get("tone") in ("blue", "amber", "neutral"), f"{mid}: 권고 색상은 blue/amber/neutral 중 하나입니다")
        require(number(rec.get("order")), f"{mid}: 권고 카드 순서가 필요합니다")
    criteria = {item["id"] for item in config["acceptanceCriteria"]}
    results = m.get("acceptanceResults")
    require(isinstance(results, dict) and set(results) == criteria, f"{mid}: A01~A40 결과를 모두 작성하세요(미수집=null)")
    for key, value in results.items():
        require(value is None or re.fullmatch(r"[CPMDU]/(?:PASS|FAIL|NOT_RUN|P|F|—)", value) is not None, f"{mid}.{key}: 판정 형식이 잘못되었습니다")
    require(all(isinstance(value, str) for value in tp["extras"]), f"{mid}: 추가 범위 설명은 문자열 목록이어야 합니다")
    require(all(isinstance(value, str) for value in tp["phaseNotes"].values()), f"{mid}: 단계 설명은 문자열이어야 합니다")
    rows = m.get("tokenRows")
    require(rows is None or isinstance(rows, list), f"{mid}.tokenRows: 배열 또는 null이 필요합니다")
    if rows is not None:
        require(all(isinstance(row, list) and len(row) == len(config["tokenTableHeaders"]) for row in rows), f"{mid}: 토큰 상세 표의 열 수가 다릅니다")
    require(isinstance(m.get("efficiencyComparable"), bool), f"{mid}: 효율 비교 가능 여부가 필요합니다")
    if m["efficiencyComparable"]:
        require(number(m.get("raw")) and m["tokens"]["total"] is not None and number(m["tokens"]["total"]["total"]) and m["tokens"]["total"]["total"] > 0 and number(m["time"]["total"]) and m["time"]["total"] > 0, f"{mid}: 효율 비교에는 관측된 양수 토큰·시간과 점수가 필요합니다")
    require(all(isinstance(row, list) and len(row) == len(config["limitsTable"]["headers"]) for row in m.get("limitations", [])), f"{mid}: 수집 한계 표의 열 수가 다릅니다")
    if m["efficiencyComparable"]:
        require(isinstance(m.get("efficiencyNote"), str) and m["efficiencyNote"].strip(), f"{mid}: 효율 비교 근거가 필요합니다")
    require(isinstance(m.get("evidence", []), list), f"{mid}: 근거는 목록이어야 합니다")
    for evidence in m.get("evidence", []):
        require(isinstance(evidence, dict), f"{mid}: 근거 항목은 객체여야 합니다")
        require(isinstance(evidence.get("title"), str) and isinstance(evidence.get("url"), str), f"{mid}: 근거의 제목과 링크가 필요합니다")
        require(not re.match(r"(?i)(?!https?:|mailto:)[a-z][a-z0-9+.-]*:", evidence["url"]), f"{mid}: 허용되지 않은 근거 링크입니다")


def token_rows(model):
    if model.get("tokenRows") is not None:
        return model["tokenRows"]
    rows = []
    for key, label in (("dev", "개발"), ("review", "검토"), ("total", "합계")):
        values = model["tokens"][key] or {}
        formatted = ["미수집" if values.get(field) is None else f"{values[field]:,}" for field in ("input", "regular", "read", "write", "output", "reason", "total")]
        rows.append([model["name"], label, *formatted, model["tokenNote"]])
    return rows


def review_benchmark(config):
    source = config.get("appendixFile")
    if source is None:
        return None
    require(isinstance(source, str) and re.fullmatch(r"appendix/[a-z0-9-]+\.json", source), "부록: 로컬 데이터 경로가 필요합니다")
    data = json.loads((ROOT / source).read_text())
    date.fromisoformat(data["sourceDate"])
    for key in ("reviewCases", "rounds", "confirmedFindings", "highFindings", "reconstructedCases"):
        optional_number(data.get(key), "부록." + key, integer=True)
        require(number(data.get(key)), "부록: 시험 조건이 필요합니다")
    require(data["reviewCases"] > 0 and data["rounds"] > 0 and data["confirmedFindings"] > 0, "부록: 시험 분모는 양수여야 합니다")
    rows = data.get("models")
    require(isinstance(rows, list) and rows, "부록: 모델 자료가 필요합니다")
    require(len({m["id"] for m in rows}) == len(rows), "부록: 중복 모델 id")
    for m in rows:
        for key in ("subscriptionCostCents", "openRouterCostCents", "inputTokens", "outputTokens", "averageReviewSeconds", "sourceOrder"):
            optional_number(m.get(key), "부록." + key, integer=True)
            require(number(m.get(key)), "부록: 비용·사용량은 관측값이 필요합니다")
        optional_number(m.get("averageFindings"), "부록.averageFindings", data["confirmedFindings"])
        for key in ("reportedFindingPercent", "precisionPercent"):
            optional_number(m.get(key), "부록." + key, 100)
        require(isinstance(m.get("highFindings"), list) and len(m["highFindings"]) == data["rounds"], "부록: 회차별 HIGH 발견 건수가 필요합니다")
        for count in m["highFindings"]:
            optional_number(count, "부록.highFindings", data["highFindings"], True)
        icon = m.get("provider", {}).get("icon", "")
        require(isinstance(icon, str) and re.fullmatch(r"assets/providers/[a-z0-9_-]+\.(?:svg|png|webp)", icon) and (ROOT / icon).is_file(), "부록: 로컬 회사 아이콘이 필요합니다")
    return deepcopy(data)


def build(config, models):
    require(config.get("schemaVersion") == 1, "지원하는 데이터 양식은 schemaVersion 1입니다")
    date.fromisoformat(config["date"])
    require(abs(sum(area[1] for area in config["areas"]) - 100) < .001, "공통 배점은 100점이어야 합니다")
    require(len(config["acceptanceCriteria"]) == config["benchmark"]["acceptanceTotal"], "인수 기준 수가 다릅니다")
    require(models, "모델이 하나 이상 필요합니다")
    pricing = config.get("pricing")
    require(isinstance(pricing, dict) and pricing.get("currency") == "USD", "pricing: USD 요금제 자료가 필요합니다")
    date.fromisoformat(pricing["sourceDate"])
    require([p.get("id") for p in pricing.get("plans", [])] == ["pro", "team"], "pricing: Pro·Team 순서로 두 요금제를 작성하세요")
    for plan in pricing["plans"]:
        for key in ("referenceMonthlyCents", "listedMonthlyCents", "yearlyCents", "baseCredits", "bonusCredits"):
            optional_number(plan.get(key), "pricing." + key, integer=True)
            require(number(plan.get(key)), "pricing." + key + ": 숫자가 필요합니다")
        require(plan["listedMonthlyCents"] > 0 and plan["referenceMonthlyCents"] > 0, "pricing: 월 가격은 양수여야 합니다")
        require(isinstance(plan.get("referenceUnconfirmed"), bool), "pricing: 참고가격 확인 상태가 필요합니다")
        require(isinstance(plan.get("features"), list) and all(isinstance(v, str) for v in plan["features"]), "pricing: 기능 목록이 필요합니다")
        require("dailyReward" in plan, "pricing: 미표기 일일 보상은 null로 명시하세요")
        optional_number(plan["dailyReward"], "pricing.dailyReward", integer=True)
    token_pricing = config.get("tokenPricing")
    if token_pricing is not None:
        require(isinstance(token_pricing, dict) and token_pricing.get("currency") == "USD", "tokenPricing: USD 환산 단가가 필요합니다")
        require(token_pricing.get("basis") == "mixed-credits-and-token-estimate", "tokenPricing: 모델별 크레딧/토큰 계산 기준이 필요합니다")
        require(token_pricing.get("denominator") == "displayed-dev-review-total-including-cache", "tokenPricing: 토큰 그래프의 캐시 포함 개발·검토 합계 기준이 필요합니다")
        require(isinstance(token_pricing.get("rates"), dict), "tokenPricing.rates: 모델별 단가가 필요합니다")
        for mid, rate in token_pricing["rates"].items():
            require(isinstance(rate, dict), f"tokenPricing.{mid}: 단가 객체가 필요합니다")
            require(rate.get("method") in ("tokens", "credits"), f"tokenPricing.{mid}: tokens/credits 구분이 필요합니다")
            if rate["method"] == "tokens":
                optional_number(rate.get("usdPerMillion"), f"tokenPricing.{mid}.usdPerMillion")
            else:
                for field in ("devCredits", "reviewCredits", "usdPerCredit"):
                    require(field in rate, f"tokenPricing.{mid}.{field}: null이라도 명시하세요")
                    optional_number(rate[field], f"tokenPricing.{mid}.{field}")
                require(rate.get("usdPerMillion") is None, f"tokenPricing.{mid}: 크레딧 계산에 토큰 단가를 혼합하지 마세요")
            require(all(isinstance(rate.get(k), str) and rate[k].strip() for k in ("alias", "basis")), f"tokenPricing.{mid}: 모델 별칭·근거가 필요합니다")
    ids = [m.get("id") for m in models]
    require(len(ids) == len(set(ids)), "중복 모델 id가 있습니다")
    require(len({m.get("name") for m in models}) == len(models), "중복 표시 모델명이 있습니다")
    for model in models:
        validate_model(model, config)
    for key in ("defaultModelId", "primaryReferenceId"):
        require(config["report"].get(key) in ids, f"report.{key}: 존재하는 모델 id를 지정하세요")
    result_models = sorted(deepcopy(models), key=lambda m: (m["order"], m["id"]))
    for model in result_models:
        model["rank"] = None if model["raw"] is None else 1 + sum(other["raw"] is not None and other["raw"] > model["raw"] for other in result_models)
    displayed = sorted(result_models, key=lambda m: m["pinLast"])
    limits = deepcopy(config["limitsTable"])
    for model in displayed:
        limits["rows"].extend(model.get("limitations", []))
    return {
        "schemaVersion": 1,
        "templateVersion": config["templateVersion"],
        "date": config["date"],
        "benchmark": config["benchmark"],
        "report": config["report"],
        "groups": config["groups"],
        "models": result_models,
        "areas": config["areas"],
        "sources": config["sources"],
        "pricing": deepcopy(pricing),
        "tokenPricing": deepcopy(token_pricing),
        "reviewBenchmark": review_benchmark(config),
        "tokenTable": {"headers": config["tokenTableHeaders"], "rows": [row for model in displayed for row in token_rows(model)]},
        "acceptanceTable": {
            "headers": ["ID", "명세 시나리오", *[m["name"] for m in result_models], "근거 그룹"],
            "rows": [[item["id"], item["scenario"], *[m["acceptanceResults"][item["id"]] for m in result_models], item["sourceGroup"]] for item in config["acceptanceCriteria"]],
        },
        "limitsTable": limits,
    }


def verify_template(root):
    path = root / "template-contract.json"
    if not path.exists():
        return
    for name, expected in json.loads(path.read_text())["frozenFiles"].items():
        actual = hashlib.sha256((root / name).read_bytes()).hexdigest()
        require(actual == expected, f"고정 양식 변경 감지: {name}. 명시적인 디자인 변경 요청이 없다면 원래 파일을 복원하세요")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=ROOT)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    root = args.root.resolve()
    verify_template(root)
    config = json.loads((root / "report-config.json").read_text())
    models = [json.loads(path.read_text()) for path in sorted((root / "models").glob("*.json"))]
    data = build(config, models)
    rendered = "window.REPORT_DATA = " + json.dumps(data, ensure_ascii=False, indent=2, allow_nan=False) + ";\n"
    output = args.output or root / "data.js"
    if args.check:
        require(output.exists() and output.read_text() == rendered, "data.js가 모델 원본과 다릅니다. build_report.py를 먼저 실행하세요")
        print(f"양식·데이터 검증 완료: {len(models)}개 모델")
    else:
        output.parent.mkdir(parents=True, exist_ok=True)
        temporary = output.with_name(output.name + ".tmp")
        temporary.write_text(rendered)
        os.replace(temporary, output)
        print(f"생성 완료: {output} ({len(models)}개 모델)")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, KeyError, TypeError) as exc:
        print("오류:", exc, file=sys.stderr)
        sys.exit(1)
