#!/usr/bin/env python3
"""Build a curated sprint formula pack with PDF page references.

Uses extracted page text from data/fundamentum_pages.json and maps each formula
 to the first matching page by keyword regex.
"""

from __future__ import annotations

import json
import re
from pathlib import Path


DEFS = [
    {
        "chapter": "Algebra",
        "title": "Lineare Funktion",
        "latex": r"y = mx + q",
        "variables": {"m": "Steigung", "q": "y-Achsenabschnitt", "x": "Eingabewert"},
        "patterns": [r"lineare", r"funktion", r"mx", r"steigung"],
    },
    {
        "chapter": "Algebra",
        "title": "Lineare Gleichung",
        "latex": r"ax + b = 0",
        "variables": {"a": "Koeffizient", "b": "Konstante", "x": "Unbekannte"},
        "patterns": [r"ax\+b", r"lineare", r"gleichung"],
    },
    {
        "chapter": "Funktionen",
        "title": "Quadratische Funktion",
        "latex": r"f(x) = ax^2 + bx + c",
        "variables": {"a": "Öffnung/Streckung", "b": "Linearanteil", "c": "y-Achsenabschnitt"},
        "patterns": [r"quadrat", r"parabel", r"ax", r"bx", r"cx"],
    },
    {
        "chapter": "Funktionen",
        "title": "Mitternachtsformel",
        "latex": r"x_{1,2} = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}",
        "variables": {"a,b,c": "Koeffizienten", "x_1,x_2": "Nullstellen"},
        "patterns": [r"mitternacht", r"nullstellen", r"b\^2", r"4ac"],
    },
    {
        "chapter": "Funktionen",
        "title": "Diskriminante",
        "latex": r"\Delta = b^2 - 4ac",
        "variables": {r"\Delta": "Diskriminante", "a,b,c": "Koeffizienten"},
        "patterns": [r"diskriminante", r"b\^2", r"4ac"],
    },
    {
        "chapter": "Algebra",
        "title": "Logarithmus Produktregel",
        "latex": r"\log_b(uv) = \log_b(u) + \log_b(v)",
        "variables": {"b": "Basis", "u,v": "positive Zahlen"},
        "patterns": [r"logarith", r"logb", r"produkt"],
    },
    {
        "chapter": "Funktionen",
        "title": "Exponentialfunktion",
        "latex": r"f(x) = a \cdot b^x",
        "variables": {"a": "Startwert", "b": "Wachstumsfaktor", "x": "Zeit/Schritt"},
        "patterns": [r"exponential", r"wachstum", r"zerfall", r"b\^x"],
    },
    {
        "chapter": "Geometrie",
        "title": "Dreiecksfläche",
        "latex": r"A = \frac{1}{2}gh",
        "variables": {"g": "Grundseite", "h": "Höhe"},
        "patterns": [r"dreieck", r"fl[aä]cheninhalt", r"g", r"h"],
    },
    {
        "chapter": "Geometrie",
        "title": "Kreisfläche",
        "latex": r"A = \pi r^2",
        "variables": {"r": "Radius"},
        "patterns": [r"kreis", r"pi", r"r\^2", r"fl[aä]che"],
    },
    {
        "chapter": "Geometrie",
        "title": "Kreisumfang",
        "latex": r"U = 2\pi r",
        "variables": {"r": "Radius"},
        "patterns": [r"kreis", r"umfang", r"2", r"pi", r"r"],
    },
    {
        "chapter": "Geometrie",
        "title": "Kugelvolumen",
        "latex": r"V = \frac{4}{3}\pi r^3",
        "variables": {"r": "Radius"},
        "patterns": [r"kugel", r"volumen", r"r\^3", r"4", r"3"],
    },
    {
        "chapter": "Trigonometrie",
        "title": "Sinus im rechtwinkligen Dreieck",
        "latex": r"\sin(\alpha) = \frac{\text{Gegenkathete}}{\text{Hypotenuse}}",
        "variables": {r"\alpha": "Winkel"},
        "patterns": [r"sin", r"trigonometr", r"dreieck"],
    },
    {
        "chapter": "Trigonometrie",
        "title": "Kosinus im rechtwinkligen Dreieck",
        "latex": r"\cos(\alpha) = \frac{\text{Ankathete}}{\text{Hypotenuse}}",
        "variables": {r"\alpha": "Winkel"},
        "patterns": [r"cos", r"trigonometr", r"dreieck"],
    },
    {
        "chapter": "Trigonometrie",
        "title": "Tangens im rechtwinkligen Dreieck",
        "latex": r"\tan(\alpha) = \frac{\text{Gegenkathete}}{\text{Ankathete}}",
        "variables": {r"\alpha": "Winkel"},
        "patterns": [r"tan", r"trigonometr", r"dreieck"],
    },
]


def find_page(pages: list[dict], patterns: list[str], chapter: str) -> int | None:
    compiled = [re.compile(p, re.IGNORECASE) for p in patterns]

    # First pass: chapter-constrained search
    for p in pages:
        if p.get("chapter") != chapter:
            continue
        text = p.get("text", "")
        if all(rx.search(text) for rx in compiled[:1]):
            return int(p["page"])

    # Second pass: any page with at least one keyword
    for p in pages:
        text = p.get("text", "")
        if any(rx.search(text) for rx in compiled):
            return int(p["page"])

    return None


def main() -> None:
    root = Path(__file__).resolve().parent.parent
    pages_path = root / "data" / "fundamentum_pages.json"
    out_path = root / "data" / "formula_pack_sprint1.json"

    payload = json.loads(pages_path.read_text(encoding="utf-8"))
    pages = payload.get("pages", [])

    out = []
    for item in DEFS:
        page = find_page(pages, item["patterns"], item["chapter"])
        out.append(
            {
                "chapter": item["chapter"],
                "title": item["title"],
                "latex": item["latex"],
                "variables": item["variables"],
                "source": "Fundamentum.pdf",
                "page": page,
                "page_note": f"S. {page}" if page is not None else "Seite manuell prüfen",
            }
        )

    out_path.write_text(
        json.dumps(
            {
                "meta": {
                    "source": "/Users/timon/Downloads/Fundamentum.pdf",
                    "count": len(out),
                    "note": "Automatisch gemappte Seiten über Schlüsselwörter, zur finalen Kontrolle geeignet.",
                },
                "formulas": out,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    print(f"written: {out_path}")


if __name__ == "__main__":
    main()
