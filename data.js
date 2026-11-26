window.REPORT_DATA = {
  "schemaVersion": 1,
  "templateVersion": "1.19.7",
  "date": "2026-11-26",
  "benchmark": {
    "apiTotal": 112,
    "acceptanceTotal": 40,
    "dockerMax": 15
  },
  "report": {
    "defaultModelId": "kimi",
    "primaryReferenceId": "gpt",
    "assessmentUpdated": "2026-11-25",
    "preservedAssessmentDate": "2026-11-24"
  },
  "groups": {
    "baseline": "기준 모델",
    "codebuddy": "Codebuddy",
    "other": "기타 모델"
  },
  "models": [
    {
      "id": "gpt",
      "name": "GPT-6.1-sol",
      "folder": "chatgpt_gpt-6.1-sol",
      "group": "baseline",
      "raw": 97.0,
      "implementation": 100.0,
      "apiPass": 112,
      "coverage": 7.5,
      "bugs": 0,
      "docker": 15.0,
      "confidence": "중상",
      "scores": [
        30.0,
        20.0,
        15.0,
        15.0,
        10.0,
        2.5,
        4.5
      ],
      "acceptance": [
        3,
        0,
        37
      ],
      "static": [
        40,
        0,
        0,
        0,
        0
      ],
      "severity": [
        0,
        0,
        0
      ],
      "tokens": {
        "dev": {
          "input": 30644931,
          "regular": 214083,
          "read": 30430848,
          "write": 0,
          "output": 142948,
          "reason": 48712,
          "total": 30787879
        },
        "review": {
          "input": 13287666,
          "regular": 616818,
          "read": 12670848,
          "write": 0,
          "output": 46721,
          "reason": 15448,
          "total": 13334387
        },
        "total": {
          "input": 43932597,
          "regular": 830901,
          "read": 43101696,
          "write": 0,
          "output": 189669,
          "reason": 64160,
          "total": 44122266
        }
      },
      "fullTokens": 44122266,
      "tokenNote": "로컬 응답 195개. 두 완료 요청의 합계. 서버 내부 미노출 호출은 확인 불가.",
      "time": {
        "dev": 4155451,
        "review": 1290101,
        "total": 5445552
      },
      "timeNote": "앱 durationMs. 전체 창 약 1시간31분11초, 요청 사이 약26초. 순수 AI/사용자 대기=null.",
      "position": "균형 잡힌 기준 구현",
      "strength": "엄격 입력·범위 제어·가드·잔액 집계가 고르게 연결됐다.",
      "weakness": "업무 코드와 프런트가 압축되어 유지보수성이 낮다. 전체 동시성·복구는 독립 미검증.",
      "order": 10,
      "pinLast": false,
      "apiTotal": 112,
      "groupLabel": "기준 모델",
      "presentation": {
        "tokens": {
          "label": "관측값",
          "sourceLabel": "두 완료 요청 합계",
          "partial": false,
          "phaseNotes": {
            "dev": "개발 133개 응답 합계. 로컬 완료 요청 기록이며 서버 내부 미노출 호출은 확인 불가.",
            "review": "검토 62개 응답 합계. 개발 응답과 중복 합산하지 않음."
          },
          "missingNote": "usage 미수집",
          "extras": []
        },
        "time": {
          "label": "요청 경과",
          "partial": false
        }
      },
      "summary": {
        "shortName": "GPT-6.1-sol",
        "rosterNote": "균형 잡힌 기준 구현",
        "apiNote": "공통 API 검사 결과이며 전체 업무 합격과 구분합니다.",
        "recommendation": null,
        "tokenMetricNote": "개발·검토 두 완료 요청의 로컬 기록.\n캐시 읽기 포함, 추론 중복 합산 제외."
      },
      "efficiencyComparable": true,
      "acceptanceResults": {
        "A01": "C/—",
        "A02": "C/PASS",
        "A03": "C/—",
        "A04": "C/—",
        "A05": "C/PASS",
        "A06": "C/—",
        "A07": "C/PASS",
        "A08": "C/—",
        "A09": "C/—",
        "A10": "C/—",
        "A11": "C/—",
        "A12": "C/—",
        "A13": "C/—",
        "A14": "C/—",
        "A15": "C/—",
        "A16": "C/—",
        "A17": "C/—",
        "A18": "C/—",
        "A19": "C/—",
        "A20": "C/—",
        "A21": "C/—",
        "A22": "C/—",
        "A23": "C/—",
        "A24": "C/—",
        "A25": "C/—",
        "A26": "C/—",
        "A27": "C/—",
        "A28": "C/—",
        "A29": "C/—",
        "A30": "C/—",
        "A31": "C/—",
        "A32": "C/—",
        "A33": "C/—",
        "A34": "C/—",
        "A35": "C/—",
        "A36": "C/—",
        "A37": "C/—",
        "A38": "C/—",
        "A39": "C/—",
        "A40": "C/—"
      },
      "tokenRows": [
        [
          "GPT-6.1-sol",
          "개발",
          "30,644,931",
          "214,083",
          "30,430,848",
          "0",
          "142,948",
          "48,712",
          "30,787,879",
          "133개 응답"
        ],
        [
          "GPT-6.1-sol",
          "검토",
          "13,287,666",
          "616,818",
          "12,670,848",
          "0",
          "46,721",
          "15,448",
          "13,334,387",
          "62개 응답"
        ],
        [
          "GPT-6.1-sol",
          "합계",
          "43,932,597",
          "830,901",
          "43,101,696",
          "0",
          "189,669",
          "64,160",
          "44,122,266",
          "동일 소비 1회 합계"
        ]
      ],
      "evidence": [],
      "efficiencyNote": "동일한 두 완료 요청 범위의 참고 지표",
      "provider": {
        "name": "OpenAI",
        "icon": "assets/providers/openai.svg"
      },
      "rank": 2
    },
    {
      "id": "opus",
      "name": "Opus 5.5",
      "folder": "claude_opus-5.5",
      "group": "baseline",
      "raw": 98.0,
      "implementation": 98.75,
      "apiPass": 110,
      "coverage": 10.0,
      "bugs": 1,
      "docker": 15.0,
      "confidence": "중상",
      "scores": [
        29.5,
        19.0,
        15.0,
        15.0,
        10.0,
        5.0,
        4.5
      ],
      "acceptance": [
        3,
        1,
        36
      ],
      "static": [
        39,
        0,
        0,
        1,
        0
      ],
      "severity": [
        0,
        0,
        1
      ],
      "tokens": {
        "dev": {
          "input": 58525678,
          "regular": 280,
          "read": 57954474,
          "write": 570924,
          "output": 347611,
          "reason": 54155,
          "total": 58873289
        },
        "review": {
          "input": 19135796,
          "regular": 58,
          "read": 19072731,
          "write": 63007,
          "output": 52646,
          "reason": 13095,
          "total": 19188442
        },
        "total": {
          "input": 77661474,
          "regular": 338,
          "read": 77027205,
          "write": 633931,
          "output": 400257,
          "reason": 67250,
          "total": 78061731
        }
      },
      "fullTokens": 78061731,
      "tokenNote": "요청별 추출 JSON의 164개 호출. 원본 transcript 전체를 다시 검증한 수치는 아님.",
      "time": {
        "dev": 3182605,
        "review": 615224,
        "total": 3797829
      },
      "timeNote": "요청 수신~마지막 assistant 기록. 전체 창 1시간37분1.974초, 요청 사이33분44.145초. A/W 분리는 개발자 재구성 기준.",
      "position": "구조와 유지보수성의 강점",
      "strength": "기능별 서비스·DTO·권한 재조회가 명확하다.",
      "weakness": "로그아웃 본문 계약 1개 결함군. 기준 모델과 1점 차이는 정성 평가에 민감하다.",
      "order": 20,
      "pinLast": false,
      "apiTotal": 112,
      "groupLabel": "기준 모델",
      "presentation": {
        "tokens": {
          "label": "관측값",
          "sourceLabel": "두 완료 요청 합계",
          "partial": false,
          "phaseNotes": {
            "dev": "개발 136개 호출의 추출 JSON. 원본 transcript 전체를 이번에 재검증한 값은 아님.",
            "review": "검토 28개 호출의 추출 JSON. 원본 transcript 재검증 범위는 동일하게 제한됨."
          },
          "missingNote": "usage 미수집",
          "extras": []
        },
        "time": {
          "label": "요청 경과",
          "partial": false
        }
      },
      "summary": {
        "shortName": "Opus 5.5",
        "rosterNote": "구조와 유지보수성의 강점",
        "apiNote": "공통 API 검사 결과이며 전체 업무 합격과 구분합니다.",
        "recommendation": null
      },
      "efficiencyComparable": true,
      "acceptanceResults": {
        "A01": "C/—",
        "A02": "C/PASS",
        "A03": "C/—",
        "A04": "C/—",
        "A05": "C/PASS",
        "A06": "C/—",
        "A07": "C/PASS",
        "A08": "C/—",
        "A09": "C/—",
        "A10": "C/—",
        "A11": "C/—",
        "A12": "C/—",
        "A13": "C/—",
        "A14": "C/—",
        "A15": "C/—",
        "A16": "C/—",
        "A17": "C/—",
        "A18": "C/—",
        "A19": "C/—",
        "A20": "C/—",
        "A21": "C/—",
        "A22": "C/—",
        "A23": "C/—",
        "A24": "C/—",
        "A25": "C/—",
        "A26": "C/—",
        "A27": "C/—",
        "A28": "C/—",
        "A29": "C/—",
        "A30": "C/—",
        "A31": "C/—",
        "A32": "C/—",
        "A33": "C/—",
        "A34": "C/—",
        "A35": "C/—",
        "A36": "C/—",
        "A37": "C/—",
        "A38": "C/—",
        "A39": "D/FAIL",
        "A40": "C/—"
      },
      "tokenRows": [
        [
          "Opus 5.5",
          "개발",
          "58,525,678",
          "280",
          "57,954,474",
          "570,924",
          "347,611",
          "54,155",
          "58,873,289",
          "136개 호출; 쓰기 1h TTL"
        ],
        [
          "Opus 5.5",
          "검토",
          "19,135,796",
          "58",
          "19,072,731",
          "63,007",
          "52,646",
          "13,095",
          "19,188,442",
          "28개 호출; 쓰기 1h TTL"
        ],
        [
          "Opus 5.5",
          "합계",
          "77,661,474",
          "338",
          "77,027,205",
          "633,931",
          "400,257",
          "67,250",
          "78,061,731",
          "5분 쓰기는 기록상 0"
        ]
      ],
      "evidence": [],
      "efficiencyNote": "동일한 두 완료 요청 범위의 참고 지표",
      "provider": {
        "name": "Anthropic",
        "icon": "assets/providers/anthropic-mark.svg"
      },
      "rank": 1
    },
    {
      "id": "balanced",
      "name": "Balanced",
      "folder": "codebuddy_balanced",
      "group": "codebuddy",
      "raw": 39.5,
      "implementation": 40,
      "apiPass": 42,
      "coverage": 20,
      "bugs": 20,
      "docker": 6,
      "confidence": "중간",
      "scores": [
        14,
        6.5,
        6.5,
        6,
        3,
        2.5,
        1
      ],
      "acceptance": [
        2,
        6,
        32
      ],
      "static": [
        4,
        18,
        12,
        6,
        0
      ],
      "severity": [
        5,
        13,
        2
      ],
      "tokens": {
        "dev": {
          "input": 32245773,
          "regular": 286221,
          "read": 31959552,
          "write": 0,
          "output": 80576,
          "reason": 0,
          "total": 32326349
        },
        "review": {
          "input": 14744219,
          "regular": 95643,
          "read": 14648576,
          "write": 0,
          "output": 39755,
          "reason": 0,
          "total": 14783974
        },
        "total": {
          "input": 46989992,
          "regular": 381864,
          "read": 46608128,
          "write": 0,
          "output": 120331,
          "reason": 0,
          "total": 47110323
        }
      },
      "fullTokens": null,
      "tokenNote": "새 실행의 개발·검토 UI 전사 소계 47,110,323토큰. 산술은 일치하지만 원본 화면·전체 호출 포괄은 미대조이며 프로젝트 전체는 null. 이전 실행과 합산하지 않음.",
      "time": {
        "dev": 3180000,
        "review": 1515000,
        "total": 4695000
      },
      "timeNote": "새 실행의 기록상 Elapsed: 개발53분·검토25분15초, 합1시간18분15초. 원문의52분60초는53분으로 정규화. 기록상15:54:09~17:12:24와 산술 일치하나 절대 시각·실제 전체·AI 활성·입력 대기는 독립 미확인. 이전 실행과 합산하지 않음.",
      "position": "핵심 업무 재구현·권한 보완",
      "strength": "로그인·계층 분리·localhost 배포는 확인했다. 새 개발·검토 토큰과 시간이 기록됐다.",
      "weakness": "타 직원 상세 노출과 프로필·잔액 API 오류, 로그인 뒤 업무 UI 누락이 있다. 최신 권한·업무 불변식과 재현 가능한 빌드도 보완해야 한다.",
      "order": 30,
      "pinLast": true,
      "apiTotal": 112,
      "groupLabel": "Codebuddy",
      "presentation": {
        "tokens": {
          "label": "기록 소계",
          "sourceLabel": "개발자 UI 전사 소계 · 전체 포괄 미확인",
          "partial": true,
          "phaseNotes": {
            "dev": "새 실행의 개발 UI 전사 32,326,349토큰. 원본 화면·호출별 전체 포괄은 이번에 직접 대조하지 못함.",
            "review": "새 코드 검토·개선 UI 전사 14,783,974토큰. 이전 실행의 시간 분리 문서 응답과 별개."
          },
          "missingNote": "관측 자료 없음",
          "extras": [
            "산술 확인 범위의 합계이며 프로젝트 전체 토큰·실제 모델 ID는 null. 이전 개발·문서 응답 사용량과 합산하지 않음."
          ]
        },
        "time": {
          "label": "기록상 Elapsed",
          "partial": true
        }
      },
      "summary": {
        "shortName": "Balanced",
        "rosterNote": "Balanced 선택 모드 · 업무 UI·권한 보완",
        "apiNote": "공통 API 검사 결과이며 전체 업무 합격과 구분합니다.",
        "recommendation": {
          "label": "재구현 검토",
          "tone": "neutral",
          "action": "직원 범위 차단·핵심 화면 구현",
          "detail": "타 직원 상세 노출을 우선 차단하고 프로필·잔액·휴가 API와 실제 업무 화면을 구현한 뒤 회귀 검증해야 합니다. 새 사용량은 전사 소계이며 전체 소비가 아닙니다.",
          "order": 40
        }
      },
      "efficiencyComparable": false,
      "acceptanceResults": {
        "A01": "P/—",
        "A02": "C/PASS",
        "A03": "P/—",
        "A04": "D/FAIL",
        "A05": "C/PASS",
        "A06": "C/—",
        "A07": "D/FAIL",
        "A08": "P/—",
        "A09": "D/FAIL",
        "A10": "M/—",
        "A11": "M/—",
        "A12": "P/—",
        "A13": "P/—",
        "A14": "P/—",
        "A15": "P/—",
        "A16": "P/—",
        "A17": "P/—",
        "A18": "M/—",
        "A19": "P/—",
        "A20": "M/—",
        "A21": "P/—",
        "A22": "M/—",
        "A23": "P/—",
        "A24": "C/—",
        "A25": "D/FAIL",
        "A26": "P/—",
        "A27": "M/—",
        "A28": "M/—",
        "A29": "M/—",
        "A30": "M/—",
        "A31": "M/—",
        "A32": "M/—",
        "A33": "P/—",
        "A34": "P/—",
        "A35": "P/—",
        "A36": "P/—",
        "A37": "M/—",
        "A38": "P/—",
        "A39": "D/FAIL",
        "A40": "D/FAIL"
      },
      "tokenRows": null,
      "evidence": [
        {
          "title": "완성도 평가",
          "url": "sources/보고서_완성도.html"
        },
        {
          "title": "토큰·시간 근거",
          "url": "sources/보고서_사용량.html"
        }
      ],
      "apiExecuted": 111,
      "apiNotRun": 1,
      "limitations": [
        [
          "Balanced 새 실행",
          "UI 전사 두 구간 47,110,323토큰·78분15초",
          "산술 확인. 원본 화면·실제 모델·전체 호출 포괄은 미확인. 이전 실행과 합산하지 않음."
        ]
      ],
      "provider": {
        "name": "Tencent · Balanced 자동 모드",
        "icon": "assets/providers/tencent-mark.svg"
      },
      "rank": 6
    },
    {
      "id": "deepseek",
      "name": "DeepSeek V4.1 Flash",
      "folder": "codebuddy_deepseek-v4.1-flash",
      "group": "codebuddy",
      "raw": 57.5,
      "implementation": 60.0,
      "apiPass": 45,
      "coverage": 20.0,
      "bugs": 15,
      "docker": 14.5,
      "confidence": "중간",
      "scores": [
        20.0,
        8.0,
        7.0,
        14.5,
        3.5,
        3.0,
        1.5
      ],
      "acceptance": [
        1,
        7,
        32
      ],
      "static": [
        11,
        17,
        3,
        9,
        0
      ],
      "severity": [
        2,
        10,
        3
      ],
      "tokens": {
        "dev": {
          "input": 37206731,
          "regular": 659659,
          "read": 36547072,
          "write": 0,
          "output": 258733,
          "reason": 0,
          "total": 37465464
        },
        "review": {
          "input": 38860610,
          "regular": 610242,
          "read": 38250368,
          "write": 0,
          "output": 100518,
          "reason": 0,
          "total": 38961128
        },
        "total": {
          "input": 76067341,
          "regular": 1269901,
          "read": 74797440,
          "write": 0,
          "output": 359251,
          "reason": 0,
          "total": 76426592
        }
      },
      "fullTokens": 76426592,
      "tokenNote": "프록시 성공 1,079건을 모델·시간창으로 귀속. task ID로 다른 작업 혼입까지 배제하지 못함.",
      "time": {
        "dev": 8449000,
        "review": 4060000,
        "total": 12509000
      },
      "timeNote": "문서상 연속 관측창 3시간28분29초. 검토 시작은 개발 종료로 추론. mtime 공백을 사용자 대기로 채택하지 않음.",
      "position": "권한·업무 정확성의 후속 검증 대상",
      "strength": "근태·연차·대시보드 등 주요 업무의 기본 구현이 존재한다.",
      "weakness": "타 직원 정보 조회와 대시보드 중단이 재현됐다. 예약 잔액·원자성 위험도 있다.",
      "order": 40,
      "pinLast": false,
      "apiTotal": 112,
      "groupLabel": "Codebuddy",
      "presentation": {
        "tokens": {
          "label": "관측값",
          "sourceLabel": "모델·시간창 귀속",
          "partial": false,
          "phaseNotes": {
            "dev": "성공 565건의 모델·시간창 귀속. task ID 수준의 전용 귀속은 미확인.",
            "review": "성공 514건의 모델·시간창 귀속. 같은 모델의 다른 작업 혼입 가능성은 배제하지 못함."
          },
          "missingNote": "usage 미수집",
          "extras": []
        },
        "time": {
          "label": "관측창",
          "partial": false
        }
      },
      "summary": {
        "shortName": "DeepSeek",
        "rosterNote": "권한·업무 정확성 재검증",
        "apiNote": "공통 API 검사 결과이며 전체 업무 합격과 구분합니다.",
        "recommendation": {
          "label": "후속 검증",
          "tone": "amber",
          "action": "직원 정보 접근 권한·업무 정합성 재검증",
          "detail": "권한·업무 정합성을 수정하고, 같은 요청 범위에서 토큰과 시간을 다시 측정해야 합니다.",
          "order": 30
        }
      },
      "efficiencyComparable": false,
      "acceptanceResults": {
        "A01": "C/—",
        "A02": "C/PASS",
        "A03": "C/—",
        "A04": "D/FAIL",
        "A05": "D/FAIL",
        "A06": "C/—",
        "A07": "D/FAIL",
        "A08": "P/—",
        "A09": "D/FAIL",
        "A10": "P/—",
        "A11": "P/—",
        "A12": "P/—",
        "A13": "C/—",
        "A14": "P/—",
        "A15": "P/—",
        "A16": "P/—",
        "A17": "P/—",
        "A18": "M/—",
        "A19": "P/—",
        "A20": "P/—",
        "A21": "P/—",
        "A22": "C/—",
        "A23": "P/—",
        "A24": "P/—",
        "A25": "D/FAIL",
        "A26": "C/—",
        "A27": "P/—",
        "A28": "P/—",
        "A29": "M/—",
        "A30": "P/—",
        "A31": "D/—",
        "A32": "M/—",
        "A33": "D/—",
        "A34": "P/—",
        "A35": "C/—",
        "A36": "C/—",
        "A37": "C/—",
        "A38": "C/—",
        "A39": "D/FAIL",
        "A40": "D/FAIL"
      },
      "tokenRows": [
        [
          "DeepSeek V4.1 Flash",
          "개발",
          "37,206,731",
          "659,659",
          "36,547,072",
          "0",
          "258,733",
          "0",
          "37,465,464",
          "upstream_hook 565건"
        ],
        [
          "DeepSeek V4.1 Flash",
          "검토",
          "38,860,610",
          "610,242",
          "38,250,368",
          "0",
          "100,518",
          "0",
          "38,961,128",
          "upstream_hook 514건"
        ],
        [
          "DeepSeek V4.1 Flash",
          "귀속창 합계",
          "76,067,341",
          "1,269,901",
          "74,797,440",
          "0",
          "359,251",
          "0",
          "76,426,592",
          "1,079건. 추론 0은 로그 필드값"
        ]
      ],
      "evidence": [],
      "provider": {
        "name": "DeepSeek",
        "icon": "assets/providers/deepseek.png"
      },
      "rank": 5
    },
    {
      "id": "hy4",
      "name": "HY4 Preview",
      "folder": "codebuddy_hy4-preview",
      "group": "codebuddy",
      "raw": 80.0,
      "implementation": 88.75,
      "apiPass": 109,
      "coverage": 12.5,
      "bugs": 4,
      "docker": 12.0,
      "confidence": "중간",
      "scores": [
        27.0,
        17.5,
        12.5,
        12.0,
        6.5,
        2.0,
        2.5
      ],
      "acceptance": [
        3,
        2,
        35
      ],
      "static": [
        31,
        7,
        0,
        2,
        0
      ],
      "severity": [
        1,
        2,
        1
      ],
      "tokens": {
        "dev": {
          "input": 30564010,
          "regular": 2075242,
          "read": 28488768,
          "write": 0,
          "output": 380885,
          "reason": 191313,
          "total": 30944895
        },
        "review": {
          "input": 44309143,
          "regular": 2305943,
          "read": 42003200,
          "write": 0,
          "output": 427930,
          "reason": 282356,
          "total": 44737073
        },
        "total": {
          "input": 81214046,
          "regular": 4789534,
          "read": 76424512,
          "write": 0,
          "output": 893285,
          "reason": 529061,
          "total": 82107331
        }
      },
      "fullTokens": null,
      "tokenNote": "W1·W3 관측 소계. W2 6,425,363토큰은 단계 미분류. 실패·취소 7건의 usage 누락.",
      "time": {
        "dev": 8077000,
        "review": 17496000,
        "total": 25573000
      },
      "timeNote": "부분 창 합7시간6분13초. 30분 공백 포함 전체 창7시간36분13초. 실제 요청 전체/순수 작업시간=null.",
      "position": "직원 화면 수정 후 파일럿 후보",
      "strength": "공통 API 109/112 통과. 근태·연차·대시보드 기반이 충실하다.",
      "weakness": "직원 화면 초기화 오류가 핵심 업무를 막는다. 사용량 7건 누락과 긴 재검증 창이 있다.",
      "order": 50,
      "pinLast": false,
      "apiTotal": 112,
      "groupLabel": "Codebuddy",
      "presentation": {
        "tokens": {
          "label": "관측 소계",
          "sourceLabel": "관측 소계 · 전체 미수집",
          "partial": true,
          "phaseNotes": {
            "dev": "W1 개발 관측 411건 소계. 취소 2건 usage 미수집으로 개발 전체=null.",
            "review": "W3 검토·후속 재검증 569건 소계. 실패·취소 5건 usage 미수집."
          },
          "missingNote": "usage 미수집",
          "extras": [
            "단계 미분류 W2 포함 관측 합: 82,107,331 토큰"
          ]
        },
        "time": {
          "label": "부분 관측창",
          "partial": true
        }
      },
      "summary": {
        "shortName": "HY4",
        "rosterNote": "직원 화면 수정 후 파일럿",
        "apiNote": "직원 화면 중단은 별도 확인.\nAPI 통과가 전체 업무 합격은 아닙니다.",
        "recommendation": {
          "label": "수정 후 검토",
          "tone": "blue",
          "action": "직원 화면 오류 수정",
          "detail": "직원 화면 오류 수정 후 업무 흐름을 재검증해야 합니다. 높은 API 통과율과 별도로 동시성·브라우저 검증이 필요합니다.",
          "order": 20
        }
      },
      "efficiencyComparable": false,
      "acceptanceResults": {
        "A01": "C/—",
        "A02": "C/PASS",
        "A03": "C/—",
        "A04": "C/—",
        "A05": "C/PASS",
        "A06": "C/—",
        "A07": "C/PASS",
        "A08": "C/—",
        "A09": "P/—",
        "A10": "C/—",
        "A11": "C/—",
        "A12": "C/—",
        "A13": "C/—",
        "A14": "P/—",
        "A15": "C/—",
        "A16": "C/—",
        "A17": "C/—",
        "A18": "C/—",
        "A19": "C/—",
        "A20": "C/—",
        "A21": "C/—",
        "A22": "C/—",
        "A23": "P/—",
        "A24": "C/—",
        "A25": "P/—",
        "A26": "C/—",
        "A27": "P/—",
        "A28": "C/—",
        "A29": "P/—",
        "A30": "C/—",
        "A31": "C/—",
        "A32": "C/—",
        "A33": "P/—",
        "A34": "C/—",
        "A35": "C/—",
        "A36": "C/—",
        "A37": "C/—",
        "A38": "C/—",
        "A39": "D/FAIL",
        "A40": "D/FAIL"
      },
      "tokenRows": [
        [
          "HY4 Preview",
          "W1 개발 소계",
          "30,564,010",
          "2,075,242",
          "28,488,768",
          "0",
          "380,885",
          "191,313",
          "30,944,895",
          "411건 관측; cancelled 2건 누락"
        ],
        [
          "HY4 Preview",
          "W3 검토·후속 재검증 소계",
          "44,309,143",
          "2,305,943",
          "42,003,200",
          "0",
          "427,930",
          "282,356",
          "44,737,073",
          "569건 관측; error/cancelled 5건 누락"
        ],
        [
          "HY4 Preview",
          "W2 단계 미분류",
          "6,340,893",
          "408,349",
          "5,932,544",
          "0",
          "84,470",
          "55,392",
          "6,425,363",
          "80건; 개발 종료~검토 시작 경계 창"
        ],
        [
          "HY4 Preview",
          "W1+W2+W3 관측 합",
          "81,214,046",
          "4,789,534",
          "76,424,512",
          "0",
          "893,285",
          "529,061",
          "82,107,331",
          "82,107,331; 누락 7건 때문에 전체 아님"
        ],
        [
          "HY4 Preview",
          "W4 문서 작업: 제외",
          "2,195,916",
          "185,868",
          "2,010,048",
          "0",
          "39,530",
          "23,888",
          "2,235,446",
          "원문 검토 합계에 혼입된 29건"
        ]
      ],
      "evidence": [],
      "provider": {
        "name": "Tencent",
        "icon": "assets/providers/tencent-mark.svg"
      },
      "rank": 4
    },
    {
      "id": "kimi",
      "name": "Kimi K3.1 Pro",
      "folder": "codebuddy_kimi-k3.1-pro",
      "group": "codebuddy",
      "raw": 85.0,
      "implementation": 91.25,
      "apiPass": 101,
      "coverage": 12.5,
      "bugs": 6,
      "docker": 12.5,
      "confidence": "중간",
      "scores": [
        29.0,
        16.5,
        12.5,
        12.5,
        9.0,
        3.0,
        2.5
      ],
      "acceptance": [
        3,
        2,
        35
      ],
      "static": [
        33,
        5,
        0,
        2,
        0
      ],
      "severity": [
        0,
        4,
        2
      ],
      "tokens": {
        "dev": {
          "input": 28316295,
          "regular": 634088,
          "read": 27682207,
          "write": 0,
          "output": 143890,
          "reason": 29430,
          "total": 28460185
        },
        "review": {
          "input": 23660342,
          "regular": 698422,
          "read": 22961920,
          "write": 0,
          "output": 64918,
          "reason": 16331,
          "total": 23725260
        },
        "total": {
          "input": 51976637,
          "regular": 1332510,
          "read": 50644127,
          "write": 0,
          "output": 208808,
          "reason": 45761,
          "total": 52185445
        }
      },
      "fullTokens": null,
      "tokenNote": "원본 UI 이미지와 대조한 개발·검토 소계. 보조 agent 포함·중복 관계와 프로젝트 전체 토큰은 미확인.",
      "time": {
        "dev": 5565000,
        "review": 3603000,
        "total": 9168000
      },
      "timeNote": "원본 이미지와 대조한 UI 대표값: 개발92분45초·검토60분3초, 합152분48초. UI 절대 시각·요청 사이 간격·전체 창·순수 AI·입력 대기는 null. 기존 Clock 코드 합142분47초와 전체 창163분은 별도 이력이며 UI에 합산하지 않음.",
      "position": "품질 기준 우선 파일럿 후보",
      "strength": "Codebuddy 중 최고 점수 85.0. 화면과 기능별 서비스가 대체로 완성됐다.",
      "weakness": "가드 뒤 재인가 위험과 쿼리 경계 보완이 필요하다. agent 사용량 중복 여부가 불명확하다.",
      "order": 60,
      "pinLast": false,
      "apiTotal": 112,
      "groupLabel": "Codebuddy",
      "presentation": {
        "tokens": {
          "label": "관측 소계",
          "sourceLabel": "UI 소계 · 전체 미확인",
          "partial": true,
          "phaseNotes": {
            "dev": "원본 이미지와 직접 대조한 개발 UI 소계. 보조 agent 포함·중복 관계와 프로젝트 전체는 미확인.",
            "review": "원본 이미지와 직접 대조한 검토 UI 소계. 별도 agent 표시값과 합산하지 않음."
          },
          "missingNote": "usage 미수집",
          "extras": []
        },
        "time": {
          "label": "UI 관측 구간",
          "partial": false
        }
      },
      "summary": {
        "shortName": "Kimi",
        "rosterNote": "품질 기준 우선 파일럿 후보",
        "apiNote": "공통 API 검사 결과이며 전체 업무 합격과 구분합니다.",
        "recommendation": {
          "label": "우선 검토",
          "tone": "blue",
          "action": "조회 경계·최신 권한 재검사 보완",
          "detail": "일반 CRUD·화면 중심의 내부 파일럿 후보입니다. 쿼리 경계와 재인가를 보완하고 agent 사용량을 분리 수집해야 합니다.",
          "order": 10
        }
      },
      "efficiencyComparable": false,
      "acceptanceResults": {
        "A01": "P/—",
        "A02": "C/PASS",
        "A03": "C/—",
        "A04": "C/—",
        "A05": "C/PASS",
        "A06": "C/—",
        "A07": "C/PASS",
        "A08": "C/—",
        "A09": "P/—",
        "A10": "C/—",
        "A11": "C/—",
        "A12": "C/—",
        "A13": "C/—",
        "A14": "P/—",
        "A15": "C/—",
        "A16": "C/—",
        "A17": "C/—",
        "A18": "C/—",
        "A19": "C/—",
        "A20": "C/—",
        "A21": "C/—",
        "A22": "C/—",
        "A23": "C/—",
        "A24": "C/—",
        "A25": "C/—",
        "A26": "C/—",
        "A27": "P/—",
        "A28": "C/—",
        "A29": "P/—",
        "A30": "C/—",
        "A31": "C/—",
        "A32": "C/—",
        "A33": "C/—",
        "A34": "C/—",
        "A35": "C/—",
        "A36": "C/—",
        "A37": "C/—",
        "A38": "C/—",
        "A39": "D/FAIL",
        "A40": "D/FAIL"
      },
      "tokenRows": [
        [
          "Kimi K3.1 Pro",
          "개발 UI",
          "28,316,295",
          "634,088",
          "27,682,207",
          "0",
          "143,890",
          "29,430",
          "28,460,185",
          "UI 전사본; agent 범위 미확인"
        ],
        [
          "Kimi K3.1 Pro",
          "검토 UI",
          "23,660,342",
          "698,422",
          "22,961,920",
          "0",
          "64,918",
          "16,331",
          "23,725,260",
          "UI 전사본; agent 범위 미확인"
        ],
        [
          "Kimi K3.1 Pro",
          "UI 합계",
          "51,976,637",
          "1,332,510",
          "50,644,127",
          "0",
          "208,808",
          "45,761",
          "52,185,445",
          "52,185,445; 프로젝트 전체와 구분"
        ]
      ],
      "evidence": [],
      "provider": {
        "name": "Moonshot AI",
        "icon": "assets/providers/moonshot-mark.svg"
      },
      "rank": 3
    }
  ],
  "areas": [
    [
      "요구사항 구현",
      30.0
    ],
    [
      "업무 정확성",
      20.0
    ],
    [
      "인증·권한·보안",
      15.0
    ],
    [
      "Docker·인프라",
      15.0
    ],
    [
      "UI·UX",
      10.0
    ],
    [
      "코드 유지보수성",
      5.0
    ],
    [
      "시험·문서·재현",
      5.0
    ]
  ],
  "sources": {
    "보고서_완성도.md": {
      "sha256": "a701116ec8dfc2c3469ad7473a62ceb43ed6d248dd1fdf6662de11f517679839",
      "bytes": 76826,
      "bundledSha256": "3e7be81075ae54bcc36717b6692a0826ffe0b507ba25d80c9edd56edaeebc653",
      "bundledBytes": 76663,
      "bundledScope": "100점 만점 평가·토큰·시간 웹 제공본"
    },
    "보고서_사용량.md": {
      "sha256": "e20cfba0a22bef15d4e1a19921659f02fcde9e848b9b6c26d026aeac1adc1c2e",
      "bytes": 55440,
      "bundledSha256": "6cb463d34757b6cc57e23136eca95c981a3a651b0771b9a646a2b779f28e351f",
      "bundledBytes": 38354,
      "bundledScope": "100점 만점 평가·토큰·시간 웹 제공본"
    },
    "보고서_요금제.md": {
      "sha256": "fd4a569c3cd5c6c65234e2fbd5fc8cd08ff0ddf2518c0e05c1d87cf8342ad9b8",
      "bytes": 21126,
      "bundledSha256": "fd4a569c3cd5c6c65234e2fbd5fc8cd08ff0ddf2518c0e05c1d87cf8342ad9b8",
      "bundledBytes": 21126,
      "bundledScope": "사용자 제공 요금제 이미지의 번역·비교 원문"
    },
    "보고서_토큰가격.md": {
      "sha256": "9fca294098c99f1dbe56bcbbd7035e2f7231a19b9b083399b00ebc6657b72814",
      "bytes": 12817,
      "bundledSha256": "6ae1f72119d7916cd44259782cde3a339943a240bedc4671da50d3f2c72fa418",
      "bundledBytes": 13909,
      "bundledScope": "제공 리뷰 시험 원문과 사용자 지정 구독 지급량·현재 적용 단가"
    },
    "보고서_크레딧.md": {
      "originalFile": "보고서_사용량.md",
      "sha256": "e20cfba0a22bef15d4e1a19921659f02fcde9e848b9b6c26d026aeac1adc1c2e",
      "bytes": 55440,
      "bundledSha256": "560167cc623e420e4bb7d40c45a40e586c638f98b8b49114960053abb7440135",
      "bundledBytes": 2248,
      "bundledScope": "HRMS 개발·검토 크레딧과 범위 발췌·정리"
    }
  },
  "pricing": {
    "currency": "USD",
    "sourceDate": "2026-11-25",
    "sourceUrl": "sources/보고서_요금제.html",
    "sourceNote": "사용자가 제공한 요금제 이미지 번역·비교 문서 기준. 실시간 결제 화면을 조회한 가격이 아닙니다.",
    "plans": [
      {
        "id": "pro",
        "name": "Personal Pro",
        "audience": "개인용 · 1명",
        "referenceMonthlyCents": 2000,
        "listedMonthlyCents": 1000,
        "yearlyCents": 9600,
        "referenceUnconfirmed": true,
        "baseCredits": 1000,
        "bonusCredits": 1000,
        "bonusNote": "문서에 기간 한정 표시 없음 · 지속 여부 미확인",
        "features": [
          "일일 활동 보상 50크레딧/일",
          "전체 모델 접근",
          "무제한 코드 자동 완성"
        ],
        "featureTitle": "개인 개발 기능",
        "dailyReward": 50,
        "featureHighlight": "일일 활동 보상 50크레딧/일"
      },
      {
        "id": "team",
        "name": "Business Team",
        "audience": "기업·팀용 · 1좌석",
        "referenceMonthlyCents": 4000,
        "listedMonthlyCents": 4000,
        "yearlyCents": 48000,
        "referenceUnconfirmed": false,
        "baseCredits": 1000,
        "bonusCredits": 1000,
        "bonusNote": "기간 한정 보너스 · 종료일 미표기",
        "features": [
          "구독·구성원별 사용량 관리",
          "SSO·조직 구조 관리",
          "기업용 모델 구성·보안·감사"
        ],
        "featureTitle": "조직 운영 기능",
        "dailyReward": null,
        "featureHighlight": "구독·구성원별 사용량 관리"
      }
    ]
  },
  "tokenPricing": {
    "currency": "USD",
    "sourceUrl": "sources/보고서_토큰가격.html",
    "basis": "mixed-credits-and-token-estimate",
    "denominator": "displayed-dev-review-total-including-cache",
    "trialDates": [
      "2026-11-20",
      "2026-11-25"
    ],
    "rates": {
      "gpt": {
        "alias": "gpt-6.1-sol",
        "usdPerMillion": 0.3145,
        "basis": "사용자 지정: 구독요금[$100] ÷ (주당 토큰지급량[74M] × 지급횟수[4.3주]) ≈ 1M당 약 $0.3145",
        "method": "tokens",
        "subscription": {
          "monthlyUsd": 100,
          "weeklyTokensMillion": 74,
          "weeks": 4.3
        },
        "compactFormula": "구독 $100 ÷ (주 74M × 4.3주)",
        "sourceFile": "사용자 제공 구독료·토큰 지급량 (2026-11-26)"
      },
      "opus": {
        "alias": "claude-opus-5-5",
        "usdPerMillion": 0.214,
        "basis": "사용자 지정: 구독요금[$100] ÷ (주당 토큰지급량[109M] × 지급횟수[4.3주]) ≈ 1M당 약 $0.214",
        "method": "tokens",
        "subscription": {
          "monthlyUsd": 100,
          "weeklyTokensMillion": 109,
          "weeks": 4.3
        },
        "compactFormula": "구독 $100 ÷ (주 109M × 4.3주)",
        "sourceFile": "사용자 제공 구독료·토큰 지급량 (2026-11-26)"
      },
      "deepseek": {
        "alias": "deepseek-v4.1-flash",
        "basis": "HRMS 개발·검토 기록 크레딧 × $0.04 (1,000크레딧 = $40)",
        "method": "credits",
        "usdPerCredit": 0.04,
        "devCredits": 76.74,
        "reviewCredits": 28.75,
        "scope": "개발·검토 프록시 두 창. 별도 UI 10.40크레딧은 합산하지 않음.",
        "sourceFile": "보고서_사용량.md"
      },
      "hy4": {
        "alias": "hy4-preview",
        "basis": "HRMS 개발·검토 기록 크레딧 × $0.04 (1,000크레딧 = $40)",
        "method": "credits",
        "usdPerCredit": 0.04,
        "devCredits": 324.69,
        "reviewCredits": 400.87,
        "scope": "W1 개발 + W3 검토. W2 미분류 66.52·W4 문서 28.62크레딧은 제외.",
        "sourceFile": "보고서_사용량.md"
      },
      "kimi": {
        "alias": "kimi-k3.1-pro",
        "basis": "HRMS 개발·검토 기록 크레딧 × $0.04 (1,000크레딧 = $40)",
        "method": "credits",
        "usdPerCredit": 0.04,
        "devCredits": 709.34,
        "reviewCredits": 569.08,
        "scope": "개발·검토 주 UI. 별도 agent 21,277크레딧은 포함·중복 관계 미확인으로 제외.",
        "sourceFile": "보고서_사용량.md"
      },
      "balanced": {
        "alias": "balanced-model",
        "basis": "HRMS 개발·검토 기록 크레딧 × $0.04 (1,000크레딧 = $40)",
        "method": "credits",
        "usdPerCredit": 0.04,
        "devCredits": 562.32,
        "reviewCredits": 255.91,
        "scope": "11월25일 새 실행 UI 전사 2건. 이전 실행·문서 응답 크레딧과 합산하지 않음.",
        "sourceFile": "보고서_사용량.md"
      }
    },
    "usdPerCredit": 0.04,
    "creditSourceUrl": "sources/보고서_크레딧.html",
    "creditComparison": {
      "subscriptionUsd": 40,
      "baseCredits": 1000,
      "bonusCredits": 1000,
      "activityCredits": 1500,
      "activityDays": 30
    }
  },
  "reviewBenchmark": {
    "title": "AI 코드 리뷰 모델 비교",
    "sourceDate": "2026-11-20",
    "sourceFilename": "2026-11-20-model-comparison-report (1).html",
    "sourceSha256": "7e0d7730e0d70e4b657df30688b96432e8ef77fed2a8686db6681576c41e308f",
    "reviewCases": 10,
    "rounds": 2,
    "confirmedFindings": 151,
    "highFindings": 6,
    "reconstructedCases": 5,
    "models": [
      {
        "id": "claude-opus-5-5",
        "name": "opus-5.5",
        "provider": {
          "name": "Anthropic",
          "icon": "assets/providers/anthropic-mark.svg"
        },
        "group": "핵심",
        "averageFindings": 76.0,
        "reportedFindingPercent": 50,
        "averageReviewSeconds": 158,
        "subscriptionCostCents": 19,
        "costBasisNote": "주간 한도 0.81%",
        "openRouterCostCents": 902,
        "inputTokens": 960000,
        "outputTokens": 160000,
        "precisionPercent": 78,
        "highFindings": [
          5,
          4
        ],
        "sourceOrder": 0
      },
      {
        "id": "claude-sonnet-5-5",
        "name": "sonnet-5.5",
        "provider": {
          "name": "Anthropic",
          "icon": "assets/providers/anthropic-mark.svg"
        },
        "group": "핵심",
        "averageFindings": 71.0,
        "reportedFindingPercent": 47,
        "averageReviewSeconds": 132,
        "subscriptionCostCents": 9,
        "costBasisNote": "주간 한도 0.41%",
        "openRouterCostCents": 456,
        "inputTokens": 960000,
        "outputTokens": 170000,
        "precisionPercent": 78,
        "highFindings": [
          5,
          5
        ],
        "sourceOrder": 1
      },
      {
        "id": "deepseek-v4.1-flash",
        "name": "deepseek-v4.1-flash",
        "provider": {
          "name": "DeepSeek",
          "icon": "assets/providers/deepseek.png"
        },
        "group": "중국 Flash",
        "averageFindings": 55.0,
        "reportedFindingPercent": 36,
        "averageReviewSeconds": 144,
        "subscriptionCostCents": 207,
        "costBasisNote": "52 credit",
        "openRouterCostCents": 50,
        "inputTokens": 680000,
        "outputTokens": 260000,
        "precisionPercent": 71,
        "highFindings": [
          2,
          3
        ],
        "sourceOrder": 2
      },
      {
        "id": "gpt-6.2-sol",
        "name": "6.2-sol",
        "provider": {
          "name": "OpenAI",
          "icon": "assets/providers/openai.svg"
        },
        "group": "핵심",
        "averageFindings": 45.5,
        "reportedFindingPercent": 30,
        "averageReviewSeconds": 76,
        "subscriptionCostCents": 24,
        "costBasisNote": "주간 한도 1.02%",
        "openRouterCostCents": 145,
        "inputTokens": 680000,
        "outputTokens": 30000,
        "precisionPercent": 85,
        "highFindings": [
          5,
          4
        ],
        "sourceOrder": 3
      },
      {
        "id": "glm-5.3",
        "name": "glm-5.3",
        "provider": {
          "name": "Zhipu",
          "icon": "assets/providers/zhipu-review.png"
        },
        "group": "중국 일반",
        "averageFindings": 37.0,
        "reportedFindingPercent": 25,
        "averageReviewSeconds": 454,
        "subscriptionCostCents": 673,
        "costBasisNote": "168 credit",
        "openRouterCostCents": 237,
        "inputTokens": 790000,
        "outputTokens": 300000,
        "precisionPercent": 74,
        "highFindings": [
          1,
          3
        ],
        "sourceOrder": 4
      },
      {
        "id": "hy4-preview",
        "name": "hy4-preview",
        "provider": {
          "name": "Tencent",
          "icon": "assets/providers/tencent-mark.svg"
        },
        "group": "중국 일반",
        "averageFindings": 30.5,
        "reportedFindingPercent": 20,
        "averageReviewSeconds": 622,
        "subscriptionCostCents": 537,
        "costBasisNote": "134 credit",
        "openRouterCostCents": 179,
        "inputTokens": 700000,
        "outputTokens": 480000,
        "precisionPercent": 74,
        "highFindings": [
          1,
          3
        ],
        "sourceOrder": 5
      },
      {
        "id": "kimi-k3.1-pro",
        "name": "kimi-k3.1-pro",
        "provider": {
          "name": "Moonshot",
          "icon": "assets/providers/moonshot-mark.svg"
        },
        "group": "중국 일반",
        "averageFindings": 25.0,
        "reportedFindingPercent": 17,
        "averageReviewSeconds": 375,
        "subscriptionCostCents": 819,
        "costBasisNote": "205 credit",
        "openRouterCostCents": 235,
        "inputTokens": 680000,
        "outputTokens": 100000,
        "precisionPercent": 88,
        "highFindings": [
          2,
          3
        ],
        "sourceOrder": 6
      },
      {
        "id": "gpt-6.1-terra",
        "name": "6.1-terra",
        "provider": {
          "name": "OpenAI",
          "icon": "assets/providers/openai.svg"
        },
        "group": "핵심",
        "averageFindings": 22.5,
        "reportedFindingPercent": 15,
        "averageReviewSeconds": 19,
        "subscriptionCostCents": 9,
        "costBasisNote": "주간 한도 0.41%",
        "openRouterCostCents": 52,
        "inputTokens": 630000,
        "outputTokens": 7000,
        "precisionPercent": 92,
        "highFindings": [
          5,
          3
        ],
        "sourceOrder": 7
      },
      {
        "id": "minimax-m3.1-flash",
        "name": "minimax-m3.1-flash",
        "provider": {
          "name": "MiniMax",
          "icon": "assets/providers/minimax-review.png"
        },
        "group": "중국 Flash",
        "averageFindings": 20.5,
        "reportedFindingPercent": 14,
        "averageReviewSeconds": 114,
        "subscriptionCostCents": 64,
        "costBasisNote": "16 credit",
        "openRouterCostCents": 15,
        "inputTokens": 630000,
        "outputTokens": 100000,
        "precisionPercent": 79,
        "highFindings": [
          2,
          1
        ],
        "sourceOrder": 8
      },
      {
        "id": "hy4flash-free",
        "name": "hy4flash-free",
        "provider": {
          "name": "Tencent",
          "icon": "assets/providers/tencent-mark.svg"
        },
        "group": "중국 Flash",
        "averageFindings": 18.5,
        "reportedFindingPercent": 12,
        "averageReviewSeconds": 109,
        "subscriptionCostCents": 0,
        "costBasisNote": "무료",
        "openRouterCostCents": 10,
        "inputTokens": 670000,
        "outputTokens": 200000,
        "precisionPercent": 74,
        "highFindings": [
          0,
          1
        ],
        "sourceOrder": 9
      }
    ]
  },
  "tokenTable": {
    "headers": [
      "프로젝트",
      "구간",
      "전체 입력 IT",
      "일반 입력 I",
      "캐시 읽기 R",
      "캐시 쓰기 W",
      "출력 O",
      "출력 안 추론",
      "IT+O",
      "범위"
    ],
    "rows": [
      [
        "GPT-6.1-sol",
        "개발",
        "30,644,931",
        "214,083",
        "30,430,848",
        "0",
        "142,948",
        "48,712",
        "30,787,879",
        "133개 응답"
      ],
      [
        "GPT-6.1-sol",
        "검토",
        "13,287,666",
        "616,818",
        "12,670,848",
        "0",
        "46,721",
        "15,448",
        "13,334,387",
        "62개 응답"
      ],
      [
        "GPT-6.1-sol",
        "합계",
        "43,932,597",
        "830,901",
        "43,101,696",
        "0",
        "189,669",
        "64,160",
        "44,122,266",
        "동일 소비 1회 합계"
      ],
      [
        "Opus 5.5",
        "개발",
        "58,525,678",
        "280",
        "57,954,474",
        "570,924",
        "347,611",
        "54,155",
        "58,873,289",
        "136개 호출; 쓰기 1h TTL"
      ],
      [
        "Opus 5.5",
        "검토",
        "19,135,796",
        "58",
        "19,072,731",
        "63,007",
        "52,646",
        "13,095",
        "19,188,442",
        "28개 호출; 쓰기 1h TTL"
      ],
      [
        "Opus 5.5",
        "합계",
        "77,661,474",
        "338",
        "77,027,205",
        "633,931",
        "400,257",
        "67,250",
        "78,061,731",
        "5분 쓰기는 기록상 0"
      ],
      [
        "DeepSeek V4.1 Flash",
        "개발",
        "37,206,731",
        "659,659",
        "36,547,072",
        "0",
        "258,733",
        "0",
        "37,465,464",
        "upstream_hook 565건"
      ],
      [
        "DeepSeek V4.1 Flash",
        "검토",
        "38,860,610",
        "610,242",
        "38,250,368",
        "0",
        "100,518",
        "0",
        "38,961,128",
        "upstream_hook 514건"
      ],
      [
        "DeepSeek V4.1 Flash",
        "귀속창 합계",
        "76,067,341",
        "1,269,901",
        "74,797,440",
        "0",
        "359,251",
        "0",
        "76,426,592",
        "1,079건. 추론 0은 로그 필드값"
      ],
      [
        "HY4 Preview",
        "W1 개발 소계",
        "30,564,010",
        "2,075,242",
        "28,488,768",
        "0",
        "380,885",
        "191,313",
        "30,944,895",
        "411건 관측; cancelled 2건 누락"
      ],
      [
        "HY4 Preview",
        "W3 검토·후속 재검증 소계",
        "44,309,143",
        "2,305,943",
        "42,003,200",
        "0",
        "427,930",
        "282,356",
        "44,737,073",
        "569건 관측; error/cancelled 5건 누락"
      ],
      [
        "HY4 Preview",
        "W2 단계 미분류",
        "6,340,893",
        "408,349",
        "5,932,544",
        "0",
        "84,470",
        "55,392",
        "6,425,363",
        "80건; 개발 종료~검토 시작 경계 창"
      ],
      [
        "HY4 Preview",
        "W1+W2+W3 관측 합",
        "81,214,046",
        "4,789,534",
        "76,424,512",
        "0",
        "893,285",
        "529,061",
        "82,107,331",
        "82,107,331; 누락 7건 때문에 전체 아님"
      ],
      [
        "HY4 Preview",
        "W4 문서 작업: 제외",
        "2,195,916",
        "185,868",
        "2,010,048",
        "0",
        "39,530",
        "23,888",
        "2,235,446",
        "원문 검토 합계에 혼입된 29건"
      ],
      [
        "Kimi K3.1 Pro",
        "개발 UI",
        "28,316,295",
        "634,088",
        "27,682,207",
        "0",
        "143,890",
        "29,430",
        "28,460,185",
        "UI 전사본; agent 범위 미확인"
      ],
      [
        "Kimi K3.1 Pro",
        "검토 UI",
        "23,660,342",
        "698,422",
        "22,961,920",
        "0",
        "64,918",
        "16,331",
        "23,725,260",
        "UI 전사본; agent 범위 미확인"
      ],
      [
        "Kimi K3.1 Pro",
        "UI 합계",
        "51,976,637",
        "1,332,510",
        "50,644,127",
        "0",
        "208,808",
        "45,761",
        "52,185,445",
        "52,185,445; 프로젝트 전체와 구분"
      ],
      [
        "Balanced",
        "개발",
        "32,245,773",
        "286,221",
        "31,959,552",
        "0",
        "80,576",
        "0",
        "32,326,349",
        "새 실행의 개발·검토 UI 전사 소계 47,110,323토큰. 산술은 일치하지만 원본 화면·전체 호출 포괄은 미대조이며 프로젝트 전체는 null. 이전 실행과 합산하지 않음."
      ],
      [
        "Balanced",
        "검토",
        "14,744,219",
        "95,643",
        "14,648,576",
        "0",
        "39,755",
        "0",
        "14,783,974",
        "새 실행의 개발·검토 UI 전사 소계 47,110,323토큰. 산술은 일치하지만 원본 화면·전체 호출 포괄은 미대조이며 프로젝트 전체는 null. 이전 실행과 합산하지 않음."
      ],
      [
        "Balanced",
        "합계",
        "46,989,992",
        "381,864",
        "46,608,128",
        "0",
        "120,331",
        "0",
        "47,110,323",
        "새 실행의 개발·검토 UI 전사 소계 47,110,323토큰. 산술은 일치하지만 원본 화면·전체 호출 포괄은 미대조이며 프로젝트 전체는 null. 이전 실행과 합산하지 않음."
      ]
    ]
  },
  "acceptanceTable": {
    "headers": [
      "ID",
      "명세 시나리오",
      "GPT-6.1-sol",
      "Opus 5.5",
      "Balanced",
      "DeepSeek V4.1 Flash",
      "HY4 Preview",
      "Kimi K3.1 Pro",
      "근거 그룹"
    ],
    "rows": [
      [
        "A01",
        "새 볼륨에서 Compose 빌드·기동",
        "C/—",
        "C/—",
        "P/—",
        "C/—",
        "C/—",
        "P/—",
        "인프라"
      ],
      [
        "A02",
        "app·mysql 호스트 포트 확인",
        "C/PASS",
        "C/PASS",
        "C/PASS",
        "C/PASS",
        "C/PASS",
        "C/PASS",
        "인프라"
      ],
      [
        "A03",
        "중지·재기동 및 app 단독 재시작",
        "C/—",
        "C/—",
        "P/—",
        "C/—",
        "C/—",
        "C/—",
        "인프라"
      ],
      [
        "A04",
        "유효한 형식의 정상·잘못된 비밀번호·비활성 계정 로그인과 형식 오류",
        "C/—",
        "C/—",
        "D/FAIL",
        "D/FAIL",
        "C/—",
        "C/—",
        "인증·권한"
      ],
      [
        "A05",
        "미로그인 GET·로그인 상태의 CSRF 없는 POST·로그아웃 후 GET",
        "C/PASS",
        "C/PASS",
        "C/PASS",
        "D/FAIL",
        "C/PASS",
        "C/PASS",
        "인증·권한"
      ],
      [
        "A06",
        "직원이 계정/역할 변경 API 직접 호출",
        "C/—",
        "C/—",
        "C/—",
        "C/—",
        "C/—",
        "C/—",
        "인증·권한"
      ],
      [
        "A07",
        "직원이 다른 직원 ID·근태·휴가 조회",
        "C/PASS",
        "C/PASS",
        "D/FAIL",
        "D/FAIL",
        "C/PASS",
        "C/PASS",
        "인증·권한"
      ],
      [
        "A08",
        "직원 신규·동일 사번·동일 이메일·잘못된 이메일",
        "C/—",
        "C/—",
        "P/—",
        "P/—",
        "C/—",
        "C/—",
        "조직·조회"
      ],
      [
        "A09",
        "직원 검색·복합 필터·페이지·빈 결과",
        "C/—",
        "C/—",
        "D/FAIL",
        "D/FAIL",
        "P/—",
        "P/—",
        "조직·조회"
      ],
      [
        "A10",
        "관리자 지정 직원 이동·재직 직원 참조 조직 비활성",
        "C/—",
        "C/—",
        "M/—",
        "P/—",
        "C/—",
        "C/—",
        "조직·조회"
      ],
      [
        "A11",
        "본인 프로필에 role·departmentId 주입",
        "C/—",
        "C/—",
        "M/—",
        "P/—",
        "C/—",
        "C/—",
        "인증·권한"
      ],
      [
        "A12",
        "출근→재출근→퇴근→재퇴근, 출근 전 퇴근",
        "C/—",
        "C/—",
        "P/—",
        "P/—",
        "C/—",
        "C/—",
        "근태"
      ],
      [
        "A13",
        "동시에 같은 직원 출근 두 번",
        "C/—",
        "C/—",
        "P/—",
        "C/—",
        "C/—",
        "C/—",
        "근태"
      ],
      [
        "A14",
        "테스트 고정 시각으로 근무 분·업무 날짜 확인",
        "C/—",
        "C/—",
        "P/—",
        "P/—",
        "P/—",
        "P/—",
        "근태"
      ],
      [
        "A15",
        "목~다음 월 휴가 신청",
        "C/—",
        "C/—",
        "P/—",
        "P/—",
        "C/—",
        "C/—",
        "연차"
      ],
      [
        "A16",
        "연도 넘김·역전·주말만·과거 시작·잔액 행 없음",
        "C/—",
        "C/—",
        "P/—",
        "P/—",
        "C/—",
        "C/—",
        "연차"
      ],
      [
        "A17",
        "잔액 부족·기존 대기/승인 구간 겹침",
        "C/—",
        "C/—",
        "P/—",
        "P/—",
        "C/—",
        "C/—",
        "연차"
      ],
      [
        "A18",
        "잔여 2일에서 겹치지 않는 2일 신청 두 개 동시 실행",
        "C/—",
        "C/—",
        "M/—",
        "M/—",
        "C/—",
        "C/—",
        "연차"
      ],
      [
        "A19",
        "정상 승인·반려·신청자 대기 취소",
        "C/—",
        "C/—",
        "P/—",
        "P/—",
        "C/—",
        "C/—",
        "연차"
      ],
      [
        "A20",
        "본인 승인·타 부서 관리자 승인",
        "C/—",
        "C/—",
        "M/—",
        "P/—",
        "C/—",
        "C/—",
        "인증·권한"
      ],
      [
        "A21",
        "동일 신청 동시 승인·승인 후 재처리",
        "C/—",
        "C/—",
        "P/—",
        "P/—",
        "C/—",
        "C/—",
        "연차"
      ],
      [
        "A22",
        "사용+예약보다 작은 부여량으로 변경",
        "C/—",
        "C/—",
        "M/—",
        "C/—",
        "C/—",
        "C/—",
        "연차"
      ],
      [
        "A23",
        "업무 변경 강제 실패·롤백 후 감사 확인",
        "C/—",
        "C/—",
        "P/—",
        "P/—",
        "P/—",
        "C/—",
        "감사"
      ],
      [
        "A24",
        "두 사용자가 같은 직원 version으로 수정",
        "C/—",
        "C/—",
        "C/—",
        "P/—",
        "C/—",
        "C/—",
        "조직·조회"
      ],
      [
        "A25",
        "API 호출 후 화면·대시보드 재조회",
        "C/—",
        "C/—",
        "D/FAIL",
        "D/FAIL",
        "P/—",
        "C/—",
        "화면"
      ],
      [
        "A26",
        "다른 MODEL_KEY의 Compose 두 개를 동시 기동·같은 브라우저에서 각각 로그인",
        "C/—",
        "C/—",
        "P/—",
        "C/—",
        "C/—",
        "C/—",
        "인프라"
      ],
      [
        "A27",
        "로그인 중 역할 변경·계정 비활성·직원 퇴사",
        "C/—",
        "C/—",
        "M/—",
        "P/—",
        "P/—",
        "P/—",
        "인증·권한"
      ],
      [
        "A28",
        "활성 ADMIN 2명 동시 비활성·역할 변경",
        "C/—",
        "C/—",
        "M/—",
        "P/—",
        "C/—",
        "C/—",
        "인증·권한"
      ],
      [
        "A29",
        "직원 부서 이동과 기존 부서장 승인 동시 실행",
        "C/—",
        "C/—",
        "M/—",
        "M/—",
        "P/—",
        "P/—",
        "연차"
      ],
      [
        "A30",
        "대기 휴가가 있는 직원 퇴사 시도",
        "C/—",
        "C/—",
        "M/—",
        "P/—",
        "C/—",
        "C/—",
        "조직·조회"
      ],
      [
        "A31",
        "시작일이 지난 대기 건 승인·반려·취소",
        "C/—",
        "C/—",
        "M/—",
        "D/—",
        "C/—",
        "C/—",
        "연차"
      ],
      [
        "A32",
        "같은 새 연도 잔액의 동일 일수 동시 PUT→재PUT→부여 변경",
        "C/—",
        "C/—",
        "M/—",
        "M/—",
        "C/—",
        "C/—",
        "연차"
      ],
      [
        "A33",
        "HR·관리자·직원의 감사·휴가 사유 접근",
        "C/—",
        "C/—",
        "P/—",
        "D/—",
        "P/—",
        "C/—",
        "인증·권한"
      ],
      [
        "A34",
        "같은 version으로 조직·계정·본인 연락처 수정",
        "C/—",
        "C/—",
        "P/—",
        "P/—",
        "C/—",
        "C/—",
        "조직·조회"
      ],
      [
        "A35",
        "로그인·로그아웃 뒤 CSRF 갱신과 토큰 미갱신",
        "C/—",
        "C/—",
        "P/—",
        "C/—",
        "C/—",
        "C/—",
        "인증·권한"
      ],
      [
        "A36",
        "서울 자정 전후의 오늘 근태·이전 날짜 미퇴근",
        "C/—",
        "C/—",
        "P/—",
        "C/—",
        "C/—",
        "C/—",
        "근태"
      ],
      [
        "A37",
        "DB 중단·복구 및 app 컨테이너 재생성",
        "C/—",
        "C/—",
        "M/—",
        "C/—",
        "C/—",
        "C/—",
        "인프라"
      ],
      [
        "A38",
        "seed 중간 실패·재기동·초기화 완료 후 수정",
        "C/—",
        "C/—",
        "P/—",
        "C/—",
        "C/—",
        "C/—",
        "인프라"
      ],
      [
        "A39",
        "필터 경계·미지원 정렬·잘못된 version·범위 밖 ID",
        "C/—",
        "D/FAIL",
        "D/FAIL",
        "D/FAIL",
        "D/FAIL",
        "D/FAIL",
        "조직·조회"
      ],
      [
        "A40",
        "S01~S10의 권한별 주요 흐름·직접 URL·1440×900/768px 화면·D01~D12",
        "C/—",
        "C/—",
        "D/FAIL",
        "D/FAIL",
        "D/FAIL",
        "D/FAIL",
        "화면"
      ]
    ]
  },
  "limitsTable": {
    "headers": [
      "항목",
      "문제",
      "보고서 처리"
    ],
    "rows": [
      [
        "집계 단계 중복",
        "호출·세션·누적값과 캐시·추론 부분집합",
        "한 계층만 합산. 추론은 출력에 포함하며 다시 더하지 않음."
      ],
      [
        "요청 귀속",
        "DeepSeek·HY4의 프록시는 모델·시간창 기준",
        "수치 재현과 과제 전용 귀속을 구분. UI·프록시 관측을 합치지 않음."
      ],
      [
        "실패 호출 누락",
        "HY4 실패·취소7건 usage 미수집",
        "관측 소계만 제시. 전체 토큰은 null이며 미수집을0으로 처리하지 않음."
      ],
      [
        "후속 문서 제외",
        "HY4 W4문서2,235,446토큰 및 이전 Balanced 문서 응답",
        "개발·코드 검토와 분리. HY4 W2단계 미분류는 별도 보존."
      ],
      [
        "Kimi 시간 기준",
        "UI152분48초와 기존 Clock142분47초의 차이10분1초",
        "원본 이미지와 대조한 UI를 대표값으로 채택. 서로 더하거나 차이를 입력 대기로 추정하지 않음."
      ],
      [
        "Kimi 보조 agent",
        "agent3건의 모델·토큰·UI 포함 관계 미확인",
        "52,185,445토큰은 UI 소계이며 전체 토큰은 null."
      ],
      [
        "UI·프록시 범위 차이",
        "DeepSeek UI10,062,873토큰과 프록시76,426,592토큰",
        "두 관측을 별도로 보존. 그래프는 기존 개발·검토 프록시 창이며 전체는 미확인."
      ],
      [
        "대기 오분류",
        "도구 없는 구간이나 Elapsed 차감 잔여",
        "사용자 대기 이벤트가 없으면 null. 전체 경과를 순수 AI 작업으로 바꾸지 않음."
      ],
      [
        "평가 시점",
        "기존5개는11월24일, Balanced는11월25일 평가",
        "이전5개를 이번에 모두 재시험한 것으로 표시하지 않음."
      ],
      [
        "서로 다른 실행 조건",
        "모델별 캐시·도구·수정 이력 차이",
        "관측량 순위와 모델 자체 효율 순위를 구분. 전체 효율 순위는 만들지 않음."
      ],
      [
        "Balanced 새 실행",
        "UI 전사 두 구간 47,110,323토큰·78분15초",
        "산술 확인. 원본 화면·실제 모델·전체 호출 포괄은 미확인. 이전 실행과 합산하지 않음."
      ]
    ]
  }
};
