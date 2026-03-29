# SolveLab - Feedback-Log

> Zweck: Rueckmeldungen so dokumentieren, dass sie direkt fuer Planungs- und Umsetzungsagenten nutzbar sind.

## 1. Meta

- Datum: 2026-03-28
- Version: 0.9.4
- Tester: Anna
- Umgebung:
  - Betriebssystem: macOS
  - Browser: Safari
  - Startart: Direkt ueber index.html
- Build/Stand-ID: Keine Angabe

## 2. Zusammenfassung

- Kurzfazit in 2-4 Saetzen: Gute Basis, aber beim Export treten einzelne UI-Unklarheiten auf.
- Wichtigste 3 Punkte:
  1. Export funktioniert stabil.
  2. Fehlermeldungen koennten klarer sein.
  3. Der Startprozess ist nicht selbsterklaerend.

## 3. Ticket-Uebersicht

| ID | Typ | Titel | Prioritaet | Status |
| ---- | ---- | ---- | ---- | ---- |
| FB-001 | UX | Startprozess erklaeren | P2 | Offen |
| FB-002 | Bug | Exportbutton bei schmalem Bildschirm | P1 | Offen |

---

## 4. Detailtickets

### FB-001 - Startprozess erklaeren

**Typ**
- UX

**Bereich**
- Startprozess

**Prioritaet**
- P2

**Ist-Verhalten**
- Neue Nutzer wissen nicht sofort, wie sie mit einem ersten Schritt beginnen sollen.

**Soll-Verhalten**
- Eine kurze Einfuehrung erklaert den ersten sinnvollen Schritt.

**Schritte zur Reproduktion**
1. App neu oeffnen
2. Startseite betrachten
3. Kein klarer Einstieg sichtbar

**Haeufigkeit**
- Oft

**Auswirkung**
- Nutzerwirkung: Unsicherheit bei Erstnutzung
- Risiko: Frueher Abbruch
- Betroffene Zielgruppe: Neue Nutzer

**Kontext / Vermutung (optional)**
- Moegliche Ursache: Fehlende Onboarding-Hinweise
- Verwandte Stellen/Dateien (falls bekannt): Keine Angabe

**Vorschlag zur Loesung (optional)**
- Kurzvorschlag: Kurze 3-Schritt-Einfuehrung auf der Startansicht anzeigen.

**Akzeptanzkriterien**
- [ ] Erster Schritt ist innerhalb von 5 Sekunden erkennbar
- [ ] Hinweistext ist auf Mobile sichtbar
- [ ] Hinweis kann geschlossen werden

**Anhaenge**
- Screenshot: startseite.png
- Video: Keine Angabe
- Konsolenfehler: Keine Angabe
- Sonstige Notizen: Keine Angabe

---

### FB-002 - Exportbutton bei schmalem Bildschirm

**Typ**
- Bug

**Bereich**
- Export

**Prioritaet**
- P1

**Ist-Verhalten**
- Auf sehr schmalen Displays rutscht der Exportbutton aus der Zeile.

**Soll-Verhalten**
- Buttons umbrechen sauber ohne Abschneiden.

**Schritte zur Reproduktion**
1. Browser auf 320px Breite setzen
2. Formular bis zum Exportbereich scrollen
3. Layout pruefen

**Haeufigkeit**
- Immer

**Auswirkung**
- Nutzerwirkung: CTA schlecht sichtbar
- Risiko: Feedback wird nicht abgesendet
- Betroffene Zielgruppe: Mobile Nutzer

**Kontext / Vermutung (optional)**
- Moegliche Ursache: Mindestbreite der Buttons zu hoch
- Verwandte Stellen/Dateien (falls bekannt): index.html

**Vorschlag zur Loesung (optional)**
- Kurzvorschlag: Button-Gruppe mit flex-wrap und kleineren horizontalen Abstaenden.

**Akzeptanzkriterien**
- [ ] Keine Ueberlaeufe bei 320px
- [ ] Primaerer CTA bleibt sichtbar
- [ ] Reihenfolge der Aktionen bleibt klar

**Anhaenge**
- Screenshot: export-mobile.png
- Video: Keine Angabe
- Konsolenfehler: Keine Angabe
- Sonstige Notizen: Keine Angabe
