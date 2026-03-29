#!/usr/bin/env python3
"""Extract page text, chapter hints, and formula candidates from Fundamentum.pdf.

Outputs:
- data/fundamentum_pages.json
- data/fundamentum_formulas.json
- data/fundamentum_first_sprint.json
"""

from __future__ import annotations

import argparse
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import pdfplumber
from pypdf import PdfReader


CHAPTER_PATTERNS = [
    ("Algebra", re.compile(r"\b(algebra|arithmetik|gleichungssystem|potenzen|wurzeln|logarithmen)\b", re.IGNORECASE)),
    ("Funktionen", re.compile(r"\b(funktion(en)?|parabel|exponentialfunktion|scheitelpunkt|nullstellen)\b", re.IGNORECASE)),
    ("Geometrie", re.compile(r"\b(geometrie|planimetrie|stereometrie|umfang|flaecheninhalt|flächeninhalt|volumen|koerper|körper)\b", re.IGNORECASE)),
    ("Trigonometrie", re.compile(r"\b(trigonometrie|sinus|kosinus|tangens|dreieck)\b", re.IGNORECASE)),
]

FORMULA_LINE_PATTERN = re.compile(
    r"("  # line likely contains an equation or symbolic expression
    r"[A-Za-z][A-Za-z0-9_\(\)\[\]°]*\s*[=≈]\s*[^\n]{2,}"
    r"|"
    r"(?:sin|cos|tan|log|ln|sqrt|wurzel|\u221a)\s*\(?[A-Za-z0-9_+\-*/^ ]+\)?"
    r"|"
    r"\b[A-Za-z]\s*\^\s*\d+\b"
    r")",
    re.IGNORECASE,
)

MATH_SYMBOL_PATTERN = re.compile(r"[=≈+\-*/^%√π≤≥<>]")
TOC_LIKE_PATTERN = re.compile(r"^\s*\d+[\d\sA-Za-zÄÖÜäöüß.,\-]{2,}\s\d+\s*$")


@dataclass
class FormulaCandidate:
    page: int
    chapter: str
    raw: str
    score: int

    def to_dict(self) -> dict[str, Any]:
        return {
            "page": self.page,
            "chapter": self.chapter,
            "formula_raw": self.raw,
            "score": self.score,
        }


def detect_chapter(text: str, current: str) -> str:
    for chapter, pattern in CHAPTER_PATTERNS:
        if pattern.search(text):
            return chapter
    return current


def is_probably_noise(line: str) -> bool:
    normalized = re.sub(r"\s+", " ", line).strip()
    if not normalized:
        return True

    if TOC_LIKE_PATTERN.match(normalized):
        return True

    words = re.findall(r"[A-Za-zÄÖÜäöüß]{2,}", normalized)
    word_count = len(words)
    symbol_count = len(MATH_SYMBOL_PATTERN.findall(normalized))

    if word_count > 14 and symbol_count < 2:
        return True

    if normalized.endswith((".", ",", ";")) and symbol_count == 0:
        return True

    return False


def score_formula_line(line: str) -> int:
    score = 0
    score += 4 * len(re.findall(r"[=≈]", line))
    score += 2 * len(re.findall(r"[+\-*/^]", line))
    score += 2 * len(re.findall(r"(?:sin|cos|tan|log|ln|sqrt|wurzel|π)", line, flags=re.IGNORECASE))
    if re.search(r"\b[A-Za-z]\b", line):
        score += 1
    if len(line) > 90:
        score -= 2
    return score


def extract_formulas_from_text(page_text: str, page_num: int, chapter: str) -> list[FormulaCandidate]:
    lines = [line.strip() for line in page_text.splitlines() if line.strip()]
    out: list[FormulaCandidate] = []
    seen: set[str] = set()

    for line in lines:
        if FORMULA_LINE_PATTERN.search(line):
            normalized = re.sub(r"\s+", " ", line)
            if len(normalized) < 4:
                continue
            if is_probably_noise(normalized):
                continue
            score = score_formula_line(normalized)
            if score < 4:
                continue
            if normalized in seen:
                continue
            seen.add(normalized)
            out.append(FormulaCandidate(page=page_num, chapter=chapter, raw=normalized, score=score))

    return out


def rank_first_sprint(formulas: list[FormulaCandidate], limit: int = 14) -> list[dict[str, Any]]:
    chapter_quota = {
        "Algebra": 4,
        "Funktionen": 4,
        "Geometrie": 3,
        "Trigonometrie": 3,
    }

    by_chapter: dict[str, list[FormulaCandidate]] = {k: [] for k in chapter_quota}
    for formula in formulas:
        if formula.chapter in by_chapter:
            by_chapter[formula.chapter].append(formula)

    for chapter in by_chapter:
        by_chapter[chapter].sort(key=lambda f: f.score, reverse=True)

    picked: list[FormulaCandidate] = []
    for chapter, quota in chapter_quota.items():
        picked.extend(by_chapter[chapter][:quota])

    if len(picked) < limit:
        leftovers = [f for f in sorted(formulas, key=lambda f: f.score, reverse=True) if f not in picked]
        picked.extend(leftovers[: max(0, limit - len(picked))])

    return [
        {
            "chapter": f.chapter,
            "page": f.page,
            "formula_raw": f.raw,
            "source": "Fundamentum.pdf",
        }
        for f in picked[:limit]
    ]


def run(pdf_path: Path, out_dir: Path, prefix: str) -> None:
    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    out_dir.mkdir(parents=True, exist_ok=True)

    reader = PdfReader(str(pdf_path))
    page_count = len(reader.pages)

    pages_payload: list[dict[str, Any]] = []
    formula_candidates: list[FormulaCandidate] = []

    current_chapter = "Unbekannt"

    with pdfplumber.open(str(pdf_path)) as pdf:
        for idx, page in enumerate(pdf.pages, start=1):
            text = page.extract_text() or ""
            chapter = detect_chapter(text[:2000], current_chapter)
            current_chapter = chapter

            pages_payload.append(
                {
                    "page": idx,
                    "chapter": chapter,
                    "source": "Fundamentum.pdf",
                    "text": text,
                }
            )

            formula_candidates.extend(extract_formulas_from_text(text, idx, chapter))

    formulas_payload = [f.to_dict() for f in formula_candidates]
    first_sprint_payload = rank_first_sprint(formula_candidates, limit=14)

    meta = {
        "source": str(pdf_path),
        "page_count": page_count,
        "pages_extracted": len(pages_payload),
        "formulas_detected": len(formulas_payload),
    }

    (out_dir / f"{prefix}_pages.json").write_text(
        json.dumps({"meta": meta, "pages": pages_payload}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    (out_dir / f"{prefix}_formulas.json").write_text(
        json.dumps({"meta": meta, "formulas": formulas_payload}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    (out_dir / f"{prefix}_first_sprint.json").write_text(
        json.dumps({"meta": meta, "formulas": first_sprint_payload}, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(json.dumps(meta, ensure_ascii=False))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Extract text/formulas from Fundamentum PDF")
    parser.add_argument(
        "--pdf",
        type=Path,
        default=Path("/Users/timon/Downloads/Fundamentum.pdf"),
        help="Path to Fundamentum PDF",
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=Path("data"),
        help="Output directory",
    )
    parser.add_argument(
        "--prefix",
        type=str,
        default="fundamentum",
        help="Output filename prefix",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    run(args.pdf, args.out, args.prefix)


if __name__ == "__main__":
    main()
