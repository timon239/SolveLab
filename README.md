# SolveLab

SolveLab ist ein interaktives Lernlabor für Mathematik.
Die Anwendung führt durch Algebra, Funktionen, Geometrie und Trigonometrie mit Theorie, Beispielen, Übungen und direkter Rückmeldung.

## Schnell starten

Wenn du SolveLab einfach ausprobieren möchtest:

1. Die ZIP-Datei entpacken.
2. Die Datei `index.html` doppelklicken.
3. Wenn alles normal aussieht, kannst du direkt loslegen.

Wenn etwas leer bleibt oder nicht richtig lädt:

1. Den Ordner `Matheinteraktion` öffnen.
2. Einen kleinen lokalen Webserver starten.
3. Danach im Browser `http://localhost:8080` öffnen.

Beispiel mit Python:

```bash
cd Matheinteraktion
python3 -m http.server 8080
```

Dann im Browser aufrufen:

- http://localhost:8080

Hinweis:
- Das direkte Öffnen von `index.html` ist der einfachste erste Versuch.
- Manche Browser blockieren dabei aber lokale Datendateien.
- SolveLab braucht derzeit beim Start Internet, weil einige Bibliotheken noch online geladen werden.

## Projektstruktur

- `index.html`: Grundlayout, Bereiche, Header und Skript/CSS-Einbindung
- `styles.css`: gesamtes visuelles Design, Layout, Komponenten, Responsive-Regeln
- `script.js`: Logik für Lernziele, Übungen, Berechnungen, Canvas-Sandbox, Zustand
- `data/`: benötigte Datenquellen und Hilfsdateien
- `tools/`: kleine Hilfsskripte für Prüfung und Pflege

## Bedienung

- Über den Lernpfad links ein Thema und ein Lernziel auswählen.
- Im Lernziel Parameter verändern und mit "Berechnen" arbeiten.
- Mit "Übung" eine Aufgabe erzeugen.
- Wenn verfügbar: "Übung in Sandbox laden", um Werte direkt zu übernehmen.
- Mit "Lösung ein-/ausblenden" zur Selbstkontrolle vergleichen.

## Lernstand speichern und laden

SolveLab speichert den Lernstand lokal im Browser.
Zusätzlich gibt es JSON-Export/Import:

- `Stand exportieren (JSON)`: komplette Fortschrittsdaten herunterladen
- `Stand importieren`: vorher exportierte JSON-Datei laden
- `Stand löschen`: lokalen Stand zurücksetzen

Hinweis:
- JSON-Dateien können sensible Lernverläufe enthalten. Nur gezielt weitergeben.

## PDF-Export

Mit `Statistik exportieren (PDF)` wird eine kompakte Zusammenfassung des Lernfortschritts erstellt.

## Teilen als ZIP

Für eine erste lauffähige ZIP sollten diese Dateien enthalten sein:

- `index.html`
- `styles.css`
- `script.js`
- `data/`
- `README.md`
- `START_HIER.txt`

Beispiel:

```bash
zip -r SolveLab.zip index.html styles.css script.js data README.md START_HIER.txt
```

## Fehlerbehebung

- Leere Seite nach Start:
  - Zuerst `index.html` per Doppelklick testen
  - Wenn Inhalte fehlen: `http://localhost:8080` verwenden
  - Browser-Konsole auf Fehlermeldungen prüfen
- Änderungen nicht sichtbar:
  - Seite hart neu laden (Shift + Reload)
- Export/Import klappt nicht:
  - Dateiformat prüfen (JSON)
  - Datei auf Vollständigkeit prüfen
- Formeln oder 3D-Ansichten fehlen:
  - Internetverbindung prüfen
  - SolveLab lädt derzeit einige Bibliotheken noch online nach

## Version

### SolveLab v1.0

Version v1.0 wurde im aktuellen Stand für einen begrenzten Testkreis freigegeben, um Erfahrungsberichte zu sammeln.

Geteilt als ZIP mit folgendem Inhalt:
- `index.html`
- `styles.css`
- `script.js`
- `data/`
- `README.md`
- `START_HIER.txt`

Details zu dieser Freigabe stehen in `RELEASE_NOTES_v1.0.txt`.

## Lizenz

Noch nicht festgelegt.

Bis zur Festlegung gilt: Nutzung nur nach Rücksprache mit dem Projektinhaber.
