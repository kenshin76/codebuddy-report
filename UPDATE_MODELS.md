# 모델 추가·갱신 안내

현재 보고서의 메뉴와 디자인은 양식 버전 **1.19.0**으로 고정합니다. 모델 데이터와 표시 코드를 분리했으므로 새 모델을 넣기 위해 HTML·CSS·JavaScript를 편집할 필요가 없습니다.

## 파일별 역할

| 위치 | 역할 |
| --- | --- |
| `models/<id>.json` | 모델 1개의 평가·사용량·관측 범위·권고·근거. 새 모델은 여기에 파일 1개 추가 |
| `templates/model.example.json` | 모든 미수집 값을 null로 둔 입력 예제. 실제 모델 목록에는 포함되지 않음 |
| `report-config.json` | 보고서 날짜·공통 배점·A01~A40 기준·대표 기준 모델. 공통 기준 변경 시에만 수정 |
| `scripts/build_report.py` | 데이터 검증, 순위·상세 표 생성, `data.js` 갱신. Python 표준 라이브러리만 사용 |
| `data.js` | 자동 생성한 브라우저용 데이터. 직접 편집하지 않음 |
| `template-contract.json` | 확정된 템플릿 파일의 해시. 모델 추가 중 디자인 변경을 감지 |

## 추가 순서

보고서 폴더에서 실행합니다.

```sh
cp templates/model.example.json models/my-model.json
```

복사한 파일에서 `id`, `name`, `folder`를 실제 모델 정보로 바꾸고 아래 필드를 채웁니다. 예제의 이름과 ID를 그대로 둔 파일은 빌드할 수 없습니다.

```sh
python3 scripts/build_report.py
python3 scripts/build_report.py --check
```

모델이 추가되면 모델 수, 선택 목록, 세 비교 그래프, 성능 비교 요약, 점수·API 표, 영역별 점수표, A01~A40 열, 토큰 상세 표가 함께 늘어납니다. Codebuddy 모델 목록과 권고 카드도 데이터에 따라 추가됩니다.

## 핵심 필드

| 필드 | 입력 기준 |
| --- | --- |
| `id` | 변경하지 않을 고유 ID. 영문 소문자·숫자·`_`·`-` |
| `name`, `folder` | 화면 표시명, 실제 프로젝트 폴더. 코드의 모델 ID와 선택 모드명은 혼동하지 않음 |
| `group`, `groupLabel` | `codebuddy`, `baseline`, `other` 중 제품 구분과 화면 설명 |
| `order`, `pinLast` | 프로젝트 배치 순서. `pinLast: true`는 항상 마지막. 순위는 이 순서를 바꾸지 않음 |
| `raw`, `scores` | 100점 만점 점수와 공통 7개 영역 점수. 모두 관측됐다면 합계가 일치해야 함 |
| `apiPass`, `apiTotal` | 통과 수와 공통 검사 수(현재112). 미수집 통과 수는 null |
| `apiExecuted`, `apiNotRun` | 일부 검사를 실행하지 못했을 때 실제 실행 수·미실행 수. 합은 apiTotal이어야 하며 통과율 분모는 apiExecuted. 생략하면 전부 실행한 기존 형식으로 처리 |
| `acceptance` | `[PASS, FAIL, NOT_RUN]`. 관측된 집계만 입력, 미수집은 null |
| `static`, `severity` | 구현 상태 5종 집계, `[높음, 중간, 낮음]` 결함 집계. 미수집은 null |
| `implementation`, `coverage`, `bugs`, `docker` | 기존 정의에 따른 구현 추정율·A 커버리지·결함군·Docker 점수. 미수집은 null |
| `acceptanceResults` | A01~A40 각각 `C/PASS`, `D/FAIL`, `P/—` 등. 자료가 없으면 null |
| `position`, `strength`, `weakness`, `confidence` | 짧은 판단·장점·한계·신뢰도. 긴 해설은 펼쳐보기에 표시 |
| `evidence` | 선택 항목. `{"title":"측정 근거","url":"sources/my-model.html"}` 형태의 근거 목록 |

### 토큰

`tokens.dev`, `tokens.review`, `tokens.total`을 각각 작성합니다. 단계 자료 전체가 없으면 null입니다. 있는 객체의 필드는 다음과 같습니다.

```json
{
  "input": null,
  "regular": null,
  "read": null,
  "write": null,
  "output": null,
  "reason": null,
  "total": null
}
```

- 캐시 포함 입력은 중복 없이 분해합니다. `input = regular + read + write`, `total = input + output`입니다.
- `reason`은 출력의 부분집합입니다. 합계에 다시 더하지 않습니다.
- `tokens.total`은 채택한 관측 합입니다. 별도 시간창 때문에 개발+검토 막대 합과 다를 수 있습니다. 그 차이는 `tokenNote`와 `presentation.tokens.extras`에 명시합니다.
- `presentation.tokens.partial`은 점선 여부, `label`은 관측값/관측 소계 등 짧은 상태, `sourceLabel`은 상세 범위입니다.
- `phaseNotes.dev/review`에는 단계별 출처·한계를, `missingNote`에는 미수집 이유를 작성합니다.
- `tokenRows: null`이면 개발·검토·합계 상세 행을 자동 생성합니다. 별도 관측창 행이 필요할 때만 현재 모델처럼 `tokenRows`에 표의 10개 열을 명시합니다.

