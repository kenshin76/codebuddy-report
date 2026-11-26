"""Render the bundled Markdown evidence as offline HTML pages.

Build dependency: Markdown==3.7. The generated pages need no JavaScript or CDN.
"""

from html import escape
from html.parser import HTMLParser
import json
from pathlib import Path
from urllib.parse import urlsplit

import markdown


ROOT = Path(__file__).resolve().parents[1]
DOCUMENTS = {
    "보고서_완성도": "완성도 자료",
    "보고서_사용량": "토큰·시간 자료",
    "보고서_요금제": "Codebuddy 요금제 자료",
    "보고서_토큰가격": "토큰 가격 자료",
    "보고서_크레딧": "HRMS 크레딧 자료",
}
ALLOWED = set("p h2 h3 h4 h5 h6 ul ol li strong em code pre blockquote hr br table thead tbody tr th td a span div dl dt dd sup sub del abbr".split())


class DocumentHTML(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.output = []
        self.links = []

    def handle_starttag(self, tag, attrs):
        if tag not in ALLOWED:
            return
        attrs = dict(attrs)
        if tag == "table":
            self.output.append('<div class="document-table" tabindex="0" role="region" aria-label="자료 표, 가로 스크롤">')
        if tag == "a":
            href = attrs.get("href", "")
            report = next((name for name in DOCUMENTS if urlsplit(href).path.endswith(name + ".md")), None)
            if report:
                attrs["href"] = report + ".html"
            elif (not urlsplit(href).scheme and urlsplit(href).path.endswith(".md")) or href.startswith(("/", "file:")) or urlsplit(href).scheme not in ("", "http", "https", "mailto"):
                self.links.append("span")
                self.output.append('<span class="local-reference" title="' + escape(href, quote=True) + '">')
                return
            self.links.append("a")
        kept = {key: value for key, value in attrs.items() if key in ("href", "id", "class", "title", "start", "align")}
        if tag == "th":
            kept["scope"] = "col"
        if tag == "a" and kept.get("href", "").startswith(("https:", "http:")):
            kept.update(target="_blank", rel="noopener noreferrer")
        rendered = "".join(' ' + key + '="' + escape(value or "", quote=True) + '"' for key, value in kept.items())
        self.output.append("<" + tag + rendered + ">")

    def handle_endtag(self, tag):
        if tag not in ALLOWED:
            return
        if tag == "a":
            tag = self.links.pop()
        self.output.append("</" + tag + ">")
        if tag == "table":
            self.output.append("</div>")

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)

    def handle_data(self, data):
        self.output.append(escape(data))

    def handle_entityref(self, name):
        self.output.append("&" + name + ";")

    def handle_charref(self, name):
        self.output.append("&#" + name + ";")


def render_document(name, label, date):
    source = (ROOT / "sources" / (name + ".md")).read_text()
    title, _, body = source.partition("\n")
    converter = markdown.Markdown(extensions=["extra", "toc", "sane_lists"], extension_configs={"toc": {"toc_depth": "2"}})
    rendered = converter.convert(body)
    cleaned = DocumentHTML()
    cleaned.feed(rendered)
    navigation = "".join('<a href="' + key + '.html"' + (' aria-current="page"' if key == name else '') + '>' + value + '</a>' for key, value in DOCUMENTS.items())
    page = f'''<!doctype html>
<html lang="ko">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{label} | Codebuddy 보고서</title><link rel="icon" href="../assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="document.css"></head>
<body>
<a class="skip-link" href="#document">본문으로 이동</a>
<header class="document-topbar"><a class="document-brand" href="../index.html#method"><span aria-hidden="true">cb</span>Codebuddy 보고서</a><a class="back-link" href="../index.html#method">보고서로 돌아가기</a></header>
<main id="document">
<div class="document-heading"><span class="eyebrow">근거 자료 · {date.replace('-', '.')}</span><h1>{label}</h1><p>{escape(title.removeprefix('# '))}</p></div>
<nav class="document-tabs" aria-label="근거 자료 선택">{navigation}</nav>
<details class="document-contents"><summary>목차</summary>{converter.toc}</details>
<article class="document-body">{''.join(cleaned.output)}</article>
<footer><a href="../index.html#method">Codebuddy 보고서로 돌아가기</a></footer>
</main>
</body></html>
'''
    (ROOT / "sources" / (name + ".html")).write_text(page)


if __name__ == "__main__":
    data = (ROOT / "data.js").read_text()
    date = json.loads(data[data.index("{"):].rstrip().removesuffix(";"))["date"]
    for name, label in DOCUMENTS.items():
        render_document(name, label, date)
        print("Rendered", name + ".html")
