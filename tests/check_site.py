"""Check routes, document structure, labels, and launch placeholders."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}

class Document(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.ids = set()
        self.links = []
        self.labels = set()
        self.controls = []
        self.h1 = 0
        self.main = 0
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag not in VOID:
            self.stack.append(tag)
        if 'id' in attrs:
            assert attrs['id'] not in self.ids, f'Duplicate id: {attrs["id"]}'
            self.ids.add(attrs['id'])
        if tag == 'a':
            self.links.append(attrs.get('href', ''))
        if tag == 'label':
            self.labels.add(attrs.get('for'))
        if tag in {'input', 'textarea', 'select'}:
            self.controls.append(attrs.get('id'))
        self.h1 += tag == 'h1'
        self.main += tag == 'main'
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in VOID:
            self.handle_endtag(tag)
    def handle_endtag(self, tag):
        assert self.stack and self.stack[-1] == tag, f'Misnested {tag}: {self.stack[-4:]}'
        self.stack.pop()

docs = {}
for file in ROOT.glob('*.html'):
    source = file.read_text(encoding='utf-8')
    doc = Document()
    doc.feed(source)
    assert not doc.stack, f'Unclosed elements in {file.name}'
    assert doc.h1 == 1 and doc.main == 1, file.name
    assert all(control and control in doc.labels for control in doc.controls), file.name
    assert chr(8211) not in source and chr(8212) not in source, file.name
    assert '<summary>Placeholders to complete</summary>' in source, file.name
    assert '<meta name="viewport"' in source, file.name
    docs[file.name] = doc

assert len(docs) == 7
for name, doc in docs.items():
    for href in doc.links:
        url = urlsplit(href)
        if url.scheme or url.netloc:
            continue
        destination = url.path or name
        assert (ROOT / destination).is_file(), f'{name}: missing {destination}'
        if url.fragment:
            assert url.fragment in docs[destination].ids, f'{name}: missing #{url.fragment}'
    assert 'lets-talk.html' in doc.links, name
    assert 'privacy.html' in doc.links and 'terms.html' in doc.links, name
assert '[Calendly booking embed placeholder]' in (ROOT / 'lets-talk.html').read_text(encoding='utf-8')
assert '[Policy text to be added]' in (ROOT / 'privacy.html').read_text(encoding='utf-8')
assert '[Policy text to be added]' in (ROOT / 'terms.html').read_text(encoding='utf-8')
assert len(docs['academy.html'].controls) == 5
assert len(docs['lets-talk.html'].controls) == 4
print('Passed: 7 pages, balanced HTML, unique IDs, working internal links and anchors, form labels, viewport metadata, and required placeholders.')