### 시간

`time.dev/review/total`은 밀리초입니다. 전체 요청 경과를 확보하지 못했다면 null로 두고 `timeNote`에 이유를 적습니다. 두 단계가 관측됐다면 `total`은 두 구간 합입니다. 공백 포함 관측창은 설명으로 구분합니다.

`presentation.time.label`에 요청 경과/관측창/자체 보고 등 상태, `partial`에 점선 여부를 입력합니다. 도구 없는 시간을 사람 대기로 추정하지 않습니다.

### 핵심요약과 권고

- `summary.shortName`: 짧은 모델명.
- `summary.rosterNote`: Codebuddy 모델 목록에 표시할 한 줄 설명.
- `summary.apiNote`: 해당 모델이 최고 API 카드에 표시됐을 때의 설명.
- `summary.recommendation`: 권고가 있으면 `label`, `tone`(blue/amber/neutral), `action`, `detail`, `order`를 입력합니다. 근거가 없으면 null입니다.
- 최고 완성도와 최고 API 카드는 수집된 Codebuddy 값에서 자동 선택합니다. 기준 토큰 카드는 `report.primaryReferenceId` 모델을 사용합니다.
- `efficiencyComparable`은 기본 false입니다. 같은 요청 범위와 관측 토큰·시간이 확보된 경우에만 true로 두고 `efficiencyNote`에 비교 범위를 명시합니다. 단순히 숫자가 있다는 이유로 비교 가능으로 바꾸지 않습니다.

## 확인할 내용

1. 기존 모델의 값과 디자인이 바뀌지 않았는지 확인합니다.
2. 추가 모델이 세 그래프·요약 표·선택 목록·A01~A40 열에 나타나는지 확인합니다.
3. 점수는 높은 순, 토큰·시간은 표시한 단계 합이 적은 순입니다. 동점은 같은 순위이며 null은 순위에서 제외됩니다.
4. null이 0 또는 `NaN`으로 표시되지 않는지 확인합니다. 실제 0은 그대로 표시해야 합니다.
5. 좁은 화면에서 표 내부 가로 스크롤과 모델명 열 고정이 유지되는지 확인합니다.

기존 두 웹 근거 문서는 당시 기록의 보존본입니다. 새 모델 추가만으로 그 문서를 재검증한 기록으로 바꾸지 않습니다. 새 모델의 근거는 `evidence`로 연결합니다. 근거 문서 자체를 수정한 경우에만 `scripts/render_sources.py`로 해당 웹 문서를 다시 만듭니다.

루트 두 보고서의 변경도 웹 자료에 반영하는 요청이면 `python3 scripts/sync_sources.py` → `python3 scripts/build_report.py` → `python3 scripts/render_sources.py` 순서로 제공본과 출처 정보를 갱신합니다. 원문은 보존하며 웹 제공본의 기존 제외 범위도 유지합니다.

비용 비교의 구독 요금 데이터는 `report-config.json`의 `pricing`으로 분리되어 있습니다. 새 모델을 추가할 때 요금제나 프로젝트 소요 비용을 자동으로 생성하지 않습니다.

### 모델별 비용

`report-config.json.tokenPricing.rates[모델 id]`에서 `method: "credits"`는 HRMS `devCredits`+`reviewCredits`에 `usdPerCredit`을 곱합니다. `method: "tokens"`는 토큰 그래프의 개발+검토 합계에 `usdPerMillion`을 적용합니다. 두 방식을 혼합하지 않습니다. `alias`·`basis`·관측 범위를 함께 기록합니다. 출처에 대응 값이 없으면 null·미확인으로 두며 단가나 크레딧을 토큰에서 역산하지 않습니다. 개발·검토 미분류와 별도 agent 소비는 자동 합산하지 않습니다. 크레딧 근거 사본·HTML도 함께 갱신합니다.

## 모델명 앞 회사 아이콘

모델 JSON에 선택 항목 `provider: {"name": "제작사", "icon": "assets/providers/회사.svg"}`를 추가하면 차트·표·모델 카드에 함께 반영됩니다. 아이콘은 해당 로컬 경로에 저장하고 출처를 `assets/providers/README.md`에 남깁니다. 제작사를 모르면 추정하지 않으며 `provider`를 생략하면 텍스트만 표시합니다. 자동 모드는 실제 모델 제작사와 구분합니다.

## 부록 갱신

별도 코드 리뷰 시험은 `appendix/code-review.json`만 갱신합니다. `report-config.json.appendixFile`이 이 자료를 지정하며 빌드 시 데이터에 포함됩니다. HRMS 모델 수·순위·사용량·요금제 옵션에 섞지 않습니다. 원문에서 반올림된 표시 비율과 구독 환산액은 재계산하지 않고 보존합니다.
