"""Sync current root reports into web excerpts (100-point scores, tokens and time only).

Root reports stay unchanged. Financial content and relative-score columns are
intentionally excluded by the established web report's presentation contract.
"""

import hashlib
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
FINANCIAL = re.compile(r'USD|credit|크레딧|크래딧|비용|가격|금액|단가|청구|참고액|참고\s*\d+\.\d+|\$|회귀 계수|회귀\s*R[²2]', re.I)


def cells(line):
    return [part.strip() for part in line.strip().strip('|').split('|')]


def excerpt(source, quality):
    if not quality:
        source = re.sub(r'^## 4\. 비용.*?(?=^## 5\.)', '', source, flags=re.S | re.M)
    source = re.sub(r' GPT-6\.1-sol=80 상대 환산은[^\n]*', '', source)
    source = re.sub(r'세부 배점 안에서.*?점수는 통과율의 단순 복사나 결함 개수에 일정 숫자를 곱한 값이 아니다\.',
                    '세부 배점 안에서 0.25점 단위로 정성 부분 점수를 부여했다. 점수는 7개 영역 합계이며, 순위는 반올림 전 점수 기준이다. 점수는 통과율이나 결함 건수의 단순 환산값이 아니다.', source, flags=re.S)
    blocks = []
    for block in re.split(r'\n\s*\n', source):
        lines = block.splitlines()
        if lines and all(line.startswith('|') for line in lines):
            table = [cells(line) for line in lines]
            excluded = {index for index, value in enumerate(table[0]) if FINANCIAL.search(value) or '환산' in value}
            kept = [index for index in range(len(table[0])) if index not in excluded]
            if len(kept) < 2:
                continue
            output = []
            for index, row in enumerate(table):
                # Some evidence tables store a metric as a row rather than a column.
                if index > 1 and (FINANCIAL.search(row[0]) or all(FINANCIAL.search(row[col]) for col in kept[1:])):
                    continue
                values = []
                for col in kept:
                    value = row[col]
                    if FINANCIAL.search(value):
                        value = '토큰·시간 범위는 해당 모델의 수집 근거 참조'
                    values.append(value)
                output.append('| ' + ' | '.join(values) + ' |')
            blocks.append('\n'.join(output))
        elif not FINANCIAL.search(block):
            blocks.append(block)
    text = '\n\n'.join(blocks).replace('원점수 /100', '점수').replace('원점수', '점수')
    text = text.replace('상대 환산점수가 아니라 100점 만점 점수를 사용했다.', '100점 만점 점수를 사용했다.')
    text = text.replace('금전 효율이나 모델 추론 효율', '모델 추론 효율')
    title, _, body = text.partition('\n')
    note = ('> 최신 루트 보고서의 웹 제공본입니다. 점수는 100점 만점이며, '
            '개발·검토의 토큰과 시간 및 관측 범위를 중심으로 발췌했습니다. '
            '원문 파일은 변경하지 않았습니다.')
    return title + '\n\n' + note + '\n' + body.rstrip() + '\n'


def main():
    config_path = ROOT / 'report-config.json'
    config = json.loads(config_path.read_text())
    for name in ('보고서_완성도.md', '보고서_사용량.md'):
        original = (ROOT.parent / name).read_bytes()
        content = excerpt(original.decode(), name == '보고서_완성도.md').encode()
        (ROOT / 'sources' / name).write_bytes(content)
        config['sources'][name] = {
            'sha256': hashlib.sha256(original).hexdigest(), 'bytes': len(original),
            'bundledSha256': hashlib.sha256(content).hexdigest(), 'bundledBytes': len(content),
            'bundledScope': '100점 만점 평가·토큰·시간 웹 제공본',
        }
        print('Synced', name)
    config_path.write_text(json.dumps(config, ensure_ascii=False, indent=2) + '\n')


if __name__ == '__main__':
    main()
