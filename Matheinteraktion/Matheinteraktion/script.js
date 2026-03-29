const panels = document.querySelectorAll(".panel");
const progressList = document.getElementById("progressList");
const STORAGE_KEY = "matheinteraktion_learning_state_v1";
const STATE_SCHEMA_VERSION = 2;
const TOPIC_LABELS = {
  overview: "Übersicht",
  statistics: "Statistik",
  archive: "Nachschlage",
  glossary: "Glossar",
  algebra: "Algebra",
  funktionen: "Funktionen",
  geometrie: "Geometrie",
  trigonometrie: "Trigonometrie",
  formelbuch: "Formelbuch"
};

const REQUIREMENTS_PATH = [
  { id: "R01", area: "Arithmetik und Algebra", subarea: "Gleichungen und Gleichungssysteme", text: "LGS mit zwei und drei Variablen lösen", topic: "algebra", goalIds: ["lgs2", "lgs3"] },
  { id: "R02", area: "Arithmetik und Algebra", subarea: "Gleichungen und Gleichungssysteme", text: "Lineare Gleichungssysteme mit zwei Variablen graphisch interpretieren", topic: "algebra", goalIds: ["lgs2"] },
  { id: "R03", area: "Arithmetik und Algebra", subarea: "Gleichungen und Gleichungssysteme", text: "Quadratische Gleichungen mit verschiedenen Methoden lösen", topic: "algebra", goalIds: ["quad_methods"] },
  { id: "R04", area: "Arithmetik und Algebra", subarea: "Potenzen, Wurzeln und Logarithmen", text: "Rechenregeln für Potenzen, Wurzeln und Logarithmen anwenden", topic: "algebra", goalIds: ["pow_log"] },
  { id: "R05", area: "Arithmetik und Algebra", subarea: "Potenzen, Wurzeln und Logarithmen", text: "Potenz-, Wurzel-, Exponential- und Logarithmusgleichungen lösen", topic: "algebra", goalIds: ["exp_log_eq"] },
  { id: "R06", area: "Arithmetik und Algebra", subarea: "Potenzen, Wurzeln und Logarithmen", text: "Einfache Zins- und Zinseszinsaufgaben lösen", topic: "algebra", goalIds: ["interest"] },
  { id: "R07", area: "Funktionen", subarea: "Kernkompetenzen", text: "Lineare und quadratische Funktionen darstellen und Schnittpunkte bestimmen", topic: "funktionen", goalIds: ["lin_quad_plot"] },
  { id: "R08", area: "Funktionen", subarea: "Kernkompetenzen", text: "Funktionsgleichungen aus Graphen oder Punkten bestimmen", topic: "funktionen", goalIds: ["eq_from_points"] },
  { id: "R09", area: "Funktionen", subarea: "Kernkompetenzen", text: "Symmetrie, Öffnung und Scheitelpunkt der Parabel bestimmen", topic: "funktionen", goalIds: ["parabola_props"] },
  { id: "R10", area: "Funktionen", subarea: "Kernkompetenzen", text: "Exponentialfunktionen auf Wachstum/Zerfall anwenden", topic: "funktionen", goalIds: ["expo_growth"] },
  { id: "R11", area: "Geometrie", subarea: "Planimetrie", text: "Höhe, Winkelhalbierende, Schwerlinie/Seitenhalbierende im Dreieck", topic: "geometrie", goalIds: ["plane_measurement"] },
  { id: "R12", area: "Geometrie", subarea: "Planimetrie", text: "Umfang und Flächeninhalt zusammengesetzter Figuren", topic: "geometrie", goalIds: ["plane_measurement"] },
  { id: "R13", area: "Geometrie", subarea: "Planimetrie", text: "Ähnlichkeit zur Berechnung von Längen und Flächen", topic: "geometrie", goalIds: ["plane_measurement"] },
  { id: "R14", area: "Geometrie", subarea: "Stereometrie", text: "Körper skizzieren sowie Oberflächen und Volumen berechnen", topic: "geometrie", goalIds: ["solid_measurement"] },
  { id: "R15", area: "Geometrie", subarea: "Stereometrie", text: "Körper verändern und interpretieren", topic: "geometrie", goalIds: ["solid_measurement"] },
  { id: "R16", area: "Trigonometrie", subarea: "Kernkompetenzen", text: "Aufgaben in beliebigen Dreiecken lösen", topic: "trigonometrie", goalIds: ["triangle_trig"] },
  { id: "R17", area: "Trigonometrie", subarea: "Kernkompetenzen", text: "Winkel zwischen Geraden und Gerade-Ebene bestimmen", topic: "trigonometrie", goalIds: ["triangle_trig"] }
];

const BASICS_ARCHIVE = [
  {
    id: "B01",
    title: "Grundrechenarten und Vorzeichen",
    level: "Basis",
    summary: "Sicheres Rechnen mit positiven/negativen Zahlen und Reihenfolge der Rechenoperationen.",
    source: "Grundwissen Mathematik, Buchseite 10-21 (PDF 11-22)"
  },
  {
    id: "B02",
    title: "Bruchrechnung",
    level: "Basis",
    summary: "Kürzen, Erweitern, Addieren/Subtrahieren/Multiplizieren/Dividieren von Brüchen.",
    source: "Grundwissen Mathematik, Buchseite 20-28 (PDF 22-29)"
  },
  {
    id: "B03",
    title: "Potenzen und Wurzeln",
    level: "Sicher",
    summary: "Rechenregeln, Umformen und sichere Anwendung in Gleichungen.",
    source: "Grundwissen Mathematik, Buchseite 36-59 (Buchseite unsicher, PDF-Hinweis aus Inhaltsverzeichnis 7-8)"
  },
  {
    id: "B04",
    title: "Lineare Gleichungen",
    level: "Basis",
    summary: "Äquivalenzumformungen, Bruchgleichungen und Interpretation von Lösungen.",
    source: "Grundwissen Mathematik, Buchseite 102-115 (Buchseite unsicher, PDF-Hinweis aus Inhaltsverzeichnis Kapitel 9)"
  },
  {
    id: "B05",
    title: "LGS-Verfahren",
    level: "Sicher",
    summary: "Additions-, Einsetzungs- und Gleichsetzungsverfahren inklusive graphischer Deutung.",
    source: "Grundwissen Mathematik, Buchseite 116-129 (PDF 8)"
  },
  {
    id: "B06",
    title: "Quadratische Grundlagen",
    level: "Sicher",
    summary: "p-q-Formel, a-b-c-Formel, quadratische Ergänzung und Faktorzerlegung.",
    source: "Grundwissen Mathematik, Buchseite 130-142 (PDF 8)"
  },
  {
    id: "B07",
    title: "Funktionen und Graphen",
    level: "Transfer",
    summary: "Lineare, quadratische und Exponentialfunktionen lesen, zeichnen und interpretieren.",
    source: "Grundwissen Mathematik, Buchseite 162-212 (PDF 9)"
  },
  {
    id: "B08",
    title: "Geometrie und Trigonometrie",
    level: "Transfer",
    summary: "Dreiecke, Körper, Sinus/Kosinus/Tangens und Raumwinkel.",
    source: "Grundwissen Mathematik, Buchseite 240-349 (PDF 10)"
  },
  {
    id: "B09",
    title: "Ähnlichkeit und Skalierung",
    level: "Sicher",
    summary: "Ähnlichkeitskriterien, Skalierungsfaktor \\(k\\), Längenfaktor \\(k\\) und Flächenfaktor \\(k^2\\) mit typischen Prüfungsaufgaben.",
    source: "Grundwissen Mathematik, Buchseite 280-304 (PDF 10, Seitenabgleich ggf. unsicher)"
  },
  {
    id: "B10",
    title: "Determinante und Eindeutigkeit bei LGS",
    level: "Transfer",
    summary: "Determinante, Rangidee und Interpretation: eindeutige, keine oder unendlich viele Lösungen bei linearen Systemen.",
    source: "Grundwissen Mathematik, Buchseite 116-140 (PDF 8-9, Seitenabgleich ggf. unsicher)"
  }
];

const ARCHIVE_THEORY = {
  B01: {
    definition: "Grundrechenarten mit Vorzeichen sind die Basis für fast alle späteren Umformungen.",
    steps: [
      "Zuerst Klammern und Vorzeichen sauber auflösen.",
      "Dann Punkt-vor-Strich beachten.",
      "Am Ende das Ergebnis mit Überschlag prüfen."
    ],
    mistakes: ["Minus vor Klammern vergessen", "Reihenfolge der Rechenoperationen vertauscht"],
    edge: ["Doppeltes Minus wird Plus", "Ein negatives Produkt aus ungerader Anzahl negativer Faktoren bleibt negativ"],
    worked: "Beispiel: \\(7+(-3)=4\\) und \\(-2\\cdot(-5)=10\\)."
  },
  B02: {
    definition: "Brüche beschreiben Teile eines Ganzen und müssen oft zuerst auf gemeinsamen Nenner gebracht werden.",
    steps: [
      "Vor dem Addieren/Subtrahieren gemeinsamen Nenner bestimmen.",
      "Beim Multiplizieren Zähler mit Zähler, Nenner mit Nenner rechnen.",
      "Am Schluss kürzen, wenn möglich."
    ],
    mistakes: ["Zähler und Nenner getrennt addieren", "Nicht auf gekürzte Endform achten"],
    edge: ["Durch 0 darf nie dividiert werden", "Gemischte Zahlen erst in unechte Brüche umwandeln"],
    worked: "Beispiel: \\(\\tfrac{1}{3} + \\tfrac{1}{6} = \\tfrac{2}{6} + \\tfrac{1}{6} = \\tfrac{3}{6} = \\tfrac{1}{2}\\)."
  },
  B03: {
    definition: "Potenzen, Wurzeln und ihre Regeln helfen beim Vereinfachen und beim Lösen vieler Gleichungen.",
    steps: [
      "Gleiche Basen zusammenfassen und Exponentenregeln anwenden.",
      "Wurzeln als Potenzen mit Exponent \\(\\tfrac{1}{2}\\) oder \\(\\tfrac{1}{n}\\) mitdenken.",
      "Definitionsbereich bei geraden Wurzeln prüfen."
    ],
    mistakes: ["\\(a^m+a^n\\) mit \\(a^{m+n}\\) verwechseln", "\\(\\sqrt{x^2}=x\\) statt \\(|x|\\) setzen"],
    edge: ["Negative Exponenten bedeuten Kehrwert", "\\(a^0=1\\) nur für \\(a \\neq 0\\)"],
    worked: "Beispiel: \\(2^3 \\cdot 2^2 = 2^5 = 32\\) und \\(\\sqrt{49}=7\\)."
  },
  B04: {
    definition: "Lineare Gleichungen werden durch Äquivalenzumformungen gelöst, ohne die Lösungsmenge zu verändern.",
    steps: [
      "Alle x-Terme auf eine Seite und Zahlen auf die andere Seite bringen.",
      "Mit entgegengesetzten Operationen umformen.",
      "Am Ende durch Einsetzen prüfen."
    ],
    mistakes: ["Nur auf einer Seite verändern", "Vorzeichenfehler beim Verschieben"],
    edge: ["\\(0x=0\\) bedeutet unendlich viele Lösungen", "\\(0x=5\\) bedeutet keine Lösung"],
    worked: "Beispiel: \\(3x-5=10 \\Rightarrow 3x=15 \\Rightarrow x=5\\)."
  },
  B05: {
    definition: "LGS-Verfahren lösen mehrere lineare Gleichungen gleichzeitig durch Einsetzen, Gleichsetzen oder Addieren.",
    steps: [
      "Ein geeignetes Verfahren zum Eliminieren einer Variablen wählen.",
      "Reduziertes System lösen.",
      "Rückeinsetzen und beide Gleichungen prüfen."
    ],
    mistakes: ["Unpassende Faktoren beim Additionsverfahren", "Nur eine Gleichung prüfen"],
    edge: ["Parallele Geraden: keine Lösung", "Identische Geraden: unendlich viele Lösungen"],
    worked: "Beispiel: \\(x+y=5\\) und \\(x-y=1 \\Rightarrow 2x=6 \\Rightarrow x=3,\\,y=2\\)."
  },
  B06: {
    definition: "Quadratische Grundlagen verbinden Normalform, Faktorzerlegung, pq-Formel und Scheitelpunktdenken.",
    steps: [
      "Zuerst auf die Form \\(ax^2+bx+c=0\\) bringen.",
      "Dann Faktorzerlegung oder Formel wählen.",
      "Lösungen und Graphbild gemeinsam interpretieren."
    ],
    mistakes: ["Minuszeichen in der Formel vergessen", "\\(x^2\\)-Term nicht sauber isolieren"],
    edge: ["\\(\\Delta<0\\): keine reelle Nullstelle", "\\(\\Delta=0\\): doppelte Lösung"],
    worked: "Beispiel: \\(x^2-5x+6=(x-2)(x-3)\\)."
  },
  B07: {
    definition: "Funktionen und Graphen verbinden Term, Tabelle, Graph und Sachbedeutung.",
    steps: [
      "Erst die Parameter lesen, dann den Graphen deuten.",
      "Wichtige Punkte wie Nullstellen, Achsenabschnitt, Scheitelpunkt markieren.",
      "Frage stets: Was bedeutet das Ergebnis im Kontext?"
    ],
    mistakes: ["Graph und Gleichung nicht aufeinander beziehen", "Steigung und Achsenabschnitt verwechseln"],
    edge: ["Gerade und Parabel können 0/1/2 Schnittpunkte haben", "Exponentialfunktionen schneiden die x-Achse oft gar nicht"],
    worked: "Beispiel: \\(y=2x+1\\) steigt pro Schritt um 2 und schneidet die y-Achse bei 1."
  },
  B08: {
    definition: "Geometrie und Trigonometrie helfen beim Rechnen mit Formen, Körpern, Winkeln und Beziehungen im Raum.",
    steps: [
      "Immer mit einer klaren Skizze starten.",
      "Gegebene Größen markieren und passende Formel wählen.",
      "Ergebnis auf Einheit und Plausibilität prüfen."
    ],
    mistakes: ["Winkel- und Längeneinheiten mischen", "Falsche Formel für Fläche/Volumen benutzen"],
    edge: ["Höhen können außerhalb der Figur liegen", "Im Raum ist die Blickrichtung wichtig"],
    worked: "Beispiel: Dreiecksfläche \\(A=\\tfrac{1}{2}g\\cdot h\\) und Zylindervolumen \\(V=\\pi r^2 h\\)."
  },
  B09: {
    definition: "Ähnlichkeit beschreibt gleiche Winkel und proportionale Seiten; Längen wachsen mit \\(k\\), Flächen mit \\(k^2\\).",
    steps: [
      "Zuerst passende entsprechende Seiten finden.",
      "Skalierungsfaktor \\(k\\) bestimmen.",
      "Dann Längen mit \\(k\\) und Flächen mit \\(k^2\\) berechnen."
    ],
    mistakes: ["Flächen ebenfalls nur mit \\(k\\) skalieren", "Nicht entsprechende Seiten vergleichen"],
    edge: ["\\(k<1\\) bedeutet Verkleinerung", "Maßstab \\(1:n\\) muss erst in \\(k\\) umgerechnet werden"],
    worked: "Beispiel: \\(k=1{,}5\\): Länge 4 wird 6, Fläche 8 wird 18."
  },
  B10: {
    definition: "Determinante und Eindeutigkeit zeigen, ob ein lineares Gleichungssystem genau eine, keine oder unendlich viele Lösungen hat.",
    steps: [
      "Matrix des Systems aufstellen.",
      "Determinante oder Struktur prüfen.",
      "Ergebnis fachlich deuten: eindeutig oder nicht eindeutig."
    ],
    mistakes: ["\\(\\det(A)=0\\) fälschlich als 'keine Lösung' lesen", "Eindeutigkeit und Lösungswert verwechseln"],
    edge: ["\\(\\det(A)=0\\) kann keine oder unendlich viele Lösungen bedeuten", "\\(\\det(A)\\neq 0\\) garantiert genau eine Lösung"],
    worked: "Beispiel: \\(\\det(A)=5\\) → das System ist eindeutig lösbar."
  }
};

const ARCHIVE_ENHANCEMENTS = {
  B01: {
    operatorGuide: "Arbeite langsam und prüfe Vorzeichen bewusst. Diese Übungen helfen dir, spätere Umformungen sicher zu machen.",
    tags: ["Grundlagen", "Vorzeichen"],
    exampleTitle: "Temperaturen über Null und unter Null",
    exampleText: "Eine Temperatur steigt von -3°C auf +4°C. Rechne die Veränderung und beschreibe das Vorzeichen sauber.",
    relatedGoalIds: ["lgs2", "quad_methods", "interest"]
  },
  B02: {
    operatorGuide: "Nutze die Bruchregeln so, wie du später auch Gleichungen mit Brüchen vereinfachst.",
    tags: ["Brüche", "Umformen"],
    exampleTitle: "Rezept anpassen",
    exampleText: "Ein Rezept braucht 1/3 Liter Milch, du kochst die halbe Menge. Bestimme den neuen Bruch sauber.",
    relatedGoalIds: ["pow_log", "exp_log_eq"]
  },
  B03: {
    operatorGuide: "Achte auf Basen, Exponenten und Definitionsbereiche. Diese Übungen bereiten Potenz- und Log-Aufgaben vor.",
    tags: ["Potenzen", "Wurzeln"],
    exampleTitle: "Speicherverdopplung",
    exampleText: "Ein Speicher verdoppelt sich in jedem Schritt. Beschreibe das mit einer Potenz und vereinfache passende Terme.",
    relatedGoalIds: ["pow_log", "exp_log_eq", "any_triangle"]
  },
  B04: {
    operatorGuide: "Löse erst ruhig Gleichungen mit einer Variablen, bevor du auf Systeme oder Funktionsgleichungen gehst.",
    tags: ["Lineare Gleichungen", "Äquivalenzumformung"],
    exampleTitle: "Handytarif mit Grundgebühr",
    exampleText: "Ein Tarif kostet 5 Euro Grundgebühr plus 3 Euro pro Einheit. Bestimme ab wann 20 Euro erreicht werden.",
    relatedGoalIds: ["lgs2", "lgs3", "eq_from_points"]
  },
  B05: {
    operatorGuide: "Wähle bewusst ein Verfahren und erkläre dir selbst, warum es hier passt.",
    tags: ["LGS", "Verfahren"],
    exampleTitle: "Zwei Ticketsysteme vergleichen",
    exampleText: "Zwei Preisregeln führen zum gleichen Endpreis. Das ist genau die Situation für ein LGS.",
    relatedGoalIds: ["lgs2", "lgs3"]
  },
  B06: {
    operatorGuide: "Nutze diese Grundlagen, bevor du Parabeln, Nullstellen oder Schnittpunkte sicher bearbeitest.",
    tags: ["Quadratisch", "Nullstellen"],
    exampleTitle: "Ballflug und Bodenberührung",
    exampleText: "Die Höhe eines Balls wird durch einen quadratischen Term beschrieben. Bestimme, wann er den Boden erreicht.",
    relatedGoalIds: ["quad_methods", "parabola_props", "lin_quad_plot"]
  },
  B07: {
    operatorGuide: "Verbinde Term, Graph und Bedeutung. Das ist der Kern für viele spätere Prüfungsaufgaben.",
    tags: ["Funktionen", "Graphen"],
    exampleTitle: "Stromkosten im Monat",
    exampleText: "Grundpreis plus Verbrauch ergeben eine lineare Funktion. Lies ab, vergleiche und interpretiere den Graphen.",
    relatedGoalIds: ["lin_quad_plot", "eq_from_points", "expo_growth", "interest"]
  },
  B08: {
    operatorGuide: "Skizziere zuerst. Eine gute Zeichnung nimmt dir in Geometrie und Trigonometrie viel Unsicherheit.",
    tags: ["Geometrie", "Trigonometrie"],
    exampleTitle: "Rampe und Verpackung",
    exampleText: "Eine Rampe braucht einen Winkel, eine Verpackung braucht Volumen. Beides beginnt mit einer sauberen Skizze.",
    relatedGoalIds: ["triangle_lines", "area_composite", "solids", "space_angle"]
  },
  B09: {
    operatorGuide: "Prüfe immer: Geht es um Länge, Fläche oder Volumen? Davon hängt der Faktor ab.",
    tags: ["Ähnlichkeit", "Skalierung"],
    exampleTitle: "Bauplan vergrößern",
    exampleText: "Ein Grundriss wird vergrößert. Überlege, welche Größen mit \\(k\\) und welche mit \\(k^2\\) wachsen.",
    relatedGoalIds: ["similarity", "cut_compose"]
  },
  B10: {
    operatorGuide: "Nutze die Determinante als schnellen Plausibilitätscheck, bevor du viel rechnest.",
    tags: ["Determinante", "Eindeutigkeit"],
    exampleTitle: "Mischung eindeutig oder nicht?",
    exampleText: "Drei Bedingungen für drei unbekannte Zutaten: zuerst prüfen, ob das System überhaupt eindeutig ist.",
    relatedGoalIds: ["lgs3", "space_angle"]
  }
};

const GLOSSARY_TERMS = [
  { term: "Ähnlichkeit", symbol: "\\(k\\)", definition: "Figuren mit gleichen Winkeln und proportionalen Seiten." },
  { term: "Achsenabschnitt", symbol: "\\(q\\)", definition: "Schnittpunkt einer Geraden mit der y-Achse." },
  { term: "Basis (Logarithmus)", symbol: "\\(b\\)", definition: "Die Zahl, zu der potenziert wird: \\(b^x\\)." },
  { term: "Cosinus", symbol: "\\(\\cos(\\alpha)\\)", definition: "Verhältnis der Ankathete zur Hypotenuse im rechtwinkligen Dreieck." },
  { term: "Determinante", symbol: "\\(\\det(A)\\)", definition: "Kennzahl einer Matrix; \\(\\det(A)\\neq 0\\) bedeutet eindeutige LGS-Lösung." },
  { term: "Diskriminante", symbol: "\\(\\Delta=b^2-4ac\\)", definition: "Bestimmt die Anzahl reeller Lösungen einer quadratischen Gleichung." },
  { term: "Exponentialfunktion", symbol: "\\(f(x)=a\\cdot b^x\\)", definition: "Wachstum oder Zerfall mit konstantem Faktor pro Schritt." },
  { term: "Faktorzerlegung", symbol: "\\((x-x_1)(x-x_2)\\)", definition: "Produktdarstellung eines quadratischen Terms zur Lösungssuche." },
  { term: "Funktionswert", symbol: "\\(f(x)\\)", definition: "Der y-Wert, der zu einem x-Wert gehört." },
  { term: "Gerade", symbol: "\\(y=mx+q\\)", definition: "Lineare Funktion mit konstanter Steigung." },
  { term: "Hypotenuse", symbol: "\\(c\\)", definition: "Längste Seite im rechtwinkligen Dreieck." },
  { term: "Kosinussatz", symbol: "\\(c^2=a^2+b^2-2ab\\cos(\\gamma)\\)", definition: "Berechnet unbekannte Seiten in beliebigen Dreiecken." },
  { term: "Lineares Gleichungssystem", symbol: "\\(Ax=b\\)", definition: "Mehrere lineare Gleichungen mit denselben Variablen." },
  { term: "Logarithmus", symbol: "\\(\\log_b(u)\\)", definition: "Inverse Operation zur Potenz: \\(b^x=u\\)." },
  { term: "Median/Schwerlinie", symbol: "\\(m_a\\)", definition: "Verbindung vom Eckpunkt zum Mittelpunkt der Gegenseite." },
  { term: "Mitternachtsformel", symbol: "\\(x=\\tfrac{-b\\pm\\sqrt{\\Delta}}{2a}\\)", definition: "Allgemeine Lösungsformel für \\(ax^2+bx+c=0\\)." },
  { term: "Nullstelle", symbol: "\\(f(x)=0\\)", definition: "x-Wert, bei dem der Graph die x-Achse schneidet." },
  { term: "Parabel", symbol: "\\(f(x)=ax^2+bx+c\\)", definition: "Graph einer quadratischen Funktion." },
  { term: "Potenz", symbol: "\\(a^n\\)", definition: "n-fache Multiplikation der Basis a mit sich selbst." },
  { term: "Probe", symbol: "Einsetzen", definition: "Kontrolle einer Lösung durch Rückeinsetzen in die Ausgangsgleichung." },
  { term: "Proportionalität", symbol: "\\(y=kx\\)", definition: "Größen ändern sich mit konstantem Faktor." },
  { term: "Quadratische Ergänzung", symbol: "\\(x^2+bx \\to (x+p)^2\\)", definition: "Umformung zum Finden des Scheitelpunkts oder der Lösungen." },
  { term: "Radikand", symbol: "\\(\\sqrt{a}\\)", definition: "Ausdruck unter der Wurzel." },
  { term: "Rang (LGS)", symbol: "\\(\\mathrm{rang}(A)\\)", definition: "Anzahl linear unabhängiger Zeilen/Spalten; hilft bei der Lösungsart." },
  { term: "Scheitelpunkt", symbol: "\\(S(x_s,\\,y_s)\\)", definition: "Extrempunkt der Parabel und Mittelpunkt ihrer Symmetrie." },
  { term: "Sinussatz", symbol: "\\(\\tfrac{a}{\\sin(\\alpha)}=\\tfrac{b}{\\sin(\\beta)}\\)", definition: "Verknüpft Seiten und Winkel in beliebigen Dreiecken." },
  { term: "Steigung", symbol: "\\(m\\)", definition: "Änderung von y pro x-Einheit bei einer Geraden." },
  { term: "Tangens", symbol: "\\(\\tan(\\alpha)\\)", definition: "Verhältnis der Gegenkathete zur Ankathete." },
  { term: "Variablen", symbol: "\\(x,y,z\\)", definition: "Unbekannte Größen, die berechnet werden sollen." },
  { term: "Vektor", symbol: "\\(\\mathbf{u}=(u_1,u_2,u_3)\\)", definition: "Gerichtete Größe für Richtung und Länge im Raum." },
  { term: "Winkelhalbierende", symbol: "\\(w_a\\)", definition: "Halbiert einen Winkel im Dreieck in zwei gleich große Teile." },
  { term: "Zinseszins", symbol: "\\(K_n=K_0(1+p)^n\\)", definition: "Verzinsung auf Kapital inklusive bereits erhaltener Zinsen." }
];

let solid3DController = null;

function showTopic(name) {
  panels.forEach((p) => p.classList.toggle("active", p.id === name));
  if (name === "geometrie") {
    ensureSolid3D();
  }
  if (name === "overview" || name === "statistics") {
    refreshLearningUI();
  }
}

function typeset(node) {
  if (window.MathJax && window.MathJax.typesetPromise) {
    window.MathJax.typesetPromise(node ? [node] : undefined).catch(() => {});
  }
}

function renderFormulaLibrary(formulas) {
  const target = document.getElementById("formulaLibrary");
  if (!target) return;
  target.innerHTML = "";

  formulas.forEach((item) => {
    const card = document.createElement("div");
    card.className = "formula-card";
    const vars = Object.entries(item.variables || {})
      .map(([k, v]) => `<li><strong>${k}</strong>: ${v}</li>`)
      .join("");

    card.innerHTML = `
      <h3>${item.title}</h3>
      <p class="formula-meta">Kapitel: ${item.chapter}</p>
      <p class="formula-latex">\\(${item.latex}\\)</p>
      <ul class="formula-vars">${vars}</ul>
      <p class="formula-source">Quelle: Fundamentum.pdf, ${item.page_note || "S. ?"}</p>
    `;
    target.appendChild(card);
  });
  typeset(target);
}

async function loadFormulaLibrary() {
  const fallback = [
    { chapter: "Algebra", title: "Lineare Funktion", latex: "y = mx + q", variables: { m: "Steigung", q: "y-Achsenabschnitt", x: "Eingabewert" }, source: "Fundamentum.pdf", page_note: "S. 14" },
    { chapter: "Algebra", title: "Lineare Gleichung", latex: "ax + b = 0", variables: { a: "Koeffizient", b: "Konstante", x: "Unbekannte" }, source: "Fundamentum.pdf", page_note: "S. 14" },
    { chapter: "Funktionen", title: "Quadratische Funktion", latex: "f(x) = ax^2 + bx + c", variables: { a: "Öffnung/Streckung", b: "Linearanteil", c: "y-Achsenabschnitt" }, source: "Fundamentum.pdf", page_note: "S. 6" },
    { chapter: "Funktionen", title: "Mitternachtsformel", latex: "x_{1,2} = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}", variables: { "a,b,c": "Koeffizienten", "x_1,x_2": "Nullstellen" }, source: "Fundamentum.pdf", page_note: "S. 13" },
    { chapter: "Funktionen", title: "Diskriminante", latex: "\\Delta = b^2 - 4ac", variables: { "\\Delta": "Diskriminante", "a,b,c": "Koeffizienten" }, source: "Fundamentum.pdf", page_note: "S. 15" },
    { chapter: "Algebra", title: "Logarithmus Produktregel", latex: "\\log_b(uv) = \\log_b(u) + \\log_b(v)", variables: { b: "Basis", "u,v": "positive Zahlen" }, source: "Fundamentum.pdf", page_note: "S. 16" },
    { chapter: "Funktionen", title: "Exponentialfunktion", latex: "f(x) = a \\cdot b^x", variables: { a: "Startwert", b: "Wachstumsfaktor", x: "Zeit/Schritt" }, source: "Fundamentum.pdf", page_note: "S. 51" },
    { chapter: "Geometrie", title: "Dreiecksfläche", latex: "A = \\frac{1}{2}gh", variables: { g: "Grundseite", h: "Höhe" }, source: "Fundamentum.pdf", page_note: "S. 19" },
    { chapter: "Geometrie", title: "Kreisfläche", latex: "A = \\pi r^2", variables: { r: "Radius" }, source: "Fundamentum.pdf", page_note: "S. 19" },
    { chapter: "Geometrie", title: "Kreisumfang", latex: "U = 2\\pi r", variables: { r: "Radius" }, source: "Fundamentum.pdf", page_note: "S. 19" },
    { chapter: "Geometrie", title: "Kugelvolumen", latex: "V = \\frac{4}{3}\\pi r^3", variables: { r: "Radius" }, source: "Fundamentum.pdf", page_note: "S. 31" },
    { chapter: "Trigonometrie", title: "Sinus", latex: "\\sin(\\alpha)=\\frac{\\text{Gegenkathete}}{\\text{Hypotenuse}}", variables: { "\\alpha": "Winkel" }, source: "Fundamentum.pdf", page_note: "S. 17" },
    { chapter: "Trigonometrie", title: "Kosinus", latex: "\\cos(\\alpha)=\\frac{\\text{Ankathete}}{\\text{Hypotenuse}}", variables: { "\\alpha": "Winkel" }, source: "Fundamentum.pdf", page_note: "S. 26" },
    { chapter: "Trigonometrie", title: "Tangens", latex: "\\tan(\\alpha)=\\frac{\\text{Gegenkathete}}{\\text{Ankathete}}", variables: { "\\alpha": "Winkel" }, source: "Fundamentum.pdf", page_note: "S. 12" }
  ];

  try {
    const response = await fetch("data/formula_pack_sprint1.json", { cache: "no-cache" });
    if (!response.ok) throw new Error("fetch failed");
    const payload = await response.json();
    renderFormulaLibrary(payload.formulas || fallback);
  } catch {
    renderFormulaLibrary(fallback);
  }
}

loadFormulaLibrary();

function n(v) {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
}

const GOAL_DEFS = {
  algebra: [
    {
      id: "lgs2",
      title: "LGS mit zwei Variablen lösen",
      source: "Fundamentum.pdf, S. 14",
      theory: "\\(\\begin{aligned}a\\cdot x+b\\cdot y&=e\\\\ c\\cdot x+d\\cdot y&=f\\end{aligned}\\) mit Schnittpunkt als Lösung.",
      equation: (v) => `\\begin{aligned}${v.a}x+${v.b}y&=${v.e}\\\\${v.c}x+${v.d}y&=${v.f}\\end{aligned}`,
      controls: [
        { key: "a", label: "a", value: 2 },
        { key: "b", label: "b", value: 1 },
        { key: "e", label: "e", value: 7 },
        { key: "c", label: "c", value: 1 },
        { key: "d", label: "d", value: -1 },
        { key: "f", label: "f", value: 1 }
      ]
    },
    {
      id: "lgs3",
      title: "LGS mit drei Variablen lösen",
      source: "Fundamentum.pdf, S. 14",
      theory: "\\(\\begin{aligned}a_1x+b_1y+c_1z&=d_1\\\\a_2x+b_2y+c_2z&=d_2\\\\a_3x+b_3y+c_3z&=d_3\\end{aligned}\\)",
      equation: (v) => `\\begin{aligned}${v.a1}x+${v.b1}y+${v.c1}z&=${v.d1}\\\\${v.a2}x+${v.b2}y+${v.c2}z&=${v.d2}\\\\${v.a3}x+${v.b3}y+${v.c3}z&=${v.d3}\\end{aligned}`,
      controls: [
        { key: "a1", label: "a_1", value: 1 },
        { key: "b1", label: "b_1", value: 2 },
        { key: "c1", label: "c_1", value: 1 },
        { key: "d1", label: "d_1", value: 8 },
        { key: "a2", label: "a_2", value: 1 },
        { key: "b2", label: "b_2", value: 1 },
        { key: "c2", label: "c_2", value: 2 },
        { key: "d2", label: "d_2", value: 9 },
        { key: "a3", label: "a_3", value: 2 },
        { key: "b3", label: "b_3", value: 1 },
        { key: "c3", label: "c_3", value: 1 },
        { key: "d3", label: "d_3", value: 10 }
      ]
    },
    {
      id: "quad_methods",
      title: "Quadratische Gleichungen: Formel/Faktorzerlegung",
      source: "Fundamentum.pdf, S. 13-15",
      theory: "\\(x_{1,2}=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}\\), alternativ Faktorzerlegung \\((x-x_1)(x-x_2)=0\\)",
      equation: (v) => `f(x)=${v.a}x^2+${v.b}x+${v.c}`,
      controls: [
        { key: "a", label: "a", value: 1 },
        { key: "b", label: "b", value: -3 },
        { key: "c", label: "c", value: 2 }
      ]
    },
    {
      id: "pow_log",
      title: "Potenzen, Wurzeln, Logarithmen",
      source: "Fundamentum.pdf, S. 16",
      theory: "Definitionen: Eine Potenz \\(a^n\\) bedeutet, dass die Basis \\(a\\) \\(n\\)-mal multipliziert wird. Bei gleicher Basis gilt \\(a^m\\cdot a^n=a^{m+n}\\), beim Dividieren \\(a^m/a^n=a^{m-n}\\) (mit \\(a\\neq 0\\)). Wurzeln sind Potenzen mit Bruch-Exponent, z. B. \\(\\sqrt{a}=a^{1/2}\\).\n\nVorgehen bei Termen: 1) gleiche Basen zusammenfassen, 2) Exponentenregeln anwenden, 3) erst am Ende numerisch ausrechnen. Bei Logarithmen gilt \\(\\log_b(uv)=\\log_b(u)+\\log_b(v)\\) und \\(\\log_b(u/v)=\\log_b(u)-\\log_b(v)\\), aber nur für positive Argumente.\n\nTypische Fehler: Exponenten bei Addition addieren (falsch), \\(\\sqrt{x^2}=x\\) für negative \\(x\\) (falsch, korrekt ist \\(|x|\\)), und Logarithmen mit nicht-positiven Argumenten verwenden. Edge Cases: \\(a^0=1\\) für \\(a\\neq 0\\), \\(a^{-n}=1/a^n\\), bei geraden Wurzeln muss der Radikand nicht-negativ sein.",
      equation: (v) => `${v.a}^{${v.m}}\\cdot${v.a}^{${v.n}}=${v.a}^{${v.m + v.n}}`,
      controls: [
        { key: "a", label: "a", value: 2 },
        { key: "m", label: "m", value: 3 },
        { key: "n", label: "n", value: 2 }
      ],
      noCanvas: true
    },
    {
      id: "exp_log_eq",
      title: "Potenz-/Wurzel-/Exponential-/Log-Gleichungen",
      source: "Fundamentum.pdf, S. 16, 51",
      theory: "Ziel bei diesen Gleichungen ist immer: die Unbekannte isolieren und am Ende per Probe sichern.\n\nFalltyp A (rein exponentiell): \\(a^{u(x)}=b\\). Vorgehen: logarithmieren oder gleiche Basis herstellen. Beispiel: \\(2^{x+1}=32\\Rightarrow 2^{x+1}=2^5\\Rightarrow x=4\\).\n\nFalltyp B (logarithmisch): \\(\\log_a(u(x))=c\\). Vorgehen: in Exponentialform umschreiben \\(u(x)=a^c\\), dann linear/quadratisch lösen. Beispiel: \\(\\log_3(x+1)=2\\Rightarrow x+1=9\\Rightarrow x=8\\).\n\nFalltyp C (gemischt mit Wurzel/Potenz): erst Definitionsbereich sichern, dann Potenzieren oder Substitution, am Ende zwingend Probe wegen Scheinlösungen. Beispiel: \\(\\sqrt{x+5}=x-1\\Rightarrow x+5=x^2-2x+1\\).\n\nTypische Fehler: falsche Basis beim Logarithmieren, Klammern im Exponenten vergessen, Probe nach Quadrieren auslassen. Edge Cases: Basis \\(a>0\\) und \\(a\\neq 1\\), Logarithmusargument > 0, bei geraden Wurzeln muss der Radikand nicht-negativ sein.",
      equation: (v) => `${v.base}^x=${Math.pow(Math.max(v.base, 0.1), Math.max(v.x, 1)).toFixed(2)}`,
      controls: [
        { key: "base", label: "Basis", value: 2 },
        { key: "x", label: "x", value: 5 }
      ],
      noCanvas: true
    },
    {
      id: "interest",
      title: "Zins und Zinseszins",
      source: "Fundamentum.pdf, S. 51",
      theory: "\\(K_n=K_0(1+p)^n\\) mit \\(p\\) als Dezimalzahl.",
      equation: (v) => `K_n=${v.k0}(1+${(v.p / 100).toFixed(3)})^{${v.n}}`,
      controls: [
        { key: "k0", label: "K0", value: 1000 },
        { key: "p", label: "p %", value: 5 },
        { key: "n", label: "Jahre", value: 10 }
      ]
    }
  ],
  funktionen: [
    {
      id: "lin_quad_plot",
      title: "Lineare & quadratische Funktionen darstellen",
      source: "Fundamentum.pdf, S. 6-15",
      theory: "\\(f(x)=ax^2+bx+c\\) und \\(g(x)=mx+q\\), Schnittpunkte durch \\(f(x)=g(x)\\)",
      equation: (v) => `f(x)=${v.a}x^2+${v.b}x+${v.c},\\;g(x)=${v.m}x+${v.q}`,
      controls: [
        { key: "a", label: "a", value: 1 },
        { key: "b", label: "b", value: -2 },
        { key: "c", label: "c", value: -3 },
        { key: "m", label: "m", value: 1 },
        { key: "q", label: "q", value: 0 }
      ]
    },
    {
      id: "eq_from_points",
      title: "Funktionsgleichung aus Punkten bestimmen",
      source: "Fundamentum.pdf, S. 14",
      theory: "\\(m=\\frac{y_2-y_1}{x_2-x_1},\\;q=y_1-mx_1\\)",
      equation: (v) => `P_1(${v.x1},${v.y1}),\\;P_2(${v.x2},${v.y2})`,
      controls: [
        { key: "x1", label: "x1", value: 1 },
        { key: "y1", label: "y1", value: 2 },
        { key: "x2", label: "x2", value: 3 },
        { key: "y2", label: "y2", value: 6 }
      ]
    },
    {
      id: "parabola_props",
      title: "Symmetrie, Öffnung, Scheitelpunkt",
      source: "Fundamentum.pdf, S. 15",
      theory: "\\(x_S=-\\frac{b}{2a},\\;y_S=f(x_S)\\), Symmetrieachse \\(x=x_S\\)",
      equation: (v) => `f(x)=${v.a}x^2+${v.b}x+${v.c}`,
      controls: [
        { key: "a", label: "a", value: 1 },
        { key: "b", label: "b", value: -4 },
        { key: "c", label: "c", value: 1 }
      ]
    },
    {
      id: "expo_growth",
      title: "Exponentialfunktion: Wachstum/Zerfall",
      source: "Fundamentum.pdf, S. 51",
      theory: "\\(f(x)=a\\cdot b^x\\), \\(b>1\\) Wachstum, \\(0<b<1\\) Zerfall.",
      equation: (v) => `f(x)=${v.a}\\cdot${v.b}^x`,
      controls: [
        { key: "a", label: "a", value: 2 },
        { key: "b", label: "b", value: 1.2 }
      ]
    }
  ],
  geometrie: [
    {
      id: "triangle_lines",
      title: "Höhe, Winkelhalbierende, Schwerlinie im Dreieck",
      source: "Fundamentum.pdf, S. 19",
      theory: "Definitionen: Die Höhe ist die Senkrechte von einem Eckpunkt auf die gegenüberliegende Seite. Die Winkelhalbierende teilt einen Innenwinkel in zwei gleich große Winkel. Die Schwerlinie (Median) verbindet einen Eckpunkt mit dem Mittelpunkt der gegenüberliegenden Seite.\n\nWichtige Zusammenhänge: Mit der Höhe gilt für die Fläche \\(A=\\frac{1}{2}gh\\) und damit \\(h=2A/g\\). Die drei Schwerlinien schneiden sich im Schwerpunkt; dieser teilt jede Schwerlinie im Verhältnis 2:1 (vom Eckpunkt aus). Bei der Winkelhalbierenden gilt der Seitenverhältnissatz: sie teilt die Gegenseite im Verhältnis der anliegenden Seiten.\n\nVorgehen in Aufgaben: 1) Gegebenes Dreieck skizzieren, 2) entscheiden welche Speziallinie gebraucht wird, 3) passende Beziehung aufstellen, 4) Ergebnis geometrisch interpretieren. Typische Fehler: Höhe mit Seitenlänge verwechseln, Mittelpunkt falsch setzen, Winkelhalbierende mit Höhe verwechseln.",
      equation: (v) => `A=\\frac{1}{2}\\cdot${v.b}\\cdot${v.h}`,
      controls: [
        { key: "b", label: "Basis", value: 8 },
        { key: "h", label: "Höhe", value: 5 }
      ]
    },
    {
      id: "area_composite",
      title: "Umfang/Fläche zusammengesetzter Figuren",
      source: "Fundamentum.pdf, S. 19",
      theory: "Beispiel: \\(A=A_{Rechteck}+A_{Halbkreis}\\), \\(U\\) analog über Randteile.",
      equation: (v) => `A=${v.w}\\cdot${v.h}+\\frac{1}{2}\\pi\\cdot${v.r}^2`,
      controls: [
        { key: "w", label: "Breite", value: 8 },
        { key: "h", label: "Höhe", value: 4 },
        { key: "r", label: "Radius", value: 2 }
      ]
    },
    {
      id: "similarity",
      title: "Ähnlichkeit zur Längen-/Flächenberechnung",
      source: "Fundamentum.pdf, S. 19",
      theory: "Ähnlichkeit: \\(L'=kL,\\;A'=k^2A\\)",
      equation: (v) => `L'= ${v.k}L,\\;A'=${v.k}^2A`,
      controls: [
        { key: "k", label: "k", value: 1.5 },
        { key: "a", label: "a", value: 6 }
      ],
      noCanvas: true
    },
    {
      id: "solids",
      title: "Quader/Prisma/Pyramide/Kegel/Kugel/Zylinder",
      source: "Fundamentum.pdf, S. 28-31",
      theory: "Standardformeln: \\(V_{Quader}=abh,\\;V_{Zylinder}=\\pi r^2h,\\;V_{Kugel}=\\frac{4}{3}\\pi r^3\\)",
      equation: (v) => `V_Q=${v.a}\\cdot${v.b}\\cdot${v.h}`,
      controls: [
        { key: "a", label: "a", value: 4 },
        { key: "b", label: "b", value: 3 },
        { key: "h", label: "h", value: 5 },
        { key: "r", label: "r", value: 2 }
      ]
    },
    {
      id: "cut_compose",
      title: "Körper verändern, Ecken/Kanten, Seitenflächen",
      source: "Fundamentum.pdf, S. 30",
      theory: "Modell: Restvolumen als Differenz aus Grundkörper und abgeschnittenem Teilkörper.",
      equation: (v) => `V_{rest}\\approx ${v.a}^3-\\frac{${v.cut}^3}{6}`,
      controls: [
        { key: "a", label: "a", value: 6 },
        { key: "cut", label: "Schnitt", value: 2 }
      ]
    }
  ],
  trigonometrie: [
    {
      id: "any_triangle",
      title: "Beliebige Dreiecke trigonometrisch lösen",
      source: "Fundamentum.pdf, S. 26",
      theory: "Kosinussatz: \\(c^2=a^2+b^2-2ab\\cos(\\gamma)\\), Sinussatz ergänzend.",
      equation: (v) => `c^2=${v.a}^2+${v.b}^2-2\\cdot${v.a}\\cdot${v.b}\\cos(${v.gamma}^\\circ)`,
      controls: [
        { key: "a", label: "a", value: 7 },
        { key: "b", label: "b", value: 5 },
        { key: "gamma", label: "gamma°", value: 50 }
      ]
    },
    {
      id: "space_angle",
      title: "Winkel Gerade-Gerade / Gerade-Ebene",
      source: "Fundamentum.pdf, S. 31",
      theory: "Im Würfel und im allgemeinen Vektorfall: \\(|\\cos(\\varphi)|=\\frac{|u\\cdot v|}{|u||v|}\\), und für Gerade-Ebene \\(|\\sin(\\beta)|=\\frac{|d\\cdot n|}{|d||n|}\\).",
      equation: () => "\\cos(\\varphi)=\\frac{|u\\cdot v|}{|u||v|},\\;\\sin(\\beta)=\\frac{|d\\cdot n|}{|d||n|}",
      controls: [
        { key: "edge", label: "Kante", value: 4 },
        { key: "ux", label: "u_x", value: 1 },
        { key: "uy", label: "u_y", value: 2 },
        { key: "uz", label: "u_z", value: 2 },
        { key: "vx", label: "v_x", value: 2 },
        { key: "vy", label: "v_y", value: 1 },
        { key: "vz", label: "v_z", value: 2 },
        { key: "nx", label: "n_x", value: 0 },
        { key: "ny", label: "n_y", value: 0 },
        { key: "nz", label: "n_z", value: 1 }
      ]
    }
  ]
};

const PLANE_MEASUREMENT_VARIANTS = [
  {
    id: "rectangle",
    label: "Rechteck",
    source: "Grundlagen der Geometrie, Rechteck/Quadrat",
    theoryFormula: "\\(U=2(a+b),\\;A=a\\cdot b\\)",
    controls: [
      { key: "a", label: "a", value: 8 },
      { key: "b", label: "b", value: 5 }
    ],
    equation: (v, modeId) => {
      const a = Math.max(0, Math.abs(v.a));
      const b = Math.max(0, Math.abs(v.b));
      return modeId === "perimeter" ? `U=2(${a}+${b})` : `A=${a}\\cdot ${b}`;
    },
    operatorGuide: "Wähle Seitenlängen, lies die Skizze ab und entscheide bewusst zwischen Umfang und Fläche.",
    didactic: {
      definition: "Beim Rechteck berechnet sich der Umfang aus allen Randseiten, die Fläche aus Länge mal Breite.",
      steps: [
        "Seitenlängen sauber aus der Skizze oder dem Text entnehmen.",
        "Für den Umfang alle vier Seiten berücksichtigen.",
        "Für die Fläche Länge und Breite multiplizieren."
      ],
      mistakes: ["Umfang und Fläche verwechseln", "Nur zwei Seiten statt aller vier Randseiten zählen"],
      edge: ["Beim Quadrat gilt zusätzlich a=b", "Einheiten bei Umfang und Fläche unterschiedlich notieren"],
      worked: "Beispiel: Rechteck mit \\(a=8\\), \\(b=5\\) hat \\(U=26\\) und \\(A=40\\)."
    },
    examples: [
      { title: "Zimmergrundriss", text: "Ein Zimmer ist 8 m lang und 5 m breit. Bestimme Fußleistenlänge und Bodenfläche.", params: { a: 8, b: 5 } },
      { title: "Plakatwand", text: "Eine Plakatwand hat 3.2 m Breite und 2.4 m Höhe. Wie groß ist die Fläche?", params: { a: 3.2, b: 2.4 } },
      { title: "Gartenzaun", text: "Ein rechteckiger Garten benötigt rundum Zaun. Welche Länge wird gebraucht?", params: { a: 12, b: 7 } }
    ]
  },
  {
    id: "triangle",
    label: "Dreieck",
    source: "Grundlagen der Geometrie, Dreiecksfläche",
    theoryFormula: "\\(A=\\tfrac{1}{2}g h,\\;U=a+b+c\\)",
    controls: [
      { key: "g", label: "g", value: 10 },
      { key: "h", label: "h", value: 6 },
      { key: "a", label: "a", value: 10 },
      { key: "b", label: "b", value: 7 },
      { key: "c", label: "c", value: 8 }
    ],
    equation: (v, modeId) => {
      const a = Math.max(0, Math.abs(v.a));
      const b = Math.max(0, Math.abs(v.b));
      const c = Math.max(0, Math.abs(v.c));
      const g = Math.max(0, Math.abs(v.g));
      const h = Math.max(0, Math.abs(v.h));
      return modeId === "perimeter" ? `U=${a}+${b}+${c}` : `A=\\tfrac{1}{2}\\cdot ${g}\\cdot ${h}`;
    },
    operatorGuide: "Achte darauf, dass die Höhe senkrecht auf der Grundseite steht. Der Umfang verwendet dagegen die drei Seitenlängen.",
    didactic: {
      definition: "Beim Dreieck nutzt die Fläche eine Grundseite mit passender Höhe. Der Umfang ist die Summe aller drei Seiten.",
      steps: [
        "Grundseite und zugehörige Höhe korrekt zuordnen.",
        "Fläche mit \\(A=\\tfrac{1}{2}gh\\) berechnen.",
        "Umfang durch Addition der drei Seiten bestimmen."
      ],
      mistakes: ["Eine Seitenlänge statt der senkrechten Höhe einsetzen", "Für den Umfang nur zwei Seiten addieren"],
      edge: ["Bei stumpfen Dreiecken liegt die Höhe teilweise außerhalb", "Fläche und Umfang haben unterschiedliche Einheiten"],
      worked: "Beispiel: \\(g=10\\), \\(h=6\\) ergibt \\(A=30\\); bei \\(a=10, b=7, c=8\\) ist \\(U=25\\)."
    },
    examples: [
      { title: "Segeltuch", text: "Ein dreieckiges Segeltuch hat Grundseite 4 m und Höhe 3 m. Wie groß ist seine Fläche?", params: { g: 4, h: 3, a: 4, b: 3.6, c: 3.2 } },
      { title: "Dachgiebel", text: "Berechne die Fläche eines dreieckigen Giebels und addiere anschließend den Rand als Umfang.", params: { g: 9, h: 4, a: 9, b: 6, c: 6 } },
      { title: "Warnschild", text: "Ein dreieckiges Schild soll eingerahmt werden. Welche Rahmenlänge wird benötigt?", params: { g: 6, h: 5, a: 6, b: 6.4, c: 5.8 } }
    ]
  },
  {
    id: "circle",
    label: "Kreis",
    source: "Grundlagen der Geometrie, Kreisformeln",
    theoryFormula: "\\(U=2\\pi r,\\;A=\\pi r^2\\)",
    controls: [
      { key: "r", label: "r", value: 4 }
    ],
    equation: (v, modeId) => {
      const r = Math.max(0, Math.abs(v.r));
      return modeId === "perimeter" ? `U=2\\pi\\cdot ${r}` : `A=\\pi\\cdot ${r}^2`;
    },
    operatorGuide: "Arbeite mit dem Radius als zentrale Größe. Wenn der Durchmesser gegeben ist, halbiere ihn zuerst.",
    didactic: {
      definition: "Beim Kreis werden Umfang und Fläche beide über den Radius beschrieben.",
      steps: [
        "Radius oder Durchmesser korrekt erkennen.",
        "Umfang mit \\(U=2\\pi r\\) berechnen.",
        "Fläche mit \\(A=\\pi r^2\\) berechnen."
      ],
      mistakes: ["Durchmesser als Radius einsetzen", "Bei der Fläche das Quadrat auf \\(r\\) vergessen"],
      edge: ["Bei gegebenem Durchmesser gilt \\(r=\\tfrac{d}{2}\\)", "Ergebnisse sinnvoll runden und Einheiten notieren"],
      worked: "Beispiel: \\(r=4\\) ergibt \\(U=8\\pi\\) und \\(A=16\\pi\\)."
    },
    examples: [
      { title: "Pizzakarton", text: "Wie viel Rand und wie viel Fläche hat eine Pizza mit Radius 15 cm?", params: { r: 15 } },
      { title: "Springbrunnen", text: "Ein runder Springbrunnen hat Durchmesser 6 m. Bestimme zuerst den Radius und dann die Fläche.", params: { r: 3 } },
      { title: "Laufbahn", text: "Berechne den Umfang einer runden Trainingsbahn mit Radius 20 m.", params: { r: 20 } }
    ]
  },
  {
    id: "composite",
    label: "Zusammengesetzte Figur",
    source: "Grundlagen der Geometrie, zusammengesetzte Flächen",
    theoryFormula: "\\(A=A_1+A_2\\) oder \\(A=A_1-A_2\\)",
    controls: [
      { key: "w", label: "w", value: 8 },
      { key: "h", label: "h", value: 5 },
      { key: "r", label: "r", value: 2 }
    ],
    equation: (v, modeId) => {
      const w = Math.max(0, Math.abs(v.w));
      const h = Math.max(0, Math.abs(v.h));
      const r = Math.min(Math.max(0, Math.abs(v.r)), h / 2);
      return modeId === "perimeter"
        ? `U=2\\cdot ${w}+2\\cdot ${h}-2\\cdot ${r}+\\pi\\cdot ${r}`
        : `A=${w}\\cdot ${h}+\\tfrac{1}{2}\\pi\\cdot ${r}^2`;
    },
    operatorGuide: "Zerlege die Figur zuerst in bekannte Teilfiguren. Für den Umfang zählst du nur den tatsächlichen Außenrand.",
    didactic: {
      definition: "Zusammengesetzte Figuren werden in bekannte Teilflächen zerlegt und danach addiert oder subtrahiert.",
      steps: [
        "Teilfiguren sauber markieren.",
        "Teilflächen einzeln berechnen.",
        "Für den Umfang nur Außenränder zusammenzählen."
      ],
      mistakes: ["Innenkanten zum Umfang addieren", "Teilflächen doppelt zählen"],
      edge: ["Ausschnitte müssen subtrahiert werden", "Halbkreise und Viertelkreise korrekt erkennen"],
      worked: "Beispiel: Rechteck plus Halbkreis: \\(A=w h + \\tfrac{1}{2}\\pi r^2\\)."
    },
    examples: [
      { title: "Fenster mit Rundbogen", text: "Ein Fenster besteht aus Rechteck und Halbkreis. Berechne Fläche und Außenrand.", params: { w: 8, h: 5, r: 2 } },
      { title: "Innenausschnitt", text: "Aus einer Platte wird ein Viertelkreis ausgeschnitten. Wie groß ist die Restfläche?", params: { w: 10, h: 7, r: 3 } },
      { title: "Sportfeld", text: "Ein Feld kombiniert Rechteck und zwei Halbkreise. Zerlege zuerst in Standardfiguren.", params: { w: 12, h: 6, r: 3 } }
    ]
  },
  {
    id: "rect_triangle",
    label: "Dreieck im Rechteck",
    source: "Geometrische Mischfiguren in Rechtecken",
    theoryFormula: "\\(A_{Rest}=A_{Rechteck}-A_{Dreieck}\\)",
    controls: [
      { key: "w", label: "w", value: 10 },
      { key: "h", label: "h", value: 6 },
      { key: "tb", label: "b_D", value: 10 },
      { key: "th", label: "h_D", value: 6 }
    ],
    equation: (v, modeId) => {
      const w = Math.max(0, Math.abs(v.w));
      const h = Math.max(0, Math.abs(v.h));
      const tb = Math.max(0, Math.min(Math.abs(v.tb), w));
      const th = Math.max(0, Math.min(Math.abs(v.th), h));
      return modeId === "perimeter"
        ? `U=2(${w}+${h})`
        : `A_{Rest}=${w}\\cdot ${h}-\\tfrac{1}{2}\\cdot ${tb}\\cdot ${th}`;
    },
    operatorGuide: "Lies zuerst das äußere Rechteck, dann das innere Dreieck. Entscheide danach, ob du die Dreiecksfläche direkt oder die Restfläche im Rechteck brauchst.",
    didactic: {
      definition: "Bei Dreiecken in Rechtecken berechnet man meist erst die große Rechtecksfläche und dann die Dreiecksfläche als Teil- oder Restfigur.",
      steps: [
        "Rechteck und Dreieck in der Skizze klar trennen.",
        "Rechtecksfläche und Dreiecksfläche einzeln berechnen.",
        "Je nach Frage addieren, subtrahieren oder vergleichen."
      ],
      mistakes: ["Dreieck und Rechteck vermischen", "Restfläche ohne klare Zwischenwerte berechnen"],
      edge: ["Nicht jedes innere Dreieck nutzt die ganze Rechteckshöhe", "Für den Rand können Dreiecks- und Rechteckseiten unterschiedlich relevant sein"],
      worked: "Beispiel: Rechteck \\(10\\times 6\\), inneres Dreieck mit \\(b=10\\), \\(h=6\\): \\(A_D=30\\), \\(A_{Rest}=30\\)."
    },
    examples: [
      { title: "Schräges Fensterfeld", text: "Ein dreieckiges Glasstück sitzt in einem rechteckigen Rahmen. Berechne zuerst Rechteck, dann Glasfläche.", params: { w: 10, h: 6, tb: 10, th: 6 } },
      { title: "Warnmarkierung", text: "Eine rechteckige Tafel enthält ein diagonales Dreieck. Welche Restfläche bleibt außen?", params: { w: 12, h: 8, tb: 12, th: 8 } },
      { title: "Kartonzuschnitt", text: "Aus einem rechteckigen Karton wird ein Dreieck herausgeschnitten. Bestimme die verbleibende Fläche.", params: { w: 14, h: 9, tb: 9, th: 5 } }
    ]
  },
  {
    id: "similarity",
    label: "Ähnlichkeit",
    source: "Ähnlichkeit und Skalierung",
    theoryFormula: "\\(L'=kL,\\;A'=k^2A\\)",
    controls: [
      { key: "k", label: "k", value: 1.5 },
      { key: "L", label: "L", value: 8 },
      { key: "A", label: "A", value: 20 }
    ],
    equation: (v, modeId) => {
      const L = Math.max(0, Math.abs(v.L));
      const A = Math.max(0, Math.abs(v.A));
      return modeId === "length" ? `L'=${v.k}\\cdot ${L}` : `A'=${v.k}^2\\cdot ${A}`;
    },
    operatorGuide: "Trenne immer zuerst Längenfaktor und Flächenfaktor. Bei Flächen wird mit \\(k^2\\) skaliert.",
    didactic: {
      definition: "Ähnliche Figuren haben gleiche Winkel und proportionale Seiten. Längen skalieren mit \\(k\\), Flächen mit \\(k^2\\).",
      steps: [
        "Prüfen, welche Seiten oder Flächen zueinander gehören.",
        "Längen mit \\(L'=kL\\) umrechnen.",
        "Flächen mit \\(A'=k^2A\\) berechnen."
      ],
      mistakes: ["Bei Flächen nur mit \\(k\\) statt \\(k^2\\) rechnen", "Nicht entsprechende Seiten vergleichen"],
      edge: ["Bei \\(k<1\\) wird verkleinert", "Skalierungsfaktor immer positiv als Längenfaktor interpretieren"],
      worked: "Beispiel: \\(k=1{,}5\\), \\(L=8\\), \\(A=20\\) ergibt \\(L'=12\\) und \\(A'=45\\)."
    },
    examples: [
      { title: "Bauplan", text: "Ein Plan wird mit Faktor 2.5 vergrößert. Welche neue Streckenlänge entsteht?", params: { k: 2.5, L: 4, A: 12 } },
      { title: "Landkarte", text: "Eine Kartenfläche wird skaliert. Bestimme den neuen Flächeninhalt mit \\(k^2\\).", params: { k: 1.8, L: 6, A: 12 } },
      { title: "Modellbau", text: "Ein Modell wird verkleinert. Vergleiche Längen- und Flächenänderung getrennt.", params: { k: 0.5, L: 10, A: 30 } }
    ]
  }
];

const SOLID_MEASUREMENT_VARIANTS = [
  {
    id: "box",
    label: "Quader",
    source: "Stereometrie zu eckigen Körpern",
    modes: [
      {
        id: "volume",
        label: "Volumen",
        theoryFormula: "\\(V=a\\cdot b\\cdot h\\)",
        controls: [{ key: "a", label: "a", value: 6 }, { key: "b", label: "b", value: 4 }, { key: "h", label: "h", value: 5 }],
        equation: (v) => `V=${v.a}\\cdot ${v.b}\\cdot ${v.h}`,
        operatorGuide: "Lies Grundfläche und Höhe getrennt ab und rechne dann das Volumen des Quaders.",
        didactic: { definition: "Das Volumen eines Quaders ist Grundfläche mal Höhe.", steps: ["Länge, Breite und Höhe identifizieren.", "Grundfläche \\(a\\cdot b\\) bestimmen.", "Mit der Höhe multiplizieren."], mistakes: ["Zwei Maße statt drei multiplizieren", "Kanten falsch zuordnen"], edge: ["Alle Maße müssen in derselben Einheit vorliegen", "Volumen immer in Kubikeinheiten angeben"], worked: "Beispiel: \\(a=6, b=4, h=5\\Rightarrow V=120\\)." },
        examples: [{ title: "Versandbox", text: "Eine Versandbox mit 6 cm, 4 cm und 5 cm soll befüllt werden. Wie groß ist das Volumen?", params: { a: 6, b: 4, h: 5 } }]
      },
      {
        id: "mantle",
        label: "Mantelfläche",
        theoryFormula: "\\(M=2h(a+b)\\)",
        controls: [{ key: "a", label: "a", value: 6 }, { key: "b", label: "b", value: 4 }, { key: "h", label: "h", value: 5 }],
        equation: (v) => `M=2\\cdot ${v.h}\\cdot (${v.a}+${v.b})`,
        operatorGuide: "Zähle nur die Seitenflächen ohne Deck- und Grundfläche.",
        didactic: { definition: "Die Mantelfläche eines Quaders besteht aus den vier Seitenflächen ohne Deckel und Boden.", steps: ["Umfang der Grundfläche bestimmen.", "Mit der Höhe multiplizieren.", "Deck- und Grundfläche bewusst weglassen."], mistakes: ["Gesamtoberfläche statt Mantel rechnen", "Nur zwei Seitenflächen zählen"], edge: ["Bei Würfeln ist der Mantel dennoch nicht gleich der Gesamtoberfläche", "Einheiten bleiben Flächeneinheiten"], worked: "Beispiel: \\(a=6, b=4, h=5\\Rightarrow M=100\\)." },
        examples: [{ title: "Geschenkbanderole", text: "Eine Kartonbanderole umschließt nur die Seitenflächen. Welche Mantelfläche wird beklebt?", params: { a: 6, b: 4, h: 5 } }]
      },
      {
        id: "surface",
        label: "Gesamtoberfläche",
        theoryFormula: "\\(O=2(ab+ah+bh)\\)",
        controls: [{ key: "a", label: "a", value: 6 }, { key: "b", label: "b", value: 4 }, { key: "h", label: "h", value: 5 }],
        equation: (v) => `O=2(${v.a}\\cdot ${v.b}+${v.a}\\cdot ${v.h}+${v.b}\\cdot ${v.h})`,
        operatorGuide: "Addiere alle sechs Rechtecksflächen des Quaders oder nutze die Sammelformel.",
        didactic: { definition: "Zur Gesamtoberfläche gehören Mantel, Deckfläche und Grundfläche.", steps: ["Drei verschiedene Rechtecksflächen berechnen.", "Jede davon zweimal nehmen.", "Summieren und Einheit prüfen."], mistakes: ["Nur Mantelfläche berechnen", "Eine Rechtecksart vergessen"], edge: ["Bei Würfeln vereinfacht sich die Formel zu \\(6a^2\\)", "Einheiten nicht mit Volumen verwechseln"], worked: "Beispiel: \\(a=6, b=4, h=5\\Rightarrow O=148\\)." },
        examples: [{ title: "Geschenkpapier", text: "Wie viel Papier braucht man, um einen Quader vollständig einzupacken?", params: { a: 6, b: 4, h: 5 } }]
      }
    ]
  },
  {
    id: "cylinder",
    label: "Zylinder",
    source: "Stereometrie zu runden Körpern",
    modes: [
      {
        id: "volume",
        label: "Volumen",
        theoryFormula: "\\(V=\\pi r^2 h\\)",
        controls: [{ key: "r", label: "r", value: 3 }, { key: "h", label: "h", value: 7 }],
        equation: (v) => `V=\\pi\\cdot ${v.r}^2\\cdot ${v.h}`,
        operatorGuide: "Berechne zuerst die Kreisgrundfläche und multipliziere sie dann mit der Höhe.",
        didactic: { definition: "Das Zylindervolumen ist Grundfläche mal Höhe.", steps: ["Radius erkennen.", "Kreisgrundfläche \\(\\pi r^2\\) bestimmen.", "Mit der Höhe multiplizieren."], mistakes: ["Durchmesser statt Radius einsetzen", "Mantelfläche mit Volumen verwechseln"], edge: ["Bei gegebenem Durchmesser zuerst halbieren", "Volumen in Kubikeinheiten angeben"], worked: "Beispiel: \\(r=3, h=7\\Rightarrow V=63\\pi\\)." },
        examples: [{ title: "Getränkedose", text: "Berechne das Fassungsvermögen einer Dose mit Radius 3 cm und Höhe 7 cm.", params: { r: 3, h: 7 } }]
      },
      {
        id: "mantle",
        label: "Mantelfläche",
        theoryFormula: "\\(M=2\\pi r h\\)",
        controls: [{ key: "r", label: "r", value: 3 }, { key: "h", label: "h", value: 7 }],
        equation: (v) => `M=2\\pi\\cdot ${v.r}\\cdot ${v.h}`,
        operatorGuide: "Stell dir den Mantel als abgewickeltes Rechteck mit Umfang der Grundfläche mal Höhe vor.",
        didactic: { definition: "Die Mantelfläche des Zylinders ist Umfang der Grundfläche mal Höhe.", steps: ["Kreisumfang berechnen.", "Mit der Höhe multiplizieren.", "Nur Mantel, nicht die Deckflächen, zählen."], mistakes: ["Deck- und Grundfläche mitrechnen", "Beim Umfang das \\(2\\pi r\\) vergessen"], edge: ["Etiketten-Aufgaben fragen fast immer nach der Mantelfläche", "Bei schräger Skizze bleibt die Formel gleich"], worked: "Beispiel: \\(r=3, h=7\\Rightarrow M=42\\pi\\)." },
        examples: [{ title: "Etikett", text: "Eine Dose bekommt nur ein Etikett um den Mantel. Welche Fläche wird beklebt?", params: { r: 3, h: 7 } }]
      },
      {
        id: "surface",
        label: "Gesamtoberfläche",
        theoryFormula: "\\(O=2\\pi r^2+2\\pi r h\\)",
        controls: [{ key: "r", label: "r", value: 3 }, { key: "h", label: "h", value: 7 }],
        equation: (v) => `O=2\\pi\\cdot ${v.r}^2+2\\pi\\cdot ${v.r}\\cdot ${v.h}`,
        operatorGuide: "Gesamtoberfläche = zwei Kreisflächen plus Mantelfläche.",
        didactic: { definition: "Zur Zylinderoberfläche gehören Mantel, Deckfläche und Grundfläche.", steps: ["Mantelfläche berechnen.", "Zwei Kreisflächen ergänzen.", "Alles sauber addieren."], mistakes: ["Nur einen Kreis hinzufügen", "Mantel und Oberfläche gleichsetzen"], edge: ["Bei offenen Behältern fehlt eine Kreisfläche", "Runde Ergebnisse sinnvoll notieren"], worked: "Beispiel: \\(r=3, h=7\\Rightarrow O=60\\pi\\)." },
        examples: [{ title: "Konservendose", text: "Wie groß ist die gesamte Blechfläche einer geschlossenen Dose?", params: { r: 3, h: 7 } }]
      }
    ]
  },
  {
    id: "cone",
    label: "Kegel",
    source: "Stereometrie zu runden Körpern",
    modes: [
      {
        id: "volume",
        label: "Volumen",
        theoryFormula: "\\(V=\\tfrac{1}{3}\\pi r^2 h\\)",
        controls: [{ key: "r", label: "r", value: 3 }, { key: "h", label: "h", value: 8 }, { key: "s", label: "s", value: 8.5 }],
        equation: (v) => `V=\\tfrac{1}{3}\\pi\\cdot ${v.r}^2\\cdot ${v.h}`,
        operatorGuide: "Beim Kegel ist das Volumen ein Drittel des Zylindervolumens mit gleicher Grundfläche und Höhe.",
        didactic: { definition: "Das Kegelvolumen ist ein Drittel von Grundfläche mal Höhe.", steps: ["Radius und Höhe identifizieren.", "Grundfläche \\(\\pi r^2\\) berechnen.", "Mit \\(\\tfrac{1}{3}h\\) multiplizieren."], mistakes: ["Das Drittel vergessen", "Schiefe Höhe \\(s\\) statt senkrechter Höhe \\(h\\) verwenden"], edge: ["Für das Volumen braucht man die senkrechte Höhe", "Bei gegebener Mantellinie nicht automatisch mit ihr rechnen"], worked: "Beispiel: \\(r=3, h=8\\Rightarrow V=24\\pi\\)." },
        examples: [{ title: "Eiswaffel", text: "Berechne das Volumen einer Eiswaffel in Kegelform.", params: { r: 3, h: 8, s: 8.5 } }]
      },
      {
        id: "mantle",
        label: "Mantelfläche",
        theoryFormula: "\\(M=\\pi r s\\)",
        controls: [{ key: "r", label: "r", value: 3 }, { key: "h", label: "h", value: 8 }, { key: "s", label: "s", value: 8.5 }],
        equation: (v) => `M=\\pi\\cdot ${v.r}\\cdot ${v.s}`,
        operatorGuide: "Für den Mantel eines Kegels brauchst du den Radius und die Mantellinie \\(s\\).",
        didactic: { definition: "Die Mantelfläche des Kegels nutzt den Radius und die Mantellinie.", steps: ["Radius und Mantellinie erkennen.", "Formel \\(M=\\pi r s\\) einsetzen.", "Nicht mit der senkrechten Höhe verwechseln."], mistakes: ["Höhe statt Mantellinie einsetzen", "Grundfläche mitrechnen"], edge: ["Ist nur \\(h\\) gegeben, muss \\(s\\) ggf. über den Satz des Pythagoras berechnet werden", "Mantel ist keine Kreisfläche"], worked: "Beispiel: \\(r=3, s=8.5\\Rightarrow M=25.5\\pi\\)." },
        examples: [{ title: "Partyhut", text: "Wie viel Material steckt in der Mantelfläche eines Partyhuts?", params: { r: 3, h: 8, s: 8.5 } }]
      },
      {
        id: "surface",
        label: "Gesamtoberfläche",
        theoryFormula: "\\(O=\\pi r^2+\\pi r s\\)",
        controls: [{ key: "r", label: "r", value: 3 }, { key: "h", label: "h", value: 8 }, { key: "s", label: "s", value: 8.5 }],
        equation: (v) => `O=\\pi\\cdot ${v.r}^2+\\pi\\cdot ${v.r}\\cdot ${v.s}`,
        operatorGuide: "Gesamtoberfläche = Grundfläche + Mantelfläche.",
        didactic: { definition: "Beim Kegel setzt sich die Gesamtoberfläche aus Kreisgrundfläche und Mantel zusammen.", steps: ["Grundfläche berechnen.", "Mantelfläche ergänzen.", "Beide Flächen addieren."], mistakes: ["Grundfläche vergessen", "Mantellinie falsch einsetzen"], edge: ["Offene Kegel haben keine Grundfläche", "Bei Netzen den Kreis und den Kreisausschnitt unterscheiden"], worked: "Beispiel: \\(r=3, s=8.5\\Rightarrow O=34.5\\pi\\)." },
        examples: [{ title: "Kegellampe", text: "Bestimme die gesamte Außenfläche eines geschlossenen Kegels.", params: { r: 3, h: 8, s: 8.5 } }]
      }
    ]
  },
  {
    id: "sphere",
    label: "Kugel",
    source: "Stereometrie zu runden Körpern",
    modes: [
      {
        id: "volume",
        label: "Volumen",
        theoryFormula: "\\(V=\\tfrac{4}{3}\\pi r^3\\)",
        controls: [{ key: "r", label: "r", value: 4 }],
        equation: (v) => `V=\\tfrac{4}{3}\\pi\\cdot ${v.r}^3`,
        operatorGuide: "Achte auf die dritte Potenz des Radius. Das ist der typische Stolperstein bei Kugeln.",
        didactic: { definition: "Das Kugelvolumen hängt mit der dritten Potenz des Radius zusammen.", steps: ["Radius erkennen.", "Radius kubieren.", "Mit \\(\\tfrac{4}{3}\\pi\\) multiplizieren."], mistakes: ["Nur \\(r^2\\) statt \\(r^3\\) verwenden", "Durchmesser nicht halbieren"], edge: ["Bei gegebenem Durchmesser zuerst den Radius bestimmen", "Volumen immer kubisch notieren"], worked: "Beispiel: \\(r=4\\Rightarrow V=\\tfrac{256}{3}\\pi\\)." },
        examples: [{ title: "Ballvolumen", text: "Wie groß ist das Volumen eines Balls mit Radius 4 cm?", params: { r: 4 } }]
      },
      {
        id: "surface",
        label: "Gesamtoberfläche",
        theoryFormula: "\\(O=4\\pi r^2\\)",
        controls: [{ key: "r", label: "r", value: 4 }],
        equation: (v) => `O=4\\pi\\cdot ${v.r}^2`,
        operatorGuide: "Auch hier ist der Radius die zentrale Größe. Mantelfläche gibt es bei der Kugel nicht als getrennten Schulbegriff.",
        didactic: { definition: "Die Kugeloberfläche wird direkt mit \\(4\\pi r^2\\) berechnet.", steps: ["Radius bestimmen.", "Radius quadrieren.", "Mit \\(4\\pi\\) multiplizieren."], mistakes: ["Volumenformel mit Oberfläche verwechseln", "Durchmesser statt Radius einsetzen"], edge: ["Für die Kugel gibt es im Schulkontext keine getrennte Mantelfläche", "Oberfläche bleibt eine Flächeneinheit"], worked: "Beispiel: \\(r=4\\Rightarrow O=64\\pi\\)." },
        examples: [{ title: "Ballhülle", text: "Wie groß ist die Oberfläche eines Balls mit Radius 4 cm?", params: { r: 4 } }]
      }
    ]
  },
  {
    id: "prism",
    label: "Prisma",
    source: "Stereometrie zu eckigen Körpern",
    modes: [
      {
        id: "volume",
        label: "Volumen",
        theoryFormula: "\\(V=G\\cdot h\\)",
        controls: [{ key: "G", label: "G", value: 18 }, { key: "u", label: "u_G", value: 18 }, { key: "h", label: "h", value: 7 }],
        equation: (v) => `V=${v.G}\\cdot ${v.h}`,
        operatorGuide: "Arbeite beim Prisma mit Grundfläche \\(G\\) und Höhe \\(h\\).",
        didactic: { definition: "Beim Prisma ist das Volumen Grundfläche mal Höhe.", steps: ["Grundfläche \\(G\\) bestimmen oder ablesen.", "Prismenhöhe erkennen.", "Beides multiplizieren."], mistakes: ["Umfang der Grundfläche statt Grundfläche einsetzen", "Schräge Kante mit Höhe verwechseln"], edge: ["Die Grundfläche kann jede Polygonform haben", "Volumen bleibt unabhängig von der Lage des Prismas"], worked: "Beispiel: \\(G=18, h=7\\Rightarrow V=126\\)." },
        examples: [{ title: "Glasprisma", text: "Ein Prisma mit Grundfläche 18 cm² und Höhe 7 cm soll gefüllt werden. Wie groß ist das Volumen?", params: { G: 18, u: 18, h: 7 } }]
      },
      {
        id: "mantle",
        label: "Mantelfläche",
        theoryFormula: "\\(M=u_G\\cdot h\\)",
        controls: [{ key: "G", label: "G", value: 18 }, { key: "u", label: "u_G", value: 18 }, { key: "h", label: "h", value: 7 }],
        equation: (v) => `M=${v.u}\\cdot ${v.h}`,
        operatorGuide: "Die Mantelfläche eines Prismas ist Grundflächenumfang mal Höhe.",
        didactic: { definition: "Der Prismenmantel entsteht aus dem Umfang der Grundfläche und der Höhe.", steps: ["Umfang der Grundfläche bestimmen.", "Mit der Höhe multiplizieren.", "Grund- und Deckfläche bewusst nicht mitzählen."], mistakes: ["Grundfläche statt Umfang einsetzen", "Gesamtoberfläche statt Mantel berechnen"], edge: ["Bei schiefen Skizzen bleibt die Formel gleich", "Einheiten als Flächeneinheiten angeben"], worked: "Beispiel: \\(u_G=18, h=7\\Rightarrow M=126\\)." },
        examples: [{ title: "Banderole fürs Prisma", text: "Eine Banderole umschließt nur den Mantel eines Prismas. Welche Fläche wird bedeckt?", params: { G: 18, u: 18, h: 7 } }]
      },
      {
        id: "surface",
        label: "Gesamtoberfläche",
        theoryFormula: "\\(O=2G+u_G h\\)",
        controls: [{ key: "G", label: "G", value: 18 }, { key: "u", label: "u_G", value: 18 }, { key: "h", label: "h", value: 7 }],
        equation: (v) => `O=2\\cdot ${v.G}+${v.u}\\cdot ${v.h}`,
        operatorGuide: "Ergänze zum Mantel noch zwei Grundflächen.",
        didactic: { definition: "Die Gesamtoberfläche eines Prismas besteht aus Mantel und zwei Grundflächen.", steps: ["Mantel bestimmen.", "Zwei Grundflächen ergänzen.", "Alles addieren."], mistakes: ["Nur eine Grundfläche ergänzen", "Volumenformel verwenden"], edge: ["Je nach Grundfläche kann \\(G\\) vorher separat berechnet werden", "Bei offenen Körpern fehlen Flächen"], worked: "Beispiel: \\(G=18, u_G=18, h=7\\Rightarrow O=162\\)." },
        examples: [{ title: "Verpackung", text: "Berechne die gesamte Oberfläche eines Prismas für eine Verpackung.", params: { G: 18, u: 18, h: 7 } }]
      }
    ]
  },
  {
    id: "pyramid",
    label: "Pyramide",
    source: "Stereometrie zu eckigen Körpern",
    modes: [
      {
        id: "volume",
        label: "Volumen",
        theoryFormula: "\\(V=\\tfrac{1}{3}Gh\\)",
        controls: [{ key: "G", label: "G", value: 25 }, { key: "u", label: "u_G", value: 20 }, { key: "h", label: "h", value: 9 }, { key: "s", label: "s", value: 9.8 }],
        equation: (v) => `V=\\tfrac{1}{3}\\cdot ${v.G}\\cdot ${v.h}`,
        operatorGuide: "Beim Volumen der Pyramide zählt die senkrechte Höhe, nicht die Seitenhöhe.",
        didactic: { definition: "Das Volumen einer Pyramide ist ein Drittel von Grundfläche mal Höhe.", steps: ["Grundfläche bestimmen.", "Senkrechte Höhe erkennen.", "Mit \\(\\tfrac{1}{3}\\) multiplizieren."], mistakes: ["Das Drittel vergessen", "Seitenhöhe statt Körperhöhe verwenden"], edge: ["Netze helfen beim Erkennen der Grundfläche", "Volumen stets in Kubikeinheiten angeben"], worked: "Beispiel: \\(G=25, h=9\\Rightarrow V=75\\)." },
        examples: [{ title: "Pyramidenzelt", text: "Wie groß ist das Innenvolumen eines pyramidenförmigen Zelts?", params: { G: 25, u: 20, h: 9, s: 9.8 } }]
      },
      {
        id: "mantle",
        label: "Mantelfläche",
        theoryFormula: "\\(M=\\tfrac{1}{2}u_G s\\)",
        controls: [{ key: "G", label: "G", value: 25 }, { key: "u", label: "u_G", value: 20 }, { key: "h", label: "h", value: 9 }, { key: "s", label: "s", value: 9.8 }],
        equation: (v) => `M=\\tfrac{1}{2}\\cdot ${v.u}\\cdot ${v.s}`,
        operatorGuide: "Für den Mantel brauchst du Grundflächenumfang und Seitenhöhe der Dreiecksflächen.",
        didactic: { definition: "Die Mantelfläche der Pyramide setzt sich aus den Dreiecksseitenflächen zusammen.", steps: ["Umfang der Grundfläche bestimmen.", "Seitenhöhe \\(s\\) identifizieren.", "Mit \\(\\tfrac{1}{2}u_G s\\) berechnen."], mistakes: ["Körperhöhe statt Seitenhöhe einsetzen", "Grundfläche mitrechnen"], edge: ["Bei unregelmäßigen Pyramiden können Seitenhöhen verschieden sein", "Mantelfläche ist nicht dasselbe wie Oberfläche"], worked: "Beispiel: \\(u_G=20, s=9.8\\Rightarrow M=98\\)." },
        examples: [{ title: "Pyramidendach", text: "Wie groß ist nur die Dachfläche einer Pyramide ohne Grundplatte?", params: { G: 25, u: 20, h: 9, s: 9.8 } }]
      },
      {
        id: "surface",
        label: "Gesamtoberfläche",
        theoryFormula: "\\(O=G+\\tfrac{1}{2}u_G s\\)",
        controls: [{ key: "G", label: "G", value: 25 }, { key: "u", label: "u_G", value: 20 }, { key: "h", label: "h", value: 9 }, { key: "s", label: "s", value: 9.8 }],
        equation: (v) => `O=${v.G}+\\tfrac{1}{2}\\cdot ${v.u}\\cdot ${v.s}`,
        operatorGuide: "Zur Mantelfläche kommt genau eine Grundfläche hinzu.",
        didactic: { definition: "Die Gesamtoberfläche einer Pyramide ist Grundfläche plus Mantelfläche.", steps: ["Mantel berechnen.", "Eine Grundfläche addieren.", "Gesamtergebnis prüfen."], mistakes: ["Volumenformel verwenden", "Mehr als eine Grundfläche addieren"], edge: ["Bei offenen Modellen fehlt die Grundfläche", "Einheiten als Flächeneinheiten angeben"], worked: "Beispiel: \\(G=25, u_G=20, s=9.8\\Rightarrow O=123\\)." },
        examples: [{ title: "Pyramidenmodell", text: "Bestimme die gesamte Außenfläche eines geschlossenen Pyramidenmodells.", params: { G: 25, u: 20, h: 9, s: 9.8 } }]
      }
    ]
  },
  {
    id: "cut_compose",
    label: "Körper verändern",
    source: "Stereometrie zu eckigen Körpern, Ausschnitte und Zusammensetzen",
    modes: [
      {
        id: "restvolume",
        label: "Restvolumen",
        theoryFormula: "\\(V_{rest}=V_{Grundkörper}-V_{Teilkörper}\\)",
        controls: [{ key: "a", label: "a", value: 8 }, { key: "cut", label: "Schnitt", value: 2 }],
        equation: (v) => `V_{rest}=${v.a}^3-\\tfrac{${v.cut}^3}{6}`,
        operatorGuide: "Modelliere erst den Grundkörper, dann den entfernten Teilkörper und bilde die Differenz.",
        didactic: { definition: "Bei veränderten Körpern entsteht das Restvolumen oft als Differenz aus Grundkörper und Ausschnitt.", steps: ["Grundkörper identifizieren.", "Entfernten Teilkörper modellieren.", "Volumina sauber subtrahieren."], mistakes: ["Falschen Teilkörper abziehen", "Nur schätzen statt rechnen"], edge: ["Bei großen Schnitten kann das Modell unplausibel werden", "Einheiten unverändert kubisch behandeln"], worked: "Beispiel: Würfel mit \\(a=8\\) und kleiner abgeschnittener Ecke \\(s=2\\): \\(V_{rest}=8^3-\\tfrac{2^3}{6}\\)." },
        examples: [{ title: "Abgeschnittene Ecke", text: "Ein Würfel verliert an einer Ecke einen kleinen Teil. Bestimme das Restvolumen.", params: { a: 8, cut: 2 } }]
      },
      {
        id: "surface",
        label: "Neue Oberfläche",
        controls: [{ key: "a", label: "a", value: 8 }, { key: "cut", label: "Schnitt", value: 2 }],
        theoryFormula: "Neue Schnittflächen müssen zur Oberfläche hinzugerechnet, verdeckte Flächen angepasst werden.",
        equation: (v) => `O_{neu}=6\\cdot ${v.a}^2-3\\cdot \\tfrac{${v.cut}^2}{2}+\\text{Schnittflächen}`,
        operatorGuide: "Bei Oberflächen zählt nicht nur weniger Volumen, sondern vor allem welche neuen Flächen sichtbar werden.",
        didactic: { definition: "Bei einem Ausschnitt ändert sich die Oberfläche anders als das Volumen, weil neue Schnittflächen sichtbar werden.", steps: ["Wegfallende Außenstücke identifizieren.", "Neue Schnittflächen ergänzen.", "Gesamtoberfläche neu bilanzieren."], mistakes: ["Nur Volumenänderung betrachten", "Neue Dreiecks- oder Rechtecksflächen vergessen"], edge: ["Sichtbarkeit in der Skizze hilft bei der Bilanz", "Nicht jede abgeschnittene Kante erzeugt dieselbe Flächenform"], worked: "Beispiel: Nach einem Eckschnitt am Würfel verschwinden kleine Außenstücke, dafür kommt eine neue Dreiecksfläche hinzu." },
        examples: [{ title: "Schnittfläche sichtbar", text: "Ein Würfel wird angeschnitten. Welche Fläche kommt neu hinzu und welche Teile fallen weg?", params: { a: 8, cut: 2 } }]
      },
      {
        id: "counting",
        label: "Ecken/Kanten/Flächen",
        controls: [{ key: "a", label: "a", value: 8 }, { key: "cut", label: "Schnitt", value: 2 }],
        theoryFormula: "Zähle nach dem Eingriff getrennt Ecken, Kanten und Flächenarten.",
        equation: (v) => `\\text{Zählaufgabe für }a=${v.a}, s=${v.cut}`,
        operatorGuide: "Zähle systematisch: zuerst neue Flächen, dann ihre Kanten, dann die neuen/wegfallenden Ecken.",
        didactic: { definition: "Bei veränderten Körpern lassen sich Ecken, Kanten und Seitenflächen nicht mehr aus Standardformeln ablesen, sondern müssen systematisch gezählt werden.", steps: ["Neue und alte Flächenarten markieren.", "Kanten pro sichtbarer Fläche verfolgen.", "Ecken vor und nach dem Eingriff vergleichen."], mistakes: ["Wegfallende Kanten weiter mitzählen", "Sichtbare und unsichtbare Elemente vermischen"], edge: ["Je nach Schnittlage entstehen neue Dreiecks- oder Vierecksflächen", "Netze oder Skizzen können das Zählen vereinfachen"], worked: "Beispiel: Beim abgeschnittenen Würfel sinkt die Zahl einiger alten Ecken, gleichzeitig entstehen neue Kanten entlang der Schnittfläche." },
        examples: [{ title: "Zählaufgabe am Modell", text: "Untersuche nach dem Schnitt, wie viele Ecken, Kanten und Flächen der Körper nun hat.", params: { a: 8, cut: 2 } }]
      }
    ]
  }
];

const TRIANGLE_TRIG_VARIANTS = [
  {
    id: "right_triangle",
    label: "Rechtwinkliges Dreieck",
    source: "Trigonometrie am rechtwinkligen Dreieck",
    theoryFormula: "\\(\\sin(\\alpha)=\\tfrac{Gegenkathete}{Hypotenuse},\\;\\cos(\\alpha)=\\tfrac{Ankathete}{Hypotenuse},\\;\\tan(\\alpha)=\\tfrac{Gegenkathete}{Ankathete}\\)",
    controls: [
      { key: "adj", label: "Ankathete", value: 6 },
      { key: "alpha", label: "\\alpha^\\circ", value: 35 }
    ],
    equation: (v) => `GK=${v.adj}\\tan(${v.alpha}^\\circ),\\;H=\\tfrac{${v.adj}}{\\cos(${v.alpha}^\\circ)}`,
    operatorGuide: "Wähle zuerst die bekannte Seite und den Bezug zum Winkel: Gegenkathete, Ankathete oder Hypotenuse.",
    didactic: {
      definition: "Im rechtwinkligen Dreieck verknüpfen Sinus, Cosinus und Tangens Winkel mit Seitenverhältnissen.",
      steps: [
        "Skizze beschriften: Winkel, Gegenkathete, Ankathete, Hypotenuse.",
        "Die passende trigonometrische Funktion wählen.",
        "Nach der gesuchten Seite oder dem gesuchten Winkel umformen."
      ],
      mistakes: ["Gegenkathete und Ankathete vertauschen", "Rechner im falschen Winkelmodus benutzen"],
      edge: ["Der rechte Winkel liegt immer gegenüber der Hypotenuse", "Winkelangaben in Grad korrekt am Rechner einstellen"],
      worked: "Beispiel: \\(AK=6\\), \\(\\alpha=35^\\circ\\) ergibt \\(GK=6\\tan(35^\\circ)\\) und \\(H=\\tfrac{6}{\\cos(35^\\circ)}\\)."
    },
    examples: [
      { title: "Leiter an der Wand", text: "Mit einem bekannten Winkel und einer Seitenlänge berechnest du Höhe oder Leiternlänge.", params: { adj: 6, alpha: 35 } },
      { title: "Rampe", text: "Eine Rampe bildet mit dem Boden einen Winkel. Bestimme die Höhe am Ende der Rampe.", params: { adj: 8, alpha: 20 } },
      { title: "Schatten", text: "Ein Schattenwurf erzeugt ein rechtwinkliges Dreieck. Bestimme die fehlende Seite.", params: { adj: 10, alpha: 42 } }
    ]
  },
  {
    id: "any_triangle",
    label: "Allgemeines Dreieck",
    source: "Trigonometrie am allgemeinen Dreieck",
    theoryFormula: "\\(c^2=a^2+b^2-2ab\\cos(\\gamma)\\),\\;\\tfrac{a}{\\sin(\\alpha)}=\\tfrac{b}{\\sin(\\beta)}\\)",
    controls: [
      { key: "a", label: "a", value: 7 },
      { key: "b", label: "b", value: 5 },
      { key: "gamma", label: "\\gamma^\\circ", value: 50 }
    ],
    equation: (v) => `c^2=${v.a}^2+${v.b}^2-2\\cdot ${v.a}\\cdot ${v.b}\\cos(${v.gamma}^\\circ)`,
    operatorGuide: "Nutze den Kosinussatz bei zwei Seiten plus eingeschlossenem Winkel und den Sinussatz für gegenüberliegende Paare.",
    didactic: {
      definition: "Allgemeine Dreiecke werden mit Sinus- und Kosinussatz gelöst, wenn keine Rechtwinkligkeit vorliegt.",
      steps: [
        "Gegebenen Falltyp prüfen.",
        "Kosinussatz oder Sinussatz passend auswählen.",
        "Restliche Seiten und Winkel der Reihe nach berechnen."
      ],
      mistakes: ["Sinussatz mit falschem Seiten-Winkel-Paar verwenden", "Den eingeschlossenen Winkel beim Kosinussatz übersehen"],
      edge: ["Der SSA-Fall kann zwei Lösungen erzeugen", "Am Ende immer die Winkelsumme prüfen"],
      worked: "Beispiel: \\(a=7, b=5, \\gamma=50^\\circ\\) ergibt \\(c\\) über den Kosinussatz." 
    },
    examples: [
      { title: "Dachkonstruktion", text: "Zwei Sparren und der eingeschlossene Winkel sind gegeben. Bestimme die dritte Seite.", params: { a: 7, b: 5, gamma: 50 } },
      { title: "Vermessung", text: "Ein Dreieck wird über zwei Seiten und einen Winkel vermessen. Berechne die unbekannten Größen.", params: { a: 9, b: 6, gamma: 120 } },
      { title: "Geländeplan", text: "Über den Sinussatz werden fehlende Seiten in einem allgemeinen Dreieck bestimmt.", params: { a: 11, b: 8, gamma: 45 } }
    ]
  },
  {
    id: "space_angle",
    label: "Raumwinkel",
    source: "Raumwinkel und Würfel-Spezialfälle",
    theoryFormula: "\\(\\cos(\\varphi)=\\tfrac{|u\\cdot v|}{|u||v|},\\;\\sin(\\beta)=\\tfrac{|d\\cdot n|}{|d||n|}\\)",
    controls: [
      { key: "ux", label: "u_x", value: 1 },
      { key: "uy", label: "u_y", value: 1 },
      { key: "uz", label: "u_z", value: 1 },
      { key: "vx", label: "v_x", value: 2 },
      { key: "vy", label: "v_y", value: 1 },
      { key: "vz", label: "v_z", value: 2 },
      { key: "nx", label: "n_x", value: 0 },
      { key: "ny", label: "n_y", value: 0 },
      { key: "nz", label: "n_z", value: 1 }
    ],
    equation: () => `\\cos(\\varphi)=\\tfrac{|u\\cdot v|}{|u||v|},\\;\\sin(\\beta)=\\tfrac{|d\\cdot n|}{|d||n|}`,
    operatorGuide: "Unterscheide sauber zwischen Gerade-Gerade und Gerade-Ebene. Bei Gerade-Ebene rechnest du zuerst mit dem Normalenvektor.",
    didactic: {
      definition: "Raumwinkel werden im Vektoransatz über Skalarprodukt und Normalenvektor bestimmt.",
      steps: [
        "Richtungsvektoren oder Normalenvektor festlegen.",
        "Gerade-Gerade: Winkel per Skalarprodukt bestimmen.",
        "Gerade-Ebene: Winkel zur Normalen berechnen und auf den Ebenenwinkel umrechnen."
      ],
      mistakes: ["Gerade-Ebene direkt wie Gerade-Gerade behandeln", "Den spitzen Referenzwinkel nicht wählen"],
      edge: ["Parallele Richtungen liefern 0° oder 180°", "Orthogonale Lage liefert 90°"],
      worked: "Beispiel Würfel: Die Raumdiagonale mit Richtung \\((1,1,1)\\) bildet mit der Grundfläche den Winkel \\(\\arcsin\\!\\left(\\tfrac{1}{\\sqrt{3}}\\right)\\)."
    },
    examples: [
      { title: "Raumdiagonale im Würfel", text: "Bestimme den Winkel zwischen Raumdiagonale und Grundfläche eines Würfels.", params: { ux: 1, uy: 1, uz: 1, vx: 2, vy: 1, vz: 2, nx: 0, ny: 0, nz: 1 } },
      { title: "Gerade-Gerade", text: "Bestimme den Winkel zwischen zwei Raumgeraden mit den Vektoren u und v.", params: { ux: 1, uy: 2, uz: 2, vx: 2, vy: 1, vz: 2, nx: 0, ny: 0, nz: 1 } },
      { title: "Gerade-Ebene", text: "Eine Gerade trifft auf eine Ebene. Bestimme den Winkel zur Ebene über den Normalenvektor.", params: { ux: 1, uy: 1, uz: 2, vx: 2, vy: 1, vz: 2, nx: 0, ny: 0, nz: 1 } }
    ]
  }
];

const POW_LOG_VARIANTS = [
  {
    id: "powers",
    label: "Potenzen",
    source: "Algebra Potenzregeln",
    modes: [
      {
        id: "rules",
        label: "Regeln anwenden",
        theoryFormula: "\\(a^m\\cdot a^n=a^{m+n},\\;\\tfrac{a^m}{a^n}=a^{m-n}\\)",
        controls: [{ key: "a", label: "a", value: 2 }, { key: "m", label: "m", value: 3 }, { key: "n", label: "n", value: 2 }],
        equation: (v) => `${v.a}^{${v.m}}\\cdot ${v.a}^{${v.n}}=${v.a}^{${v.m + v.n}}`,
        operatorGuide: "Fasse nur Terme mit gleicher Basis zusammen und beachte bei Division die Exponentendifferenz.",
        didactic: { definition: "Potenzregeln vereinfachen Produkte und Quotienten gleicher Basen.", steps: ["Gleiche Basis identifizieren.", "Regel passend anwenden.", "Ergebnis optional numerisch auswerten."], mistakes: ["Exponenten bei Summen zusammenfassen", "Basis und Exponent verwechseln"], edge: ["a darf bei Quotienten nicht 0 sein", "Negative Exponenten als Kehrwert deuten"], worked: "Beispiel: 3^4*3^2=3^6." },
        examples: [{ title: "Termvereinfachung", text: "Vereinfache Potenzprodukte mit gleicher Basis.", params: { a: 3, m: 4, n: 2 } }]
      },
      {
        id: "equations",
        label: "Gleichungen lösen",
        theoryFormula: "\\(a^x=b\\Rightarrow x=\\log_a(b)\\)",
        controls: [{ key: "base", label: "Basis", value: 2 }, { key: "target", label: "b", value: 32 }],
        equation: (v) => `${v.base}^x=${v.target}`,
        operatorGuide: "Bringe beide Seiten auf gleiche Basis oder nutze den Logarithmus zum Isolieren von x.",
        didactic: { definition: "Bei Potenzgleichungen steht die Unbekannte meist im Exponenten.", steps: ["Basis prüfen (a>0, a!=1).", "Logarithmieren oder Basis angleichen.", "Lösung per Probe kontrollieren."], mistakes: ["Falsche Logarithmusbasis", "Probe weglassen"], edge: ["target muss >0 sein", "Bei target=1 gilt x=0"], worked: "Beispiel: 2^x=32 => x=5." },
        examples: [{ title: "Exponenten bestimmen", text: "Löse eine Potenzgleichung mit unbekanntem Exponenten.", params: { base: 2, target: 64 } }]
      },
      {
        id: "applications",
        label: "Anwendungsaufgaben",
        theoryFormula: "\\(N(t)=N_0\\cdot q^t\\)",
        controls: [{ key: "n0", label: "N_0", value: 120 }, { key: "q", label: "q", value: 1.15 }, { key: "t", label: "t", value: 4 }],
        equation: (v) => `N(${v.t})=${v.n0}\\cdot ${v.q}^{${v.t}}`,
        operatorGuide: "Modelliere Wachstumsprozesse mit Startwert und Faktor pro Zeitschritt.",
        didactic: { definition: "Exponentialmodelle beschreiben prozentuale Änderungen pro Schritt.", steps: ["Startwert festlegen.", "Faktor aus Prozent bestimmen.", "Zeitschritt einsetzen."], mistakes: ["Prozent nicht in Faktor umrechnen", "Lineares statt exponentielles Rechnen"], edge: ["q>1 Wachstum, 0<q<1 Zerfall", "q=1 konstante Größe"], worked: "Beispiel: N0=120, q=1.15, t=4 => N≈209.91." },
        examples: [{ title: "Bakterienkultur", text: "Bestimme den Bestand nach mehreren Wachstumszyklen.", params: { n0: 120, q: 1.15, t: 4 } }]
      }
    ]
  },
  {
    id: "roots",
    label: "Wurzeln",
    source: "Algebra Wurzelregeln",
    modes: [
      {
        id: "rules",
        label: "Regeln anwenden",
        theoryFormula: "\\(\\sqrt{ab}=\\sqrt a\\cdot\\sqrt b,\\;\\sqrt[n]{a}=a^{1/n}\\)",
        controls: [{ key: "rad", label: "Radikand", value: 72 }, { key: "n", label: "n", value: 2 }],
        equation: (v) => `\\sqrt[${v.n}] {${v.rad}}`,
        operatorGuide: "Zerlege den Radikanden in passende Faktoren und ziehe Potenzen aus der Wurzel.",
        didactic: { definition: "Wurzeln sind Potenzen mit Bruch-Exponenten.", steps: ["Radikand faktorisieren.", "Vollständige Potenzen herausziehen.", "Rest unter der Wurzel belassen."], mistakes: ["Nicht erlaubte Zerlegung", "Vorzeichenregeln ignorieren"], edge: ["Bei gerader Wurzel muss Radikand >= 0", "sqrt(x^2)=|x|"], worked: "Beispiel: sqrt(72)=6*sqrt(2)." },
        examples: [{ title: "Wurzel vereinfachen", text: "Vereinfache einen Radikanden in Primfaktoren.", params: { rad: 72, n: 2 } }]
      },
      {
        id: "equations",
        label: "Gleichungen lösen",
        theoryFormula: "\\(\\sqrt{x+c}=d\\Rightarrow x=d^2-c\\)",
        controls: [{ key: "c", label: "c", value: 5 }, { key: "d", label: "d", value: 6 }],
        equation: (v) => `\\sqrt{x+${v.c}}=${v.d}`,
        operatorGuide: "Isoliere die Wurzel, quadriere beidseitig und prüfe die Lösung in der Ausgangsgleichung.",
        didactic: { definition: "Wurzelgleichungen können beim Quadrieren Scheinlösungen erzeugen.", steps: ["Wurzel isolieren.", "Beidseitig quadrieren.", "Lösung in Originalgleichung prüfen."], mistakes: ["Probe weglassen", "Vorzeichenfehler beim Umstellen"], edge: ["Rechte Seite muss >=0 sein", "Definitionsbereich x+c>=0"], worked: "Beispiel: sqrt(x+5)=6 => x=31." },
        examples: [{ title: "Wurzelgleichung", text: "Bestimme x aus einer einfachen Wurzelgleichung.", params: { c: 5, d: 6 } }]
      },
      {
        id: "applications",
        label: "Anwendungsaufgaben",
        theoryFormula: "\\(a=\\sqrt A\\)",
        controls: [{ key: "A", label: "Fläche A", value: 196 }],
        equation: (v) => `a=\\sqrt{${v.A}}`,
        operatorGuide: "Bei Quadraten erhältst du die Seitenlänge über die Quadratwurzel der Fläche.",
        didactic: { definition: "Viele Längen in Flächenmodellen entstehen durch Wurzelziehen.", steps: ["Passende Formel aufstellen.", "Wurzel ziehen.", "Einheit übertragen."], mistakes: ["Fläche und Länge verwechseln", "Einheit nicht anpassen"], edge: ["Nur positive Länge als Ergebnis", "Bei Messfehlern sinnvoll runden"], worked: "Beispiel: A=196 => a=14." },
        examples: [{ title: "Quadratseite", text: "Berechne die Seitenlänge eines quadratischen Feldes aus der Fläche.", params: { A: 196 } }]
      }
    ]
  },
  {
    id: "logs",
    label: "Logarithmen",
    source: "Algebra Logarithmusregeln",
    modes: [
      {
        id: "rules",
        label: "Regeln anwenden",
        theoryFormula: "\\(\\log_b(uv)=\\log_b(u)+\\log_b(v),\\;\\log_b(u^k)=k\\log_b(u)\\)",
        controls: [{ key: "base", label: "Basis b", value: 10 }, { key: "u", label: "u", value: 100 }, { key: "v", label: "v", value: 1000 }],
        equation: (v) => `\\log_{${v.base}}(${v.u}\\cdot ${v.v})`,
        operatorGuide: "Nutze Produkt-, Quotienten- und Potenzregel nur für positive Argumente.",
        didactic: { definition: "Logarithmen wandeln Produkte in Summen und Potenzen in Faktoren um.", steps: ["Argumente auf Positivität prüfen.", "Passende Regel wählen.", "Optional numerisch auswerten."], mistakes: ["Regeln bei Summen anwenden", "Nicht-positive Argumente verwenden"], edge: ["Basis >0 und !=1", "Argumente strikt >0"], worked: "Beispiel: log10(1000)=3." },
        examples: [{ title: "Log-Regeln", text: "Wende Produkt- und Potenzregeln sicher an.", params: { base: 10, u: 100, v: 1000 } }]
      },
      {
        id: "equations",
        label: "Gleichungen lösen",
        theoryFormula: "\\(\\log_b(x)=c\\Rightarrow x=b^c\\)",
        controls: [{ key: "base", label: "Basis b", value: 3 }, { key: "c", label: "c", value: 4 }],
        equation: (v) => `\\log_{${v.base}}(x)=${v.c}`,
        operatorGuide: "Schreibe die Gleichung in Exponentialform um und löse danach direkt.",
        didactic: { definition: "Log-Gleichungen werden meist über die Umkehrbeziehung zur Potenz gelöst.", steps: ["In Exponentialform umschreiben.", "x isolieren.", "Definitionsbereich prüfen."], mistakes: ["Basis und Exponent vertauschen", "Argument-Bedingung x>0 vergessen"], edge: ["x muss >0 sein", "Basis 1 ist unzulässig"], worked: "Beispiel: log3(x)=4 => x=81." },
        examples: [{ title: "Log-Gleichung", text: "Löse eine Logarithmusgleichung über Exponentialform.", params: { base: 3, c: 4 } }]
      },
      {
        id: "applications",
        label: "Anwendungsaufgaben",
        theoryFormula: "\\(\\text{pH}=-\\log_{10}(c)\\)",
        controls: [{ key: "c", label: "Konzentration c", value: 0.001 }],
        equation: (v) => `\\mathrm{pH}=-\\log_{10}(${v.c})`,
        operatorGuide: "Setze die Konzentration in die pH-Formel ein und interpretiere den resultierenden Wert.",
        didactic: { definition: "Logarithmen treten in Skalen wie pH, Dezibel oder Richter auf.", steps: ["Formel identifizieren.", "Wert einsetzen.", "Ergebnis deuten."], mistakes: ["Vorzeichen bei -log vergessen", "falsche Basis einsetzen"], edge: ["c muss >0 sein", "Skalenwerte sind nicht linear"], worked: "Beispiel: c=0.001 => pH=3." },
        examples: [{ title: "pH-Wert", text: "Berechne den pH-Wert einer Lösung aus der Konzentration.", params: { c: 0.001 } }]
      }
    ]
  },
  {
    id: "mixed",
    label: "Gemischte Umformungen",
    source: "Algebra Transferaufgaben",
    modes: [
      {
        id: "rules",
        label: "Regeln anwenden",
        theoryFormula: "\\(a^{1/2}=\\sqrt a,\\;\\log_b(a^k)=k\\log_b(a)\\)",
        controls: [{ key: "a", label: "a", value: 16 }, { key: "k", label: "k", value: 3 }],
        equation: (v) => `\\log_2(${v.a}^{${v.k}})=${v.k}\\log_2(${v.a})`,
        operatorGuide: "Wechsle sicher zwischen Potenz-, Wurzel- und Logarithmusdarstellung.",
        didactic: { definition: "Gemischte Aufgaben prüfen das flexible Umschreiben zwischen Darstellungen.", steps: ["Geeignete Darstellung wählen.", "Regeln verketten.", "Ergebnis plausibilisieren."], mistakes: ["Umschreibungen halb fertig lassen", "Falsche Basis bei Logs"], edge: ["Definitionsbereich jeder Teiloperation beachten", "Zwischenschritte sauber notieren"], worked: "Beispiel: sqrt(16)=4 und log2(16^3)=12." },
        examples: [{ title: "Darstellungswechsel", text: "Kombiniere Potenz- und Log-Regeln in einem Term.", params: { a: 16, k: 3 } }]
      },
      {
        id: "equations",
        label: "Gleichungen lösen",
        theoryFormula: "\\(\\sqrt{x}=a\\Leftrightarrow x=a^2,\\;\\log_b(x)=c\\Leftrightarrow x=b^c\\)",
        controls: [{ key: "a", label: "a", value: 7 }, { key: "base", label: "Basis b", value: 2 }, { key: "c", label: "c", value: 5 }],
        equation: (v) => `\\sqrt{x}=${v.a},\\;\\log_{${v.base}}(y)=${v.c}`,
        operatorGuide: "Löse die Teilgleichungen getrennt und vergleiche anschließend die Lösungsstruktur.",
        didactic: { definition: "Gemischte Gleichungen kombinieren unterschiedliche Umkehrprozesse.", steps: ["Teilgleichungen trennen.", "Jeweils passende Umkehrung anwenden.", "Lösungen zusammenführen und prüfen."], mistakes: ["Umkehrschritt vertauschen", "Definitionsbedingungen vergessen"], edge: ["x und y müssen zulässige Bereiche erfüllen", "Scheinlösungen prüfen"], worked: "Beispiel: sqrt(x)=7 => x=49 und log2(y)=5 => y=32." },
        examples: [{ title: "Doppelte Gleichung", text: "Löse Wurzel- und Logarithmusgleichung im selben Set.", params: { a: 7, base: 2, c: 5 } }]
      },
      {
        id: "applications",
        label: "Anwendungsaufgaben",
        theoryFormula: "\\(T_n=T_0\\cdot q^n,\\;n=\\tfrac{\\log(T_n/T_0)}{\\log q}\\)",
        controls: [{ key: "T0", label: "T_0", value: 40 }, { key: "q", label: "q", value: 1.08 }, { key: "Tn", label: "T_n", value: 80 }],
        equation: (v) => `${v.Tn}=${v.T0}\\cdot ${v.q}^n`,
        operatorGuide: "Bei Wachstumsaufgaben mit gesuchter Zeit kombinierst du Potenzmodell und Logarithmuslösung.",
        didactic: { definition: "Transferaufgaben verbinden Modellierung und Umformen.", steps: ["Modellgleichung aufstellen.", "Unbekannte isolieren.", "Zeit/Ergebnis sachlich interpretieren."], mistakes: ["Lineare Zeitabschätzung", "Logarithmus mit falscher Basis"], edge: ["T0>0 und q>0", "Bei q≈1 werden Zeiten sehr groß"], worked: "Beispiel: 80=40*1.08^n => n≈9.01." },
        examples: [{ title: "Verdopplungszeit", text: "Bestimme die Zeit bis zur Verdopplung bei prozentualem Wachstum.", params: { T0: 40, q: 1.08, Tn: 80 } }]
      }
    ]
  }
];

const INTEREST_VARIANTS = [
  {
    id: "compound",
    label: "Zinseszins",
    source: "Finanzmathematik",
    theoryFormula: "\\(K_n=K_0(1+p)^n\\)",
    controls: [{ key: "k0", label: "K_0", value: 1000 }, { key: "p", label: "p\\%", value: 5 }, { key: "n", label: "n", value: 10 }],
    equation: (v) => `K_n=${v.k0}(1+${(v.p / 100).toFixed(3)})^{${v.n}}`,
    operatorGuide: "Setze Startkapital, Zinssatz und Laufzeit ein und interpretiere den Exponentialeffekt.",
    didactic: { definition: "Beim Zinseszins werden Zinsen mitverzinst.", steps: ["p in Dezimalfaktor umrechnen.", "In die Formel einsetzen.", "Ergebnis auf Plausibilität prüfen."], mistakes: ["p nicht in Prozentfaktor umrechnen", "lineares statt exponentielles Denken"], edge: ["p=0 ergibt konstantes Kapital", "negativer p-Wert modelliert Schrumpfung"], worked: "Beispiel: 1000 EUR bei 5% und n=10 => 1628.89 EUR." },
    examples: [{ title: "Sparplan", text: "Berechne das Endkapital für einen klassischen Sparplan.", params: { k0: 1000, p: 5, n: 10 } }]
  },
  {
    id: "target_intersection",
    label: "Schnittpunkt mit Zielkapital",
    source: "Finanzmathematik",
    theoryFormula: "\\(K_0(1+p)^n=K_{ziel}\\Rightarrow n=\\tfrac{\\log(K_{ziel}/K_0)}{\\log(1+p)}\\)",
    controls: [{ key: "k0", label: "K_0", value: 1000 }, { key: "p", label: "p\\%", value: 5 }, { key: "target", label: "K_{ziel}", value: 1700 }],
    equation: (v) => `${v.k0}(1+${(v.p / 100).toFixed(3)})^n=${v.target}`,
    operatorGuide: "Zeichne Wachstumskurve und Zielgerade; der Schnittpunkt liefert die benötigte Laufzeit.",
    didactic: { definition: "Ein Zielkapital erzeugt eine horizontale Vergleichsgerade.", steps: ["Wachstumsfunktion aufstellen.", "Ziel als horizontale Linie eintragen.", "Schnittpunktzeit logarithmisch berechnen."], mistakes: ["log mit falschem Argument", "Ziel kleiner als Startwert falsch interpretieren"], edge: ["Bei p<=0 ist Ziel ggf. unerreichbar", "target muss >0 sein"], worked: "Beispiel: 1000*(1.05)^n=1700 => n≈10.90." },
    examples: [{ title: "Sparziel", text: "Wann wird ein festes Zielkapital erreicht?", params: { k0: 1000, p: 5, target: 1700 } }]
  },
  {
    id: "linear_intersection",
    label: "Schnittpunkt mit linearer Entwicklung",
    source: "Finanzmathematik",
    theoryFormula: "\\(K_0(1+p)^x=m x+q\\)",
    controls: [{ key: "k0", label: "K_0", value: 1000 }, { key: "p", label: "p\\%", value: 5 }, { key: "lineM", label: "m", value: 80 }, { key: "lineQ", label: "q", value: 900 }],
    equation: (v) => `${v.k0}(1+${(v.p / 100).toFixed(3)})^x=${v.lineM}x+${v.lineQ}`,
    operatorGuide: "Vergleiche exponentielles Wachstum mit einem linearen Modell und bestimme den Umschlagpunkt.",
    didactic: { definition: "Der Vergleich zeigt, wann exponentielles Wachstum eine lineare Entwicklung überholt.", steps: ["Beide Modelle im selben Koordinatensystem zeichnen.", "Vorzeichenwechsel von f(x)-g(x) suchen.", "Schnittpunkt numerisch verfeinern."], mistakes: ["f und g vertauschen", "nur ganzzahlige Jahre prüfen"], edge: ["Es kann 0, 1 oder mehrere Schnittpunkte geben", "Bei kleinem p oft später Umschlag"], worked: "Beispiel: 1000*1.05^x und 80x+900 schneiden sich nahe x≈3.27." },
    examples: [{ title: "Linear vs exponentiell", text: "Bestimme den Zeitpunkt, ab dem Zinseszins ein lineares Modell übertrifft.", params: { k0: 1000, p: 5, lineM: 80, lineQ: 900 } }]
  }
];

GOAL_DEFS.algebra = (GOAL_DEFS.algebra || []).map((goal) => {
  if (goal.id === "pow_log") {
    return {
      id: "pow_log",
      title: "Potenzen, Wurzeln, Logarithmen: adaptiv trainieren",
      source: "Fundamentum.pdf, S. 16, 51",
      theory: "Wähle Variante und Modus. Theorie, Sandbox und Übungen werden gemeinsam umgeschaltet.",
      variants: POW_LOG_VARIANTS
    };
  }
  if (goal.id === "interest") {
    return {
      id: "interest",
      title: "Zinseszins und Schnittpunkte",
      source: "Fundamentum.pdf, S. 51",
      theory: "Wähle Zinseszins, Zielkapital-Schnittpunkt oder linearen Vergleich. Alle Bereiche passen sich an.",
      variants: INTEREST_VARIANTS
    };
  }
  return goal;
});

GOAL_DEFS.geometrie = [
  {
    id: "plane_measurement",
    title: "Fläche und Umfang: Form wählen, passend rechnen",
    source: "Kursunterlagen Geometrie / Planimetrie",
    theory: "Wähle oben zuerst die konkrete Form. Theorie, Sandkasten, Übungen und Praxisbeispiel passen sich dann gemeinsam an.",
    variants: PLANE_MEASUREMENT_VARIANTS
  },
  {
    id: "solid_measurement",
    title: "Körpermaße: Körper und Zielgröße wählen",
    source: "Kursunterlagen Stereometrie",
    theory: "Wähle zuerst den Körper und danach Volumen, Mantelfläche oder Gesamtoberfläche. Alle Bereiche der Karte schalten gemeinsam um.",
    variants: SOLID_MEASUREMENT_VARIANTS
  }
];

GOAL_DEFS.trigonometrie = [
  {
    id: "triangle_trig",
    title: "Trigonometrie: Fall wählen und gezielt lösen",
    source: "Kursunterlagen Trigonometrie",
    theory: "Wähle zuerst rechtwinkliges Dreieck, allgemeines Dreieck oder Raumwinkel. Danach passen sich Theorie, Sandbox und Übungen an.",
    variants: TRIANGLE_TRIG_VARIANTS
  }
];

const GOAL_ENHANCEMENTS = {
  lgs2: {
    operatorGuide: "Bedienung: Passe die Koeffizienten an oder ziehe die y-Achsen-Schnittpunkte der beiden Geraden direkt im Koordinatensystem.",
    tags: ["Lineare Algebra", "Gleichungssysteme"],
    examples: [
      {
        title: "Taxi-Tarife vergleichen",
        text: "Modelliere zwei Tarife als lineare Gleichungen und bestimme den Schnittpunkt als Preisgleichheit.",
        params: { a: 2, b: 1, e: 7, c: 1, d: -1, f: 1 }
      }
    ]
  },
  lgs3: {
    operatorGuide: "Bedienung: Trage ein 3x3-System ein. Die Grafik zeigt die drei Ebenen und ihren Schnittpunkt, die Cramer-Ausgabe dient als rechnerische Kontrolle.",
    tags: ["Lineare Algebra", "Determinanten"],
    examples: [
      {
        title: "Mischungsproblem",
        text: "Drei Zutaten mit drei Bedingungen ergeben ein lineares 3x3-System.",
        params: { a1: 1, b1: 2, c1: 1, d1: 8, a2: 1, b2: 1, c2: 2, d2: 9, a3: 2, b3: 1, c3: 1, d3: 10 }
      }
    ]
  },
  quad_methods: {
    tags: ["Quadratische Gleichungen", "Nullstellen"],
    examples: [
      {
        title: "Wurfparabel trifft Boden",
        text: "Die Höhe ist h(x)=x^2-5x+6. Bestimme die Zeitpunkte mit h(x)=0.",
        params: { a: 1, b: -5, c: 6 }
      }
    ]
  },
  pow_log: {
    tags: ["Potenzen", "Logarithmen"],
    examples: [
      {
        title: "Wachstumsfaktor umformen",
        text: "Vereinfache 3^4*3^2 und leite den Exponenten mit Logarithmus rückwärts her.",
        params: { a: 3, m: 4, n: 2 }
      }
    ]
  },
  exp_log_eq: {
    tags: ["Exponentialgleichung", "Logarithmusgleichung", "Wurzelgleichung"],
    examples: [
      {
        title: "Falltyp A - Rein exponentiell",
        text: "Löse 2^(x+1)=32 durch Basisausgleich oder Logarithmieren.",
        params: { base: 2, x: 4 }
      },
      {
        title: "Falltyp B - Logarithmisch",
        text: "Forme log_3(x+1)=2 in Exponentialform um und bestimme x.",
        params: { base: 3, x: 2 }
      },
      {
        title: "Falltyp C - Gemischt mit Wurzel",
        text: "Löse sqrt(x+5)=x-1 und prüfe auf Scheinlösungen.",
        params: { base: 2, x: 3 }
      }
    ]
  },
  interest: {
    operatorGuide: "Bedienung: Variiere Zinssatz und Laufzeit, um Zinseszins-Effekte direkt im Graphen zu sehen.",
    tags: ["Finanzmathematik", "Exponential"],
    examples: [
      {
        title: "Sparplan",
        text: "Startkapital 1500 EUR, Zinssatz 4.5 Prozent, Laufzeit 8 Jahre.",
        params: { k0: 1500, p: 4.5, n: 8 }
      }
    ]
  },
  any_triangle: {
    operatorGuide: "Bedienung: Ändere Seiten und Winkel. Das Dreieck aktualisiert sich mit Seiten- und Winkelbeschriftung.",
    tags: ["Trigonometrie", "Kosinussatz"],
    examples: [
      {
        title: "Dachkonstruktion",
        text: "Gegeben sind zwei Sparrenlängen und der eingeschlossene Winkel.",
        params: { a: 7, b: 5, gamma: 50 }
      },
      {
        title: "Dreiecksvermessung im Park",
        text: "Gegeben sind \\(a=9\\), \\(b=6\\) und \\(\\gamma=120^\\circ\\). Bestimme zuerst \\(c\\) mit dem Kosinussatz und danach die restlichen Winkel.",
        params: { a: 9, b: 6, gamma: 120 }
      }
    ]
  },
  similarity: {
    operatorGuide: "Bedienung: Setze den Skalierungsfaktor \\(k\\) und eine Ausgangslänge ein. Prüfe danach getrennt Längen- und Flächenfaktor.",
    tags: ["Geometrie", "Ähnlichkeit", "Skalierung"],
    examples: [
      {
        title: "Bauplan-Massstab",
        text: "Ein Plan wird mit \\(k=2{,}5\\) vergrößert. Strecke 4 cm im Original: Wie lang im vergrößerten Plan?",
        params: { k: 2.5, a: 4 }
      },
      {
        title: "Kartenfläche",
        text: "Eine Fläche von \\(12\\,\\text{cm}^2\\) wird mit \\(k=1{,}8\\) skaliert. Wie groß ist die neue Fläche?",
        params: { k: 1.8, a: 12 }
      }
    ]
  },
  cut_compose: {
    operatorGuide: "Bedienung: Wähle Kantenlänge und Schnittgröße. Interpretiere das Restvolumen als Grundkörper minus Teilkörper.",
    tags: ["Stereometrie", "Volumen", "Körperveränderung"],
    examples: [
      {
        title: "Abgeschnittene Ecke",
        text: "Würfel mit Kante 8, abgeschnittenes Eckteil mit Schnittparameter 2. Berechne das Restvolumen im Modell.",
        params: { a: 8, cut: 2 }
      },
      {
        title: "Werkstück mit Ausbruch",
        text: "Ein Materialblock wird an einer Ecke gekürzt. Vergleiche Ausgangs- und Restvolumen.",
        params: { a: 7, cut: 3 }
      },
      {
        title: "Bohrung durch Quader (Näherungsmodell)",
        text: "Aus einem Block wird ein zylindrischer Kanal entfernt. Modellidee: Gesamtvolumen minus Teilvolumen.",
        params: { a: 9, cut: 2.5 }
      }
    ]
  },
  lin_quad_plot: {
    tags: ["Funktionen", "Schnittpunkte"],
    examples: [
      {
        title: "Parabel und Gerade schneiden sich zweimal",
        text: "Untersuche f(x)=x^2-2x-3 und g(x)=x auf ihre Schnittpunkte.",
        params: { a: 1, b: -2, c: -3, m: 1, q: 0 }
      }
    ]
  },
  eq_from_points: {
    tags: ["Geradengleichung", "Steigung"],
    examples: [
      {
        title: "Messreihe aus zwei Datenpunkten",
        text: "Bestimme aus P1(2,3) und P2(6,11) die lineare Funktionsgleichung.",
        params: { x1: 2, y1: 3, x2: 6, y2: 11 }
      }
    ]
  },
  parabola_props: {
    tags: ["Parabel", "Scheitelpunkt"],
    examples: [
      {
        title: "Lichtkegel mit Tiefpunkt",
        text: "Analysiere f(x)=x^2-4x+1: Scheitelpunkt, Symmetrieachse und Öffnung.",
        params: { a: 1, b: -4, c: 1 }
      }
    ]
  },
  expo_growth: {
    tags: ["Wachstum", "Zerfall"],
    examples: [
      {
        title: "Bakterienwachstum",
        text: "Startwert 5, Wachstumsfaktor 1.35. Interpretiere den Verlauf in den ersten Schritten.",
        params: { a: 5, b: 1.35 }
      }
    ]
  },
  triangle_lines: {
    tags: ["Dreieck", "Höhe", "Schwerlinie"],
    examples: [
      {
        title: "Dreiecksfläche über Grundseite und Höhe",
        text: "Gegeben g=10 und h=6. Berechne A und ordne die Höhe in der Skizze korrekt zu.",
        params: { b: 10, h: 6 }
      },
      {
        title: "Schwerlinie vs. Winkelhalbierende",
        text: "Vergleiche in derselben Skizze die Schwerlinie von \\(C\\) und die Winkelhalbierende bei \\(\\gamma\\). Markiere die unterschiedlichen Eigenschaften.",
        params: { b: 12, h: 5 }
      }
    ]
  },
  area_composite: {
    tags: ["Zusammengesetzte Figuren", "Fläche"],
    examples: [
      {
        title: "Rechteck plus Halbkreis",
        text: "Ein Fenster besteht aus Rechteck und Halbkreis. Berechne Gesamtfläche und Umfang.",
        params: { w: 8, h: 5, r: 2 }
      },
      {
        title: "Innenausschnitt abziehen",
        text: "Aus einer rechteckigen Platte wird ein Viertelkreis ausgeschnitten. Berechne Restfläche und Umfang des Außenrands.",
        params: { w: 10, h: 7, r: 3 }
      }
    ]
  },
  solids: {
    operatorGuide: "Bedienung: Vergleiche nacheinander Quader, Zylinder und Kugel. Achte bewusst darauf, ob die Aufgabe nach Volumen, Oberfläche oder einer Skizzeninterpretation fragt.",
    tags: ["Stereometrie", "Volumen", "Oberfläche"],
    examples: [
      {
        title: "Verpackungsvolumen",
        text: "Vergleiche Quader-, Zylinder- und Kugelvolumen bei gegebenen Massen.",
        params: { a: 4, b: 3, h: 5, r: 2 }
      },
      {
        title: "Mantel oder Gesamtoberfläche?",
        text: "Ein Dosenetikett bedeckt nur die Mantelfläche eines Zylinders. Entscheide zuerst die passende Fläche und berechne danach den Wert.",
        params: { a: 6, b: 4, h: 9, r: 3 }
      },
      {
        title: "Skizze in ungewohnter Lage",
        text: "Ein Prisma liegt gekippt in der Zeichnung. Erkenne trotzdem Grundfläche, Höhe und sichtbare Kanten korrekt.",
        params: { a: 5, b: 4, h: 7, r: 2 }
      }
    ]
  },
  space_angle: {
    operatorGuide: "Bedienung: Du kannst den Würfel-Spezialfall ansehen und zusätzlich zwei Richtungsvektoren sowie einen Ebenennormalenvektor eingeben.",
    tags: ["Raumgeometrie", "Winkel"],
    examples: [
      {
        title: "Raumdiagonale im Würfel",
        text: "Untersuche den Winkel zwischen Raumdiagonale und Grundfläche.",
        params: { edge: 4 }
      },
      {
        title: "Gerade-Gerade mit Vektoren",
        text: "Bestimme den Winkel zwischen u=(1,2,2) und v=(2,1,2) per Skalarprodukt.",
        params: { edge: 4, ux: 1, uy: 2, uz: 2, vx: 2, vy: 1, vz: 2, nx: 0, ny: 0, nz: 1 }
      },
      {
        title: "Gerade-Ebene mit Normalenvektor",
        text: "Eine Gerade mit Richtungsvektor \\((1,1,2)\\) trifft auf eine Ebene mit Normalenvektor \\((0,0,1)\\). Bestimme den Winkel zur Ebene, nicht zur Normalen.",
        params: { edge: 4, ux: 1, uy: 1, uz: 2, vx: 2, vy: 1, vz: 2, nx: 0, ny: 0, nz: 1 }
      }
    ]
  }
};

const DIDACTIC_THEORY = {
  lgs2: {
    definition: "Ein lineares Gleichungssystem mit zwei Variablen beschreibt zwei Geraden. Die Lösung ist der Schnittpunkt beider Geraden.",
    steps: [
      "Eine Gleichung nach x oder y auflösen.",
      "In die zweite Gleichung einsetzen.",
      "Rückeinsetzen und Probe machen."
    ],
    mistakes: ["Vorzeichenfehler beim Umformen", "Probe auslassen"],
    edge: ["Parallele Geraden: keine Lösung", "Identische Geraden: unendlich viele Lösungen"],
    worked: "Beispiel: \\(2x+y=7\\) und \\(x-y=1 \\Rightarrow x=\\tfrac{8}{3},\\,y=\\tfrac{5}{3}\\)."
  },
  lgs3: {
    definition: "Ein 3×3-LGS hat drei Gleichungen mit x, y, z. Es kann eine, keine oder unendlich viele Lösungen haben.",
    steps: [
      "Eine Variable mit Einsetzen oder Addieren eliminieren.",
      "Auf ein 2×2-System reduzieren und lösen.",
      "Rückwärts einsetzen und Probe in allen drei Gleichungen."
    ],
    mistakes: ["Zu früh runden", "Eliminationsschritt mit falschem Faktor"],
    edge: ["Abhängige Gleichungen: unendlich viele Lösungen", "Widerspruch wie 0=5: keine Lösung"],
    worked: "Beispiel: Erst z eliminieren, dann 2×2 lösen und am Ende z berechnen."
  },
  quad_methods: {
    definition: "Quadratische Gleichungen haben die Form \\(ax^2+bx+c=0\\) mit \\(a\\neq 0\\).",
    steps: [
      "Diskriminante \\(\\Delta=b^2-4ac\\) berechnen.",
      "\\(\\Delta<0\\): keine reelle Lösung; \\(\\Delta=0\\): doppelte Lösung; \\(\\Delta>0\\): zwei Lösungen.",
      "Alternativ faktorisiere \\((x-x_1)(x-x_2)=0\\), wenn passend."
    ],
    mistakes: ["Minus vor b vergessen", "Wurzel über ganzen Bruch statt nur \\(\\Delta\\)"],
    edge: ["a darf nicht 0 sein", "\\(\\Delta<0\\) führt in \\(\\mathbb{R}\\) zu keiner Nullstelle"],
    worked: "Beispiel: \\(x^2-3x+2=0 \\Rightarrow (x-1)(x-2)=0 \\Rightarrow x=1\\) oder \\(x=2\\)."
  },
  pow_log: {
    definition: "Potenzen, Wurzeln und Logarithmen sind eng verknüpft: Wurzeln sind Potenzen mit Bruch-Exponenten, Logarithmen invertieren Potenzen.",
    steps: [
      "Gleiche Basen zusammenfassen und Exponentenregeln anwenden.",
      "Bei Wurzeln auf Definitionsbereich achten (gerade Wurzel: Radikand >= 0).",
      "Bei Logarithmen nur positive Argumente verwenden."
    ],
    mistakes: ["\\(a^m+a^n\\) mit \\(a^{m+n}\\) verwechseln", "\\(\\sqrt{x^2}=x\\) statt \\(|x|\\)"],
    edge: ["\\(a^0=1\\) nur für \\(a \\neq 0\\)", "\\(\\log_b(u)\\) nur für \\(u>0\\) und \\(b>0,\\,b \\neq 1\\)"],
    worked: "Beispiel: \\(2^3\\cdot 2^2=2^5=32\\) und \\(\\log_2(32)=5\\)."
  },
  exp_log_eq: {
    definition: "Bei Exponential- und Logarithmusgleichungen wird die Unbekannte über Exponenten oder Logarithmen isoliert.",
    steps: [
      "Falltyp A (rein exponentiell): auf gleiche Basis bringen oder logarithmieren.",
      "Falltyp B (logarithmisch): in Exponentialform umschreiben und dann algebraisch lösen.",
      "Falltyp C (gemischt mit Wurzel/Potenz): Definitionsbereich setzen, umformen, Probe gegen Scheinlösungen."
    ],
    mistakes: ["Klammern im Exponenten vergessen", "Nach Quadrieren keine Probe"],
    edge: ["Scheinlösungen bei Wurzelgleichungen", "Log-Argument muss strikt positiv bleiben"],
    worked: "Beispiele: A) \\(2^{x+1}=16 \\Rightarrow x=3\\), B) \\(\\log_3(x+1)=2 \\Rightarrow x=8\\), C) \\(\\sqrt{x+5}=x-1\\) mit Probe auf Scheinlösung."
  },
  interest: {
    definition: "Zinseszins bedeutet: In jeder Periode werden auch bereits erhaltene Zinsen weiter verzinst.",
    steps: [
      "p in Dezimalzahl umrechnen.",
      "Formel K_n=K_0(1+p)^n einsetzen.",
      "Ergebnis auf Plausibilität prüfen (Wachstum bei \\(p>0\\))."
    ],
    mistakes: ["Prozent nicht in Dezimalzahl umrechnen", "Lineares statt exponentielles Denken"],
    edge: ["p=0 liefert konstantes Kapital", "p<0 modelliert Schrumpfung"],
    worked: "Beispiel: 1000 EUR bei 5% für 2 Jahre \\(\\Rightarrow 1000 \\cdot 1{,}05^2 = 1102{,}50\\) EUR."
  },
  lin_quad_plot: {
    definition: "Lineare Funktionen sind Geraden, quadratische Funktionen sind Parabeln.",
    steps: [
      "Parameter a,b,c identifizieren.",
      "Wertetabelle für mehrere x-Werte erstellen.",
      "Graph zeichnen und Form/Steigung interpretieren."
    ],
    mistakes: ["a mit b verwechseln", "zu wenige Punkte beim Zeichnen"],
    edge: ["a=0 macht aus quadratisch eine lineare Funktion", "negatives a öffnet nach unten"],
    worked: "Beispiel: f(x)=x^2-2x-3 hat Nullstellen bei x=-1 und x=3."
  },
  eq_from_points: {
    definition: "Aus zwei Punkten lässt sich bei linearer Funktion Steigung und Achsenabschnitt eindeutig bestimmen.",
    steps: [
      "Steigung m=(y2-y1)/(x2-x1) berechnen.",
      "m in y=mx+q einsetzen und q bestimmen.",
      "Mit zweitem Punkt gegenprüfen."
    ],
    mistakes: ["x1 und x2 vertauscht mit y-Werten", "Division durch x2-x1=0 ignoriert"],
    edge: ["x1=x2 beschreibt keine Funktion y=mx+q", "identische Punkte liefern keine eindeutige Gerade"],
    worked: "Beispiel: P1(1,2), P2(3,6) -> m=2, q=0, also y=2x."
  },
  parabola_props: {
    definition: "Parabeln haben eine Symmetrieachse und einen Scheitelpunkt als Extrempunkt.",
    steps: [
      "x_S=-b/(2a) berechnen.",
      "y_S=f(x_S) einsetzen.",
      "Öffnung über Vorzeichen von \\(a\\) bestimmen."
    ],
    mistakes: ["Scheitel x_S mit Nullstelle verwechseln", "b/(2a) ohne Minuszeichen"],
    edge: ["a nahe 0 erzeugt sehr flache Parabel", "Delta bestimmt Anzahl der Nullstellen"],
    worked: "Beispiel: f(x)=x^2-4x+1 -> x_S=2, y_S=-3."
  },
  expo_growth: {
    definition: "Exponentialfunktionen modellieren Prozesse mit konstantem prozentualem Faktor pro Schritt.",
    steps: [
      "Startwert a und Faktor b bestimmen.",
      "Wachstum: b>1, Zerfall: 0<b<1.",
      "Für gesuchte Zeit \\(x\\) Gleichung nach \\(x\\) umstellen."
    ],
    mistakes: ["lineares Wachstum statt Faktorwachstum annehmen", "b mit Prozent p verwechseln"],
    edge: ["b=1 bedeutet konstant", "a<0 kippt den Graphen unter die x-Achse"],
    worked: "Beispiel: a=100, b=1.2 -> nach 3 Schritten 100*1.2^3=172.8."
  },
  triangle_lines: {
    definition: "Im Dreieck sind Höhe, Winkelhalbierende und Schwerlinie drei unterschiedliche Speziallinien mit klaren Eigenschaften.",
    steps: [
      "Entscheide zuerst, welche Linie zur Fragestellung passt.",
      "Zeichne die Linie korrekt in die Skizze ein.",
      "Nutze passende Beziehung (z.B. \\(A=\\tfrac{1}{2}g h\\) oder Teilungsverhältnisse)."
    ],
    mistakes: ["Winkelhalbierende als Mittelsenkrechte zeichnen", "Höhe nicht senkrecht setzen"],
    edge: ["Bei stumpfen Dreiecken liegt die Höhe teilweise außerhalb", "Schwerpunkt teilt Median immer 2:1"],
    worked: "Beispiel: A=20 und g=8 -> h=2A/g=5."
  },
  area_composite: {
    definition: "Zusammengesetzte Figuren werden in bekannte Teilflächen zerlegt und anschließend addiert oder subtrahiert.",
    steps: [
      "Figur in Rechtecke, Dreiecke, Kreisteile zerlegen.",
      "Teilflächen berechnen und korrekt addieren/subtrahieren.",
      "Beim Umfang nur den echten Außenrand summieren."
    ],
    mistakes: ["Innenkanten zum Umfang addieren", "Teilflächen doppelt zählen"],
    edge: ["Überlappungen müssen subtrahiert werden", "Einheiten konsequent halten"],
    worked: "Beispiel: Rechteck + Halbkreis: \\(A=w\\cdot h + \\tfrac{1}{2}\\pi r^2\\)."
  },
  similarity: {
    definition: "Ähnliche Figuren haben gleiche Winkel und Seiten im konstanten Verhältnis \\(k\\).",
    steps: [
      "Ähnlichkeit über Winkel- oder Seitenkriterien prüfen.",
      "Längen mit \\(L'=kL\\) umrechnen.",
      "Flächen mit \\(A'=k^2 A\\) skalieren."
    ],
    mistakes: ["Fläche auch nur mit \\(k\\) statt \\(k^2\\) skalieren", "nicht entsprechende Seiten vergleichen"],
    edge: ["k<1 bedeutet Verkleinerung", "negatives \\(k\\) ist in geometrischem Längenkontext unüblich"],
    worked: "Beispiel: k=1.5 und A=20 -> A'=45."
  },
  solids: {
    definition: "Körperaufgaben trennen meist zwischen Volumen (Inhalt) und Oberfläche (Außenfläche).",
    steps: [
      "Körpertyp sicher identifizieren.",
      "Passende Formel wählen (z.B. Quader, Zylinder, Kugel).",
      "Skizze lesen: Grundfläche, Höhe, Radius und sichtbare Kanten sauber zuordnen.",
      "Einheiten prüfen: Volumen in Kubikeinheiten, Oberfläche in Flächeneinheiten."
    ],
    mistakes: ["Volumen- und Oberflächenformeln verwechseln", "Radius und Durchmesser vertauschen"],
    edge: ["Maße in cm, Ergebnis in m^3 ist falsch ohne Umrechnung", "\\(r=0\\) ergibt degenerierten Körper"],
    worked: "Beispiel: Zylinder \\(r=2\\), \\(h=5\\) \\(\\Rightarrow V=\\pi\\cdot 2^2\\cdot 5=20\\pi\\) und \\(O=2\\pi r^2+2\\pi rh=28\\pi\\)."
  },
  cut_compose: {
    definition: "Veränderte Körper werden über Zerlegen in Grundkörper gerechnet: addieren bei Zusammensetzen, subtrahieren bei Ausschnitten.",
    steps: [
      "Aufgabentyp 1 (Ausschnitt): Grundkörper minus Teilkörper rechnen.",
      "Aufgabentyp 2 (Zusammensetzen): Teilkörper addieren und Übergangsflächen beachten.",
      "Aufgabentyp 3 (Bohrung/Kanal): entfernten Teil als separates Volumen modellieren und abziehen.",
      "Für Skizzen zusätzlich prüfen, welche Kanten und Flächen nach dem Eingriff sichtbar bleiben."
    ],
    mistakes: ["falscher Teilkörper wird abgezogen", "Schnittvolumen nur geschätzt statt berechnet"],
    edge: ["Bei großen Ausschnitten kann Restkörper ungültig werden", "Sichtbare Flächen für Oberfläche neu bilanzieren"],
    worked: "Beispiel: Würfel mit Kante \\(6\\) und abgeschnittener Ecke \\(s=2\\): \\(V_{rest}=6^3-\\tfrac{2^3}{6}\\). Danach Ecken, Kanten und sichtbare Dreiecksfläche separat prüfen."
  },
  any_triangle: {
    definition: "Beliebige Dreiecke löst man mit Sinus- und Kosinussatz je nach gegebener Datenlage.",
    steps: [
      "Prüfe, welche Werte gegeben sind (SSS, SAS, ASA, AAS).",
      "Kosinussatz bei zwei Seiten und eingeschlossenem Winkel nutzen.",
      "Sinussatz für Verhältnisse gegenüberliegender Seiten und Winkel nutzen."
    ],
    mistakes: ["Grad-/Bogenmaß im Rechner verwechselt", "falsches Winkel-Seiten-Paar im Sinussatz"],
    edge: ["Sinussatz kann zwei Lösungen liefern (SSA-Fall)", "Winkelsumme muss 180° ergeben"],
    worked: "Beispiel: a=7, b=5, gamma=50 Grad -> c via Kosinussatz."
  },
  space_angle: {
    definition: "Raumwinkel werden über Richtungsvektoren (Gerade-Gerade) oder Gerade-Normalen-Bezug (Gerade-Ebene) bestimmt.",
    steps: [
      "Richtungsvektoren bestimmen.",
      "Skalarprodukt für den Winkel zwischen zwei Geraden nutzen.",
      "Bei Gerade-Ebene zuerst den Winkel zur Normalen bestimmen und dann auf den Ebenenwinkel umrechnen.",
      "Ergebnis im Kontext interpretieren (spitzer Winkel als Standard)."
    ],
    mistakes: ["Normierung der Vektoren vergessen", "Winkel zur Ebene mit Winkel zur Normalen verwechseln"],
    edge: ["Parallele Geraden geben 0 Grad oder 180 Grad", "orthogonale Richtung ergibt 90 Grad"],
    worked: "Spezialfall Würfel: Mit Richtungsvektor \\((1,1,1)\\) und Normalenvektor der Grundfläche \\((0,0,1)\\) gilt zuerst \\(\\cos(\\varphi)=\\tfrac{1}{\\sqrt{3}}\\), danach \\(\\beta=90^\\circ-\\varphi=\\arcsin\\!\\left(\\tfrac{1}{\\sqrt{3}}\\right)\\)."
  }
};

function didacticTheoryHtml(goalId, fallbackTheory) {
  const info = DIDACTIC_THEORY[goalId];
  if (!info) return fallbackTheory;
  const steps = (info.steps || []).map((s, i) => `${i + 1}) ${s}`).join("<br>");
  const mistakes = (info.mistakes || []).join("; ");
  const edge = (info.edge || []).join("; ");
  const result = [
    `<strong>Definition:</strong> ${info.definition}`,
    `<strong>Schrittfolge:</strong><br>${steps}`,
    `<strong>Typische Fehler:</strong> ${mistakes}`,
    `<strong>Edge Cases:</strong> ${edge}`,
    `<strong>Kurzbeispiel:</strong> ${info.worked}`,
    `<strong>Formelbezug:</strong> ${fallbackTheory}`
  ].join("<br><br>");
  return linkGlossaryTerms(result);
}


const topicTheorySupplements = {
  algebra: [],
  funktionen: [],
  geometrie: [],
  trigonometrie: []
};

function chapterToTopic(chapter) {
  const c = String(chapter || "").toLowerCase();
  if (c.includes("algebra")) return "algebra";
  if (c.includes("funktion")) return "funktionen";
  if (c.includes("geometr")) return "geometrie";
  if (c.includes("trigonom")) return "trigonometrie";
  return null;
}

function theorySupplementHtml(topic) {
  const items = topicTheorySupplements[topic] || [];
  if (!items.length) return "";
  const li = items.slice(0, 5).map((x) => `<li>\\(${x}\\)</li>`).join("");
  return `<div class="goal-extra-theory"><p><strong>Zusatz aus Grundwissen Mathematik (umfangreichere Theorie):</strong></p><ul>${li}</ul></div>`;
}

function isLikelyCorruptedSupplement(raw) {
  const text = String(raw || "").trim();
  if (!text || text.length < 8) return true;
  if (/[�]/.test(text)) return true;
  if (/\bfi[+'`]/i.test(text)) return true;
  if (/J\s*[a-zA-Z0-9]/.test(text)) return true;
  const badChars = text.match(/[^0-9a-zA-ZäöüÄÖÜß+\-*/=^_().,:;<>|\\\s\[\]{}°]/g);
  const badRatio = badChars ? badChars.length / text.length : 0;
  return badRatio > 0.08;
}

function applyTheorySupplementsToCards() {
  Object.keys(topicTheorySupplements).forEach((topic) => {
    (GOAL_DEFS[topic] || []).forEach((goal) => {
      const card = document.getElementById(`goal-${goal.id}`);
      if (!card) return;
      const host = card.querySelector(".goal-extra-theory-host");
      if (!host) return;
      host.innerHTML = theorySupplementHtml(topic);
      typeset(card);
    });
  });
}

async function loadTheorySupplements() {
  const files = ["data/grundwissen_first_sprint.json"];
  const seen = new Set();
  for (const path of files) {
    try {
      const response = await fetch(path, { cache: "no-cache" });
      if (!response.ok) continue;
      const payload = await response.json();
      const fileEntries = [];
      let total = 0;
      let filtered = 0;
      (payload.formulas || []).forEach((f) => {
        total += 1;
        const topic = chapterToTopic(f.chapter);
        const raw = String(f.formula_raw || "").trim();
        if (!topic || !raw) {
          filtered += 1;
          return;
        }
        if (isLikelyCorruptedSupplement(raw)) {
          filtered += 1;
          return;
        }
        const key = `${topic}:${raw}`;
        if (seen.has(key)) return;
        seen.add(key);
        fileEntries.push({ topic, raw });
      });

      if (total > 0 && filtered / total > 0.5) {
        console.warn(`Theoriesupplements aus ${path} übersprungen: ${filtered}/${total} Einträge unzuverlässig.`);
        continue;
      }

      fileEntries.forEach((entry) => topicTheorySupplements[entry.topic].push(entry.raw));
    } catch {
      // ignore optional source file
    }
  }
  applyTheorySupplementsToCards();
}

function enrichGoalDefinitions() {
  const orderedTopics = ["algebra", "funktionen", "geometrie", "trigonometrie"];
  const topicSourceHint = {
    algebra: "Grundwissen Mathematik, Buchseite 102-159 (PDF 8-9, Seitenabgleich ggf. unsicher)",
    funktionen: "Grundwissen Mathematik, Buchseite 162-237 (PDF 9, Seitenabgleich ggf. unsicher)",
    geometrie: "Grundwissen Mathematik, Buchseite 252-349 (PDF 10, Seitenabgleich ggf. unsicher)",
    trigonometrie: "Grundwissen Mathematik, Buchseite 219-250 (PDF 9-10, Seitenabgleich ggf. unsicher)"
  };
  orderedTopics.forEach((topic) => {
    (GOAL_DEFS[topic] || []).forEach((goal, idx) => {
      const enhancement = GOAL_ENHANCEMENTS[goal.id] || {};
      const reqRefs = REQUIREMENTS_PATH.filter((req) => req.goalIds.includes(goal.id));
      goal.path = `${topic}.${idx + 1}`;
      goal.level = idx + 1;
      goal.tags = enhancement.tags || [topic];
      goal.prereq = goal.prereq || [];
      goal.operatorGuide = enhancement.operatorGuide || "Bedienung: Nutze die Eingabefelder und prüfe dein Ergebnis mit dem Rechnen-Button.";
      goal.examples = enhancement.examples || [];
      goal.theory = didacticTheoryHtml(goal.id, goal.theory);
      goal.requirementRefs = reqRefs;
      goal.sourceRefs = [
        `Formelnachschlage (Fundamentum): ${goal.source}`,
        `Theorie-Vertiefung (Grundwissen Mathematik): ${topicSourceHint[topic]}`
      ];
    });
  });
}

function createEmptyLearningState() {
  return {
    schemaVersion: STATE_SCHEMA_VERSION,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    archives: {},
    archiveAttempts: {},
    goals: {},
    events: []
  };
}

let learningState = createEmptyLearningState();

function ensureGoalState(goalId, topic) {
  if (!learningState.goals[goalId]) {
    learningState.goals[goalId] = {
      topic,
      theoryChecked: false,
      attemptCount: 0,
      randomCount: 0,
      exampleUseCount: 0,
      activeVariantId: null,
      activeModeId: null,
      lastAttemptAt: null,
      results: []
    };
  }
  if (!Object.hasOwn(learningState.goals[goalId], "activeVariantId")) learningState.goals[goalId].activeVariantId = null;
  if (!Object.hasOwn(learningState.goals[goalId], "activeModeId")) learningState.goals[goalId].activeModeId = null;
  return learningState.goals[goalId];
}

function ensureArchiveState(archiveId) {
  if (!learningState.archives[archiveId]) {
    learningState.archives[archiveId] = {
      theoryChecked: false,
      attemptCount: 0,
      lastViewedAt: null,
      lastAttemptAt: null,
      currentExercise: null
    };
  }
  return learningState.archives[archiveId];
}

function pushLearningEvent(type, goalId, payload) {
  learningState.events.push({
    type,
    goalId,
    payload: payload || {},
    timestamp: new Date().toISOString()
  });
  if (learningState.events.length > 600) learningState.events = learningState.events.slice(-600);
}

function saveLearningState() {
  learningState.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(learningState));
}

function migrateState(raw) {
  const base = createEmptyLearningState();
  if (!raw || typeof raw !== "object") return base;
  if (raw.schemaVersion === STATE_SCHEMA_VERSION) {
    return {
      ...base,
      ...raw,
      archives: raw.archives && typeof raw.archives === "object" ? raw.archives : {},
      archiveAttempts: raw.archiveAttempts && typeof raw.archiveAttempts === "object" ? raw.archiveAttempts : {},
      goals: raw.goals || {},
      events: Array.isArray(raw.events) ? raw.events : []
    };
  }
  return {
    ...base,
    archives: raw.archives && typeof raw.archives === "object" ? raw.archives : {},
    archiveAttempts: raw.archiveAttempts && typeof raw.archiveAttempts === "object" ? raw.archiveAttempts : {},
    goals: raw.goals || {},
    events: Array.isArray(raw.events) ? raw.events : []
  };
}

function loadLearningState() {
  try {
    const text = localStorage.getItem(STORAGE_KEY);
    if (!text) return;
    learningState = migrateState(JSON.parse(text));
  } catch {
    learningState = createEmptyLearningState();
  }
}

function computeGoalAccuracy(item) {
  const total = item.results.length;
  if (!total) return 0;
  const ok = item.results.filter((r) => r.correct).length;
  return ok / total;
}

function getAllGoalsFlat() {
  const topics = ["algebra", "funktionen", "geometrie", "trigonometrie"];
  const out = [];
  topics.forEach((topic) => {
    (GOAL_DEFS[topic] || []).forEach((goal) => out.push({ topic, goal }));
  });
  return out;
}

function getGoalById(goalId) {
  const all = getAllGoalsFlat();
  return all.find((x) => x.goal.id === goalId) || null;
}

function isAdaptiveGoal(goal) {
  return !!(goal && Array.isArray(goal.variants) && goal.variants.length);
}

function getDefaultVariant(goal) {
  return isAdaptiveGoal(goal) ? goal.variants[0] : null;
}

function syntheticPlaneMeasurementModes(variantId) {
  if (variantId === "similarity") {
    return [
      { id: "length", label: "Ähnlichkeit (Längen)", theoryFormula: "\\(L'=kL\\)" },
      { id: "area", label: "Ähnlichkeit (Flächen)", theoryFormula: "\\(A'=k^2A\\)" }
    ];
  }
  if (variantId === "rect_triangle") {
    return [
      { id: "area", label: "Fläche", theoryFormula: "\\(A_{Rest}=A_{Rechteck}-A_{Dreieck}\\)" },
      { id: "perimeter", label: "Umfang", theoryFormula: "\\(U=2(w+h)\\)" }
    ];
  }
  if (variantId === "rectangle") {
    return [
      { id: "perimeter", label: "Umfang", theoryFormula: "\\(U=2(a+b)\\)" },
      { id: "area", label: "Fläche", theoryFormula: "\\(A=a\\cdot b\\)" }
    ];
  }
  if (variantId === "triangle") {
    return [
      { id: "perimeter", label: "Umfang", theoryFormula: "\\(U=a+b+c\\)" },
      { id: "area", label: "Fläche", theoryFormula: "\\(A=\\tfrac{1}{2}gh\\)" }
    ];
  }
  if (variantId === "circle") {
    return [
      { id: "perimeter", label: "Umfang", theoryFormula: "\\(U=2\\pi r\\)" },
      { id: "area", label: "Fläche", theoryFormula: "\\(A=\\pi r^2\\)" }
    ];
  }
  if (variantId === "composite") {
    return [
      { id: "perimeter", label: "Umfang", theoryFormula: "\\(U=2w+2h-2r+\\pi r\\)" },
      { id: "area", label: "Fläche", theoryFormula: "\\(A=w\\cdot h+\\tfrac{1}{2}\\pi r^2\\)" }
    ];
  }
  return [
    { id: "perimeter", label: "Umfang" },
    { id: "area", label: "Fläche" }
  ];
}

function getVariantModes(goal, variant) {
  if (!variant) return [];
  if (Array.isArray(variant.modes) && variant.modes.length) return variant.modes;
  if (goal?.id === "plane_measurement") return syntheticPlaneMeasurementModes(variant.id);
  return [];
}

function getVariantById(goal, variantId) {
  if (!isAdaptiveGoal(goal)) return null;
  return goal.variants.find((variant) => variant.id === variantId) || null;
}

function getDefaultMode(goal, variant) {
  const modes = getVariantModes(goal, variant);
  return modes.length ? modes[0] : null;
}

function getModeById(goal, variant, modeId) {
  const modes = getVariantModes(goal, variant);
  return modes.find((mode) => mode.id === modeId) || null;
}

function getActiveGoalContent(goal, stateEntry) {
  if (!isAdaptiveGoal(goal)) {
    return { variant: null, mode: null, content: goal };
  }
  const fallbackVariant = getDefaultVariant(goal);
  const variant = getVariantById(goal, stateEntry?.activeVariantId) || fallbackVariant;
  const fallbackMode = getDefaultMode(goal, variant);
  const mode = getModeById(goal, variant, stateEntry?.activeModeId) || fallbackMode;
  const content = mode ? { ...variant, ...mode, source: mode.source || variant.source } : variant;
  return { variant, mode, content };
}

function listAdaptiveLeafContents(goal) {
  if (!isAdaptiveGoal(goal)) return [goal];
  return goal.variants.flatMap((variant) => {
    const modes = getVariantModes(goal, variant);
    if (modes.length) {
      return modes.map((mode) => ({ ...variant, ...mode, source: mode.source || variant.source }));
    }
    return [variant];
  });
}

function archivePracticeCount(goalId) {
  const links = archiveLinksForGoal(goalId);
  return links.reduce((sum, archiveId) => sum + (learningState.archiveAttempts?.[archiveId] || 0), 0);
}

function hasTransferEvidence(goalId, st) {
  return (st.exampleUseCount || 0) > 0 || archivePracticeCount(goalId) > 0;
}

function requirementStatus(req) {
  let touched = false;
  let covered = true;
  req.goalIds.forEach((goalId) => {
    const g = getGoalById(goalId);
    const st = ensureGoalState(goalId, g ? g.topic : req.topic);
    const correctAttempts = st.results.filter((r) => r.correct).length;
    const accuracy = st.results.length ? correctAttempts / st.results.length : 0;
    const hasMediumPlus = st.results.some((r) => r.correct && (r.difficulty === "medium" || r.difficulty === "hard"));
    const scorecard = goalCoverageScore(goalId);
    const thisCovered = st.theoryChecked
      && st.results.length >= 3
      && accuracy >= 0.67
      && hasMediumPlus
      && hasTransferEvidence(goalId, st)
      && scorecard.ready;
    const thisTouched = st.theoryChecked || st.results.length > 0 || st.randomCount > 0 || (st.exampleUseCount || 0) > 0;
    touched = touched || thisTouched;
    covered = covered && thisCovered;
  });
  if (covered) return "abgedeckt";
  if (touched) return "in Arbeit";
  return "offen";
}

function nextOpenRequirement() {
  return REQUIREMENTS_PATH.find((req) => requirementStatus(req) !== "abgedeckt") || null;
}

function randomArchiveExercise(id) {
  const rnd = (min, max) => min + Math.random() * (max - min);
  if (id === "B01") {
    const a = Math.round(rnd(-9, 9));
    const b = Math.round(rnd(-9, 9));
    return {
      q: `Berechne ${a} + (${b})`,
      qLatex: `\\[${a}+(${b})\\]`,
      a: `${a + b}`,
      aLatex: `\\(${a + b}\\)`
    };
  }
  if (id === "B02") {
    const z = Math.round(rnd(2, 9));
    const n = Math.round(rnd(2, 9));
    return {
      q: `Kürze den Bruch ${2 * z}/${2 * n}`,
      qLatex: `\\[\\frac{${2 * z}}{${2 * n}}\\]`,
      a: `${z}/${n}`,
      aLatex: `\\(\\frac{${z}}{${n}}\\)`
    };
  }
  if (id === "B03") {
    const a = Math.round(rnd(2, 5));
    const m = Math.round(rnd(2, 4));
    const n = Math.round(rnd(2, 4));
    return {
      q: `Vereinfache ${a}^${m} · ${a}^${n}`,
      qLatex: `\\[${a}^{${m}} \\cdot ${a}^{${n}}\\]`,
      a: `${a}^${m + n}`,
      aLatex: `\\(${a}^{${m + n}}\\)`
    };
  }
  if (id === "B04") {
    const x = Math.round(rnd(-6, 6));
    const a = Math.round(rnd(2, 5));
    const b = Math.round(rnd(-5, 5));
    return {
      q: `Löse ${a}x${b >= 0 ? "+" : ""}${b}=${a * x + b}`,
      qLatex: `\\[${a}x${b >= 0 ? "+" : ""}${b}=${a * x + b}\\]`,
      a: `x=${x}`,
      aLatex: `\\(x=${x}\\)`
    };
  }
  if (id === "B05") {
    const x = Math.round(rnd(-3, 3));
    const y = Math.round(rnd(-3, 3));
    return {
      q: `Setze ein: x=${x}, y=${y}. Berechne 2x+3y.`,
      qLatex: `\\[x=${x},\\;y=${y},\\;2x+3y\\]`,
      a: `${2 * x + 3 * y}`,
      aLatex: `\\(${2 * x + 3 * y}\\)`
    };
  }
  if (id === "B06") {
    const x1 = Math.round(rnd(-5, 1));
    const x2 = Math.round(rnd(2, 6));
    const b = -(x1 + x2);
    const c = x1 * x2;
    return {
      q: `Bestimme Nullstellen von x^2${b >= 0 ? "+" : ""}${b}x${c >= 0 ? "+" : ""}${c}=0`,
      qLatex: `\\[x^2${b >= 0 ? "+" : ""}${b}x${c >= 0 ? "+" : ""}${c}=0\\]`,
      a: `x₁=${x1}, x₂=${x2}`,
      aLatex: `\\(x_1=${x1},\\;x_2=${x2}\\)`
    };
  }
  if (id === "B07") {
    const m = Math.round(rnd(-3, 4));
    const q = Math.round(rnd(-5, 5));
    return {
      q: `Bei y=${m}x${q >= 0 ? "+" : ""}${q}: y für x=2?`,
      qLatex: `\\[y=${m}x${q >= 0 ? "+" : ""}${q},\\;x=2\\]`,
      a: `${m * 2 + q}`,
      aLatex: `\\(${m * 2 + q}\\)`
    };
  }
  if (id === "B09") {
    const k = rnd(1.2, 2.8);
    const l = Math.round(rnd(3, 10));
    if (Math.random() < 0.5) {
      return {
        q: `Skaliere Länge ${l} mit k=${k.toFixed(2)}.`,
        qLatex: `\\[L'=k\\cdot L=${k.toFixed(2)}\\cdot ${l}\\]`,
        a: `L'=${(k * l).toFixed(2)}`,
        aLatex: `\\(L'=${(k * l).toFixed(2)}\\)`
      };
    }
    const A = Math.round(rnd(8, 40));
    return {
      q: `Skaliere Fläche ${A} mit k=${k.toFixed(2)}.`,
      qLatex: `\\[A'=k^2\\cdot A=${k.toFixed(2)}^2\\cdot ${A}\\]`,
      a: `A'=${(k * k * A).toFixed(2)}`,
      aLatex: `\\(A'=${(k * k * A).toFixed(2)}\\)`
    };
  }
  if (id === "B10") {
    const det = Math.round(rnd(-4, 4));
    if (det === 0) {
      return {
        q: "det(A)=0. Ist das LGS sicher eindeutig lösbar?",
        qLatex: "\\[\\det(A)=0\\]",
        a: "Nein. det=0 bedeutet: nicht eindeutig (keine oder unendlich viele Lösungen).",
        aLatex: "\\(\\det(A)=0 \\Rightarrow \\text{nicht eindeutig}\\)"
      };
    }
    return {
      q: `det(A)=${det}. Was folgt für die Eindeutigkeit?`,
      qLatex: `\\[\\det(A)=${det}\\]`,
      a: "Eindeutige Lösung, weil det(A) ≠ 0.",
      aLatex: `\\(\\det(A)=${det} \\neq 0 \\Rightarrow \\text{eindeutige Lösung}\\)`
    };
  }
  const a = Math.round(rnd(4, 10));
  const b = Math.round(rnd(4, 10));
  const g = Math.round(rnd(35, 100));
  const area = 0.5 * a * b * Math.sin((Math.PI * g) / 180);
  return {
    q: `Dreieck: a=${a}, b=${b}, gamma=${g}°. Fläche?`,
    qLatex: `\\[A=\\frac{1}{2}ab\\sin(\\gamma),\\;a=${a},\\;b=${b},\\;\\gamma=${g}^\\circ\\]`,
    a: `A≈${area.toFixed(2)}`,
    aLatex: `\\(A\\approx ${area.toFixed(2)}\\)`
  };
}

function archiveLinksForGoal(goalId) {
  const map = {
    lgs2: ["B01", "B04", "B05"],
    lgs3: ["B04", "B05", "B10"],
    quad_methods: ["B01", "B06"],
    pow_log: ["B03"],
    exp_log_eq: ["B03", "B07"],
    interest: ["B01", "B07"],
    lin_quad_plot: ["B07"],
    eq_from_points: ["B04", "B07"],
    parabola_props: ["B06", "B07"],
    expo_growth: ["B07"],
    triangle_lines: ["B01", "B08"],
    area_composite: ["B01", "B08"],
    similarity: ["B08", "B09"],
    solids: ["B01", "B08"],
    cut_compose: ["B01", "B08", "B09"],
    any_triangle: ["B03", "B08"],
    space_angle: ["B08", "B10"]
  };
  return map[goalId] || ["B01"];
}

function linkGlossaryTerms(html) {
  // Sort terms longest-first so overlapping terms match correctly
  const terms = GLOSSARY_TERMS.map(e => e.term).sort((a, b) => b.length - a.length);
  // Split on HTML tags and LaTeX \(...\) / \[...\] to avoid replacing inside math/markup
  const parts = html.split(/(<[^>]+>|\\\([^)]*\\\)|\\\[[^\]]*\\\])/g);
  return parts.map((part, i) => {
    if (i % 2 === 1) return part; // tag or LaTeX block – pass through unchanged
    let p = part;
    terms.forEach(term => {
      const esc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      p = p.replace(new RegExp(esc, 'g'),
        `<button type="button" class="glossary-link" data-term="${term}">${term}</button>`);
    });
    return p;
  }).join('');
}

function archiveTheoryHtml(archiveId, fallbackSummary) {
  const info = ARCHIVE_THEORY[archiveId];
  if (!info) return `<p>${fallbackSummary}</p>`;
  const steps = info.steps.map((step, index) => `${index + 1}) ${step}`).join("<br>");
  const result = [
    `<strong>Definition:</strong> ${info.definition}`,
    `<strong>Schrittfolge:</strong><br>${steps}`,
    `<strong>Typische Fehler:</strong> ${info.mistakes.join("; ")}`,
    `<strong>Edge Cases:</strong> ${info.edge.join("; ")}`,
    `<strong>Kurzbeispiel:</strong> ${info.worked}`
  ].join("<br><br>");
  return linkGlossaryTerms(result);
}

function goalLinksForArchive(archiveId) {
  return getAllGoalsFlat().filter(({ goal }) => archiveLinksForGoal(goal.id).includes(archiveId));
}

function exerciseContentHtml(item) {
  if (!item) return "";
  const answerText = item.a ?? item.s ?? "";
  const answerLatex = item.aLatex ?? item.sLatex ?? "";
  const questionHtml = item.qLatex
    ? `${item.q}<div class="formula-latex">${item.qLatex}</div>`
    : item.q;
  const answerHtml = answerLatex
    ? `${answerText}<div class="formula-latex">${answerLatex}</div>`
    : answerText;
  return `<strong>Aufgabe:</strong> ${questionHtml}<br><strong>Lösung:</strong> ${answerHtml}`;
}

function renderArchivePanel() {
  const target = document.getElementById("archiveGrid");
  if (!target) return;
  target.innerHTML = BASICS_ARCHIVE
    .map((item) => {
      const enhancement = ARCHIVE_ENHANCEMENTS[item.id] || {};
      const archiveState = ensureArchiveState(item.id);
      const relatedGoals = (enhancement.relatedGoalIds || [])
        .map((goalId) => getGoalById(goalId))
        .filter(Boolean);
      const relatedGoalButtons = relatedGoals
        .map(({ topic, goal }) => `<button type="button" class="archive-link-btn" data-goal-jump="${goal.id}" data-topic-jump="${topic}">${goal.title}</button>`)
        .join(" ");
      return `
        <div class="archive-card" id="archive-${item.id}">
          <div class="archive-head">
            <div>
              <h3>${item.title}</h3>
              <p class="archive-meta">Niveau: ${item.level}</p>
            </div>
            <label class="archive-theory-check">
              <input type="checkbox" data-archive-theory="${item.id}" ${archiveState.theoryChecked ? "checked" : ""}> Theorie gelesen
            </label>
          </div>
          <p class="archive-summary">${item.summary}</p>
          <p class="archive-meta">Quelle: ${item.source}</p>
          <div class="archive-tags">${(enhancement.tags || []).map((tag) => `<span>${tag}</span>`).join("")}</div>
          <details class="archive-detail">
            <summary>Theorie</summary>
            <div class="archive-detail-content">${archiveTheoryHtml(item.id, item.summary)}</div>
          </details>
          <details class="archive-detail">
            <summary>So hilft dir dieser Block</summary>
            <div class="archive-detail-content">
              <p>${enhancement.operatorGuide || "Nutze diesen Block, um fehlende Grundlagen ruhig und Schritt für Schritt nachzuholen."}</p>
              <div class="archive-example-box">
                <p class="archive-example-title">${enhancement.exampleTitle || "Alltagsbeispiel"}</p>
                <p>${enhancement.exampleText || "Dieser Baustein unterstützt dich bei typischen Anwendungen aus Schule und Alltag."}</p>
              </div>
            </div>
          </details>
          <details class="archive-detail">
            <summary>Passt besonders zu diesen Lernzielen</summary>
            <div class="archive-detail-content">
              <div class="archive-goal-links">${relatedGoalButtons || "Dieser Grundlagenblock wird bald noch mit passenden Lernzielen verknuepft."}</div>
            </div>
          </details>
          <div class="archive-status-line">Theorie: ${archiveState.theoryChecked ? "gelesen" : "offen"} | Zusatzübungen: ${learningState.archiveAttempts?.[item.id] || 0}</div>
          <button type="button" data-archive-ex="${item.id}">Zusatzübung generieren</button>
          <div class="archive-exercise" data-archive-box="${item.id}">${archiveState.currentExercise ? exerciseContentHtml(archiveState.currentExercise) : "Noch keine Zusatzübung generiert. Starte mit dem Button oben, wenn du direkt üben willst."}</div>
        </div>
      `;
    })
    .join("");
  typeset(target);

  target.querySelectorAll("[data-archive-theory]").forEach((input) => {
    input.addEventListener("change", () => {
      const archiveId = input.dataset.archiveTheory;
      const archiveState = ensureArchiveState(archiveId);
      archiveState.theoryChecked = input.checked;
      archiveState.lastViewedAt = new Date().toISOString();
      pushLearningEvent("ARCHIVE_THEORY_TOGGLED", archiveId, { checked: input.checked });
      saveLearningState();
      renderArchivePanel();
    });
  });

  target.querySelectorAll("[data-goal-jump]").forEach((btn) => {
    btn.addEventListener("click", () => {
      showTopic(btn.dataset.topicJump);
      const anchor = document.getElementById(`goal-${btn.dataset.goalJump}`);
      if (anchor) anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  target.querySelectorAll("[data-archive-ex]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.archiveEx;
      const archiveState = ensureArchiveState(id);
      archiveState.attemptCount += 1;
      archiveState.lastAttemptAt = new Date().toISOString();
      archiveState.currentExercise = randomArchiveExercise(id);
      learningState.archiveAttempts[id] = (learningState.archiveAttempts[id] || 0) + 1;
      pushLearningEvent("ARCHIVE_EXERCISE_GENERATED", id, { count: learningState.archiveAttempts[id] });
      saveLearningState();
      renderArchivePanel();
      refreshLearningUI();
    });
  });
}

function renderGlossaryPanel() {
  const target = document.getElementById("glossaryGrid");
  if (!target) return;
  const rows = [...GLOSSARY_TERMS]
    .sort((a, b) => a.term.localeCompare(b.term, "de"))
    .map((entry) => `
      <div class="glossary-card" id="glossary-card-${entry.term.replace(/[\s\/()]/g,'-')}">
        <h3>${entry.term}</h3>
        <p class="glossary-symbol">Symbol: <strong>${entry.symbol}</strong></p>
        <p>${entry.definition}</p>
      </div>
    `)
    .join("");
  target.innerHTML = rows;
  typeset(target);
}

function computeAnalytics() {
  const all = getAllGoalsFlat();
  let checkedTheory = 0;
  let totalAttempts = 0;
  let totalCorrect = 0;
  const topicStats = {};
  const topicGoalTotals = {};

  all.forEach(({ topic, goal }) => {
    const item = ensureGoalState(goal.id, topic);
    topicGoalTotals[topic] = (topicGoalTotals[topic] || 0) + 1;
    if (item.theoryChecked) checkedTheory += 1;
    totalAttempts += item.results.length;
    totalCorrect += item.results.filter((r) => r.correct).length;
    if (!topicStats[topic]) topicStats[topic] = { attempts: 0, correct: 0, randoms: 0, theory: 0, coveredGoals: 0 };
    topicStats[topic].attempts += item.results.length;
    topicStats[topic].correct += item.results.filter((r) => r.correct).length;
    topicStats[topic].randoms += item.randomCount;
    topicStats[topic].theory += item.theoryChecked ? 1 : 0;
    topicStats[topic].coveredGoals += item.results.length > 0 ? 1 : 0;
  });

  Object.keys(topicStats).forEach((topic) => {
    const t = topicStats[topic];
    const goalTotal = topicGoalTotals[topic] || 1;
    t.coverage = t.coveredGoals / goalTotal;
    t.accuracy = t.attempts ? t.correct / t.attempts : 0;
    t.theoryShare = t.theory / goalTotal;
    t.mastery = 0.4 * t.coverage + 0.4 * t.accuracy + 0.2 * t.theoryShare;
  });

  const topicMasteryValues = Object.values(topicStats).map((t) => t.mastery);
  const overallCoverage = all.length ? all.filter(({ topic, goal }) => ensureGoalState(goal.id, topic).results.length > 0).length / all.length : 0;
  const overallTheory = all.length ? checkedTheory / all.length : 0;
  const overallMastery = topicMasteryValues.length
    ? topicMasteryValues.reduce((a, b) => a + b, 0) / topicMasteryValues.length
    : 0;

  const weaknesses = all
    .map(({ topic, goal }) => {
      const item = ensureGoalState(goal.id, topic);
      const score = item.results.length ? computeGoalAccuracy(item) : -1;
      const coveragePenalty = item.results.length === 0 ? 0.2 : 0;
      return { goal, topic, score: score - coveragePenalty, attempts: item.results.length };
    })
    .sort((a, b) => a.score - b.score || a.attempts - b.attempts)
    .slice(0, 3);

  const strengths = all
    .map(({ topic, goal }) => {
      const item = ensureGoalState(goal.id, topic);
      return { goal, topic, score: computeGoalAccuracy(item), attempts: item.results.length };
    })
    .filter((x) => x.attempts >= 2)
    .sort((a, b) => b.score - a.score || b.attempts - a.attempts)
    .slice(0, 3);

  const reqCovered = REQUIREMENTS_PATH.filter((r) => requirementStatus(r) === "abgedeckt").length;

  return {
    totalGoals: all.length,
    checkedTheory,
    totalAttempts,
    totalCorrect,
    overallAccuracy: totalAttempts ? totalCorrect / totalAttempts : 0,
    overallCoverage,
    overallTheory,
    overallMastery,
    requirementCovered: reqCovered,
    requirementTotal: REQUIREMENTS_PATH.length,
    topicStats,
    weaknesses,
    strengths
  };
}

function recommendNextGoal() {
  const req = nextOpenRequirement();
  if (!req) return null;
  const firstGoalId = req.goalIds[0];
  const goalRef = getGoalById(firstGoalId);
  if (!goalRef) return null;
  return { topic: goalRef.topic, goal: goalRef.goal, requirement: req };
}

function renderProgressList() {
  if (!progressList) return;
  const analytics = computeAnalytics();
  progressList.innerHTML = "";
  const lines = [
    `Prüfungsanforderungen abgedeckt: ${analytics.requirementCovered}/${analytics.requirementTotal}`,
    `Theorie abgehakt: ${analytics.checkedTheory}/${analytics.totalGoals}`,
    `Bewertete Versuche: ${analytics.totalAttempts}`,
    `Abdeckung: ${(analytics.overallCoverage * 100).toFixed(1)}%`,
    `Mastery-Skala: ${(analytics.overallMastery * 100).toFixed(1)}%`
  ];
  const rec = recommendNextGoal();
  if (rec) lines.push(`Empfohlen: ${rec.requirement.id} - ${rec.requirement.text}`);
  lines.forEach((txt) => {
    const li = document.createElement("li");
    li.textContent = txt;
    progressList.appendChild(li);
  });
}

function renderOverviewPanel() {
  const target = document.getElementById("overviewCards");
  const recBox = document.getElementById("recommendationBox");
  if (!target || !recBox) return;
  const analytics = computeAnalytics();
  const metrics = [
    { title: "Prüfungsabdeckung", value: `${analytics.requirementCovered}/${analytics.requirementTotal}` },
    { title: "Theorie-Fortschritt", value: `${analytics.checkedTheory}/${analytics.totalGoals}` },
    { title: "Bewertete Aufgaben", value: `${analytics.totalAttempts}` },
    { title: "Abdeckung Unterthemen", value: `${(analytics.overallCoverage * 100).toFixed(1)}%` },
    { title: "Mastery-Skala", value: `${(analytics.overallMastery * 100).toFixed(1)}%` }
  ];
  target.innerHTML = metrics
    .map((m) => `<div class="overview-metric"><h3>${m.title}</h3><p>${m.value}</p></div>`)
    .join("");

  const strengths = analytics.strengths.map((x) => x.goal.title).join(", ") || "Noch keine stabile Stärke erkennbar.";
  const weaknesses = analytics.weaknesses.map((x) => x.goal.title).join(", ") || "Noch keine Schwächen erkennbar.";
  const rec = recommendNextGoal();
  const topics = ["algebra", "funktionen", "geometrie", "trigonometrie"];
  const scaleRows = topics
    .map((topic) => {
      const item = analytics.topicStats[topic] || { mastery: 0 };
      const pct = (item.mastery * 100).toFixed(1);
      return `<div class="topic-progress-row"><span>${TOPIC_LABELS[topic]}</span><div class="topic-progress-bar"><div style="width:${pct}%"></div></div><strong>${pct}%</strong></div>`;
    })
    .join("");
  recBox.innerHTML = `
    <h3>Nächste Prüfungsanforderung</h3>
    <p><strong>Empfehlung:</strong> ${rec ? `${rec.requirement.id} - ${rec.requirement.text}` : "Alle Anforderungen abgedeckt"}</p>
      <p><strong>Warum diese Empfehlung?</strong> Du arbeitest damit entlang der Prüfungsanforderungen in einer sinnvollen Reihenfolge. Wenn du etwas wiederholen oder vorziehen willst, kannst du trotzdem jederzeit frei springen.</p>
    <p><strong>Stärken:</strong> ${strengths}</p>
    <p><strong>Schwächen:</strong> ${weaknesses}</p>
    <div class="topic-progress-scale">${scaleRows}</div>
  `;
}

function renderStatsPanel() {
  const canvas = document.getElementById("statsCanvas");
  const table = document.getElementById("statsTable");
  if (!canvas || !table) return;
  const analytics = computeAnalytics();
  prepareCanvas(canvas, 280, 980);
  const size = getLogicalCanvasSize(canvas);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, size.width, size.height);
  ctx.fillStyle = "#f8fbff";
  ctx.fillRect(0, 0, size.width, size.height);

  const topics = ["algebra", "funktionen", "geometrie", "trigonometrie"];
  const barW = Math.max(78, Math.min(120, Math.floor((size.width - 120) / topics.length) - 16));
  const step = barW + 26;
  const startX = 56;
  const baseY = size.height - 42;
  topics.forEach((topic, idx) => {
    const item = analytics.topicStats[topic] || { attempts: 0, correct: 0, randoms: 0, mastery: 0, coverage: 0 };
    const h = item.mastery * (size.height - 110);
    const x = startX + idx * step;
    ctx.fillStyle = "#7fb0e3";
    ctx.fillRect(x, baseY - h, barW, h);
    ctx.fillStyle = "#17385f";
    ctx.font = "12px Arial";
    ctx.fillText(TOPIC_LABELS[topic], x, baseY + 18);
    ctx.fillText(`${(item.mastery * 100).toFixed(0)}%`, x + 22, baseY - h - 8);
  });

  const rows = topics
    .map((topic) => {
      const item = analytics.topicStats[topic] || { attempts: 0, correct: 0, randoms: 0, mastery: 0, coverage: 0 };
      const acc = item.attempts ? (item.correct / item.attempts) * 100 : 0;
      return `<tr><td>${TOPIC_LABELS[topic]}</td><td>${item.attempts}</td><td>${acc.toFixed(1)}%</td><td>${(item.coverage * 100).toFixed(1)}%</td><td>${(item.mastery * 100).toFixed(1)}%</td><td>${item.randoms}</td></tr>`;
    })
    .join("");

  const reqRows = REQUIREMENTS_PATH
    .map((req) => {
      let attempts = 0;
      let correct = 0;
      let theoryCheckedAll = true;
      let transferAll = true;

      req.goalIds.forEach((goalId) => {
        const ref = getGoalById(goalId);
        const st = ensureGoalState(goalId, ref ? ref.topic : req.topic);
        attempts += st.results.length;
        correct += st.results.filter((r) => r.correct).length;
        theoryCheckedAll = theoryCheckedAll && !!st.theoryChecked;
        transferAll = transferAll && hasTransferEvidence(goalId, st);
      });

      const acc = attempts ? (correct / attempts) * 100 : 0;
      const learningStatus = requirementStatus(req);
      const quality = requirementDidacticQuality(req);

      let competency = "offen";
      if (learningStatus === "abgedeckt" && quality.pedagogicalStatus === "voll") {
        competency = "sicher";
      } else if (attempts > 0 || theoryCheckedAll || transferAll) {
        competency = "im Aufbau";
      }

      return `<tr>
        <td>${req.id}</td>
        <td>${req.text}</td>
        <td>${attempts}</td>
        <td>${acc.toFixed(1)}%</td>
        <td>${theoryCheckedAll ? "ja" : "nein"}</td>
        <td>${learningStatus}</td>
        <td>${competency}</td>
      </tr>`;
    })
    .join("");

  table.innerHTML = `
    <h3>Statistik pro Thema</h3>
    <table class="stats-table">
      <thead><tr><th>Thema</th><th>Bewertungen</th><th>Trefferquote</th><th>Abdeckung</th><th>Mastery</th><th>Sandbox-Aufgaben</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <h3>Kompetenz pro Prüfungsanforderung</h3>
    <table class="stats-table">
      <thead><tr><th>ID</th><th>Anforderung</th><th>Versuche</th><th>Trefferquote</th><th>Theorie geprüft</th><th>Lernstatus</th><th>Kompetenz</th></tr></thead>
      <tbody>${reqRows}</tbody>
    </table>
    <p>Letztes Update: ${new Date().toLocaleString("de-DE")}</p>
  `;
}

function goalDidacticQuality(goalId) {
  const ref = getGoalById(goalId);
  if (!ref) {
    return {
      theoryComplete: false,
      coreExerciseComplete: false,
      transferComplete: false,
      visualizationComplete: false,
      pitfallsComplete: false,
      sourceComplete: false,
      score: 0,
      maxScore: 5,
      scoreReady: false,
      notes: `Goal ${goalId} nicht gefunden`
    };
  }
  const goal = ref.goal;
  const didactic = DIDACTIC_THEORY[goalId];
  const leaves = listAdaptiveLeafContents(goal);
  const theoryComplete = isAdaptiveGoal(goal)
    ? leaves.every((leaf) => !!(leaf.didactic
      && leaf.didactic.definition
      && Array.isArray(leaf.didactic.steps) && leaf.didactic.steps.length >= 3
      && Array.isArray(leaf.didactic.mistakes) && leaf.didactic.mistakes.length >= 2
      && Array.isArray(leaf.didactic.edge) && leaf.didactic.edge.length >= 2
      && leaf.didactic.worked))
    : !!(didactic
      && didactic.definition
      && Array.isArray(didactic.steps) && didactic.steps.length >= 3
      && Array.isArray(didactic.mistakes) && didactic.mistakes.length >= 2
      && Array.isArray(didactic.edge) && didactic.edge.length >= 2
      && didactic.worked);
  const coreExerciseComplete = isAdaptiveGoal(goal)
    ? leaves.every((leaf) => Array.isArray(leaf.controls) && leaf.controls.length > 0 && typeof leaf.equation === "function")
    : Array.isArray(goal.controls) && goal.controls.length > 0 && typeof goal.equation === "function";
  const transferByExamples = isAdaptiveGoal(goal)
    ? leaves.every((leaf) => Array.isArray(leaf.examples) && leaf.examples.length > 0)
    : Array.isArray(goal.examples) && goal.examples.length > 0;
  const transferByArchive = archiveLinksForGoal(goalId).length >= 2;
  const transferComplete = transferByExamples || transferByArchive;
  const visualizationComplete = isAdaptiveGoal(goal)
    ? leaves.every((leaf) => Array.isArray(leaf.controls) && leaf.controls.length > 0 && typeof leaf.equation === "function")
    : (goal.noCanvas
      ? transferByExamples
      : (Array.isArray(goal.controls) && goal.controls.length > 0 && typeof goal.equation === "function"));
  const pitfallsComplete = isAdaptiveGoal(goal)
    ? leaves.every((leaf) => !!(leaf.didactic
      && Array.isArray(leaf.didactic.mistakes) && leaf.didactic.mistakes.length >= 2
      && Array.isArray(leaf.didactic.edge) && leaf.didactic.edge.length >= 2))
    : !!(didactic
      && Array.isArray(didactic.mistakes) && didactic.mistakes.length >= 2
      && Array.isArray(didactic.edge) && didactic.edge.length >= 2);
  const sourceComplete = isAdaptiveGoal(goal)
    ? leaves.every((leaf) => !!leaf.source)
    : !!(goal.source
      && Array.isArray(goal.sourceRefs)
      && goal.sourceRefs.length >= 2);

  const scorecard = {
    theory: theoryComplete,
    coreExercise: coreExerciseComplete,
    transfer: transferComplete,
    visualization: visualizationComplete,
    pitfalls: pitfallsComplete
  };
  const score = Object.values(scorecard).filter(Boolean).length;

  const missing = [];
  if (!theoryComplete) missing.push("Theorie");
  if (!coreExerciseComplete) missing.push("Kernübung");
  if (!transferComplete) missing.push("Transfer");
  if (!visualizationComplete) missing.push("Visualisierung");
  if (!pitfallsComplete) missing.push("Fehlerbilder");
  if (!sourceComplete) missing.push("Quellen");

  return {
    theoryComplete,
    coreExerciseComplete,
    transferComplete,
    visualizationComplete,
    pitfallsComplete,
    sourceComplete,
    score,
    maxScore: 5,
    scoreReady: score >= 4,
    notes: missing.length ? `Fehlt: ${missing.join(", ")}` : "vollständig"
  };
}

function goalCoverageScore(goalId) {
  const quality = goalDidacticQuality(goalId);
  return {
    score: quality.score,
    maxScore: quality.maxScore,
    ready: quality.scoreReady,
    notes: quality.notes
  };
}

function requirementLearningGate(req) {
  const missing = [];
  req.goalIds.forEach((goalId) => {
    const ref = getGoalById(goalId);
    const st = ensureGoalState(goalId, ref ? ref.topic : req.topic);
    const correctAttempts = st.results.filter((r) => r.correct).length;
    const accuracy = st.results.length ? correctAttempts / st.results.length : 0;
    const hasMediumPlus = st.results.some((r) => r.correct && (r.difficulty === "medium" || r.difficulty === "hard"));
    const goalMissing = [];
    if (!st.theoryChecked) goalMissing.push("Theoriecheck");
    if (st.results.length < 3) goalMissing.push("mind. 3 Übungen");
    if (accuracy < 0.67) goalMissing.push("Trefferquote >= 67%");
    if (!hasMediumPlus) goalMissing.push("mind. 1 Medium/Hard-Treffer");
    if (!hasTransferEvidence(goalId, st)) goalMissing.push("Transferbeleg");
    if (goalMissing.length) missing.push(`${goalId}: ${goalMissing.join(", ")}`);
  });
  return {
    ready: missing.length === 0,
    notes: missing.length ? missing.join(" | ") : "Lerngate erfüllt"
  };
}

function requirementDidacticQuality(req) {
  const perGoal = req.goalIds.map((goalId) => ({ goalId, quality: goalDidacticQuality(goalId) }));
  const theoryComplete = perGoal.every((x) => x.quality.theoryComplete);
  const coreExerciseComplete = perGoal.every((x) => x.quality.coreExerciseComplete);
  const transferComplete = perGoal.every((x) => x.quality.transferComplete);
  const visualizationComplete = perGoal.every((x) => x.quality.visualizationComplete);
  const pitfallsComplete = perGoal.every((x) => x.quality.pitfallsComplete);
  const sourceComplete = perGoal.every((x) => x.quality.sourceComplete);
  const scoreReady = perGoal.every((x) => x.quality.scoreReady);
  const allComplete = theoryComplete && coreExerciseComplete && transferComplete && visualizationComplete && pitfallsComplete && sourceComplete && scoreReady;
  const anyProgress = perGoal.some((x) => x.quality.theoryComplete || x.quality.coreExerciseComplete || x.quality.transferComplete || x.quality.sourceComplete);
  const pedagogicalStatus = allComplete ? "voll" : (anyProgress ? "teilweise" : "fehlt");
  const scoreSummary = perGoal.map((x) => `${x.goalId}:${x.quality.score}/${x.quality.maxScore}`).join(" | ");
  const detailNotes = perGoal
    .filter((x) => x.quality.notes !== "vollständig")
    .map((x) => `${x.goalId}: ${x.quality.notes}`)
    .join(" | ");
  const notes = [
    `Gate: ${scoreReady ? "4/5 erreicht" : "unter 4/5"}`,
    `Scores: ${scoreSummary}`,
    detailNotes || "vollständig"
  ].join(" | ");

  return {
    theoryComplete,
    coreExerciseComplete,
    transferComplete,
    visualizationComplete,
    pitfallsComplete,
    sourceComplete,
    scoreReady,
    scoreSummary,
    pedagogicalStatus,
    notes
  };
}

function renderCoverageMatrix() {
  const host = document.getElementById("coverageMatrix");
  if (!host) return;
  const readyCount = REQUIREMENTS_PATH.filter((req) => requirementDidacticQuality(req).scoreReady).length;
  const rows = REQUIREMENTS_PATH
    .map((req) => {
      const learningStatus = requirementStatus(req);
      const quality = requirementDidacticQuality(req);
      const learningGate = requirementLearningGate(req);
      const mapped = req.goalIds.join(", ");
      return `<tr>
        <td>${req.id}</td>
        <td>${req.area}</td>
        <td>${req.subarea}</td>
        <td>${req.text}</td>
        <td>${mapped}</td>
        <td>${quality.scoreSummary}</td>
        <td>${quality.theoryComplete ? "ja" : "nein"}</td>
        <td>${quality.coreExerciseComplete ? "ja" : "nein"}</td>
        <td>${quality.transferComplete ? "ja" : "nein"}</td>
        <td>${quality.visualizationComplete ? "ja" : "nein"}</td>
        <td>${quality.pitfallsComplete ? "ja" : "nein"}</td>
        <td>${quality.sourceComplete ? "ja" : "nein"}</td>
        <td>${learningStatus}</td>
        <td>${learningGate.notes}</td>
        <td>${quality.pedagogicalStatus}</td>
        <td>${quality.notes}</td>
      </tr>`;
    })
    .join("");
  host.innerHTML = `
    <h3>Abdeckungsmatrix Prüfungsanforderungen</h3>
    <p>Didaktisch bereit: ${readyCount}/${REQUIREMENTS_PATH.length} Anforderungen erreichen bereits die 4/5-Scorecard. Der Lernstatus bleibt separat nutzungsabhängig.</p>
    <p>Hinweis: Ein Ziel gilt erst dann als didaktisch belastbar, wenn die Scorecard mindestens 4/5 Kriterien erreicht.</p>
    <table class="stats-table">
      <thead><tr><th>ID</th><th>Bereich</th><th>Unterbereich</th><th>Anforderung</th><th>Zugeordnete Ziele</th><th>Scorecard</th><th>Theorie</th><th>Kernübung</th><th>Transfer</th><th>Visualisierung</th><th>Fehlerbilder</th><th>Quellen</th><th>Lernstatus</th><th>Lerngate</th><th>Didaktikstatus</th><th>Notizen</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function refreshSidebarRequirementStatuses() {
  const mount = document.getElementById("topicTree");
  if (!mount) return;

  const reqButtons = mount.querySelectorAll("[data-requirement]");
  if (!reqButtons.length) {
    buildSidebarTree();
    return;
  }

  reqButtons.forEach((btn) => {
    const req = REQUIREMENTS_PATH.find((r) => r.id === btn.dataset.requirement);
    if (!req) return;
    const statusNode = btn.querySelector("[data-status-label]");
    if (statusNode) {
      statusNode.textContent = `Status: ${requirementStatus(req)}`;
    }
  });
}

function refreshLearningUI() {
  refreshSidebarRequirementStatuses();
  renderProgressList();
  renderOverviewPanel();
  renderStatsPanel();
  renderCoverageMatrix();
}

function buildSidebarTree() {
  const mount = document.getElementById("topicTree");
  if (!mount) return;
  const shortcuts = `
    <div class="tree-shortcuts">
      <button type="button" data-open-panel="overview">Übersicht</button>
      <button type="button" data-open-panel="statistics">Statistik</button>
      <button type="button" data-open-panel="archive">Nachschlage</button>
      <button type="button" data-open-panel="glossary">Glossar</button>
      <button type="button" data-open-panel="formelbuch">Formelbuch</button>
    </div>
  `;

  const areaOrder = [];
  const hierarchy = {};
  REQUIREMENTS_PATH.forEach((req) => {
    if (!hierarchy[req.area]) {
      hierarchy[req.area] = {};
      areaOrder.push(req.area);
    }
    if (!hierarchy[req.area][req.subarea]) hierarchy[req.area][req.subarea] = [];
    hierarchy[req.area][req.subarea].push(req);
  });

  const groups = areaOrder.map((area) => {
    const sub = hierarchy[area];
    const subBlocks = Object.keys(sub).map((subarea) => {
      const items = sub[subarea]
        .map((req) => {
          const status = requirementStatus(req);
          return `<button type="button" class="tree-item-btn" data-requirement="${req.id}"><strong>${req.id}</strong> ${req.text}<small data-status-label>Status: ${status}</small></button>`;
        })
        .join("");
      return `<div class="tree-group"><div class="tree-header">${subarea}</div><div class="tree-children">${items}</div></div>`;
    }).join("");
    return `
      <div class="tree-group">
        <button type="button" class="tree-header">${area}</button>
        <div class="tree-children">${subBlocks}</div>
      </div>
    `;
  }).join("");

  mount.innerHTML = shortcuts + groups;
  mount.querySelectorAll("[data-open-panel]").forEach((btn) => {
    btn.addEventListener("click", () => showTopic(btn.dataset.openPanel));
  });
  mount.querySelectorAll("[data-requirement]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const req = REQUIREMENTS_PATH.find((r) => r.id === btn.dataset.requirement);
      if (!req) return;
      showTopic(req.topic);
      const el = document.getElementById(`goal-${req.goalIds[0]}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function downloadTextFile(fileName, content, mimeType) {
  const blob = new Blob([content], { type: mimeType || "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function exportStateAsJson() {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const payload = JSON.stringify({ ...learningState, exportedAt: new Date().toISOString() }, null, 2);
  downloadTextFile(`matheinteraktion_${stamp}.json`, payload, "application/json");
}

function exportStatsPdf() {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert("PDF-Export ist noch nicht verfügbar, weil jsPDF nicht geladen wurde.");
    return;
  }
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "mm", "a4");
  const analytics = computeAnalytics();
  pdf.setFontSize(16);
  pdf.text("Matheinteraktion - Lernstatistik", 12, 16);
  pdf.setFontSize(11);
  pdf.text(`Erstellt: ${new Date().toLocaleString("de-DE")}`, 12, 24);
  pdf.text(`Theorie abgehakt: ${analytics.checkedTheory}/${analytics.totalGoals}`, 12, 31);
  pdf.text(`Bewertete Aufgaben: ${analytics.totalAttempts}`, 12, 37);
  pdf.text(`Trefferquote: ${(analytics.overallAccuracy * 100).toFixed(1)}%`, 12, 43);
  pdf.text(`Abdeckung: ${(analytics.overallCoverage * 100).toFixed(1)}%`, 12, 49);
  pdf.text(`Mastery-Skala: ${(analytics.overallMastery * 100).toFixed(1)}%`, 12, 55);

  const canvas = document.getElementById("statsCanvas");
  if (canvas) {
    const img = canvas.toDataURL("image/png");
    pdf.addImage(img, "PNG", 12, 62, 185, 60);
  }
  pdf.save(`matheinteraktion_stats_${new Date().toISOString().slice(0, 10)}.pdf`);
}

function initStateControls() {
  const exportJsonBtn = document.getElementById("exportJsonBtn");
  const exportPdfBtn = document.getElementById("exportPdfBtn");
  const importBtn = document.getElementById("importStateBtn");
  const resetBtn = document.getElementById("resetStateBtn");
  const importInput = document.getElementById("importStateInput");
  if (exportJsonBtn) exportJsonBtn.addEventListener("click", exportStateAsJson);
  if (exportPdfBtn) exportPdfBtn.addEventListener("click", exportStatsPdf);
  if (importBtn && importInput) importBtn.addEventListener("click", () => importInput.click());
  if (importInput) {
    importInput.addEventListener("change", async (ev) => {
      const file = ev.target.files && ev.target.files[0];
      if (!file) return;
      const text = await file.text();
      try {
        learningState = migrateState(JSON.parse(text));
        pushLearningEvent("STATE_IMPORTED", "system", { source: file.name });
        saveLearningState();
        refreshLearningUI();
      } catch {
        alert("Import fehlgeschlagen: JSON ist ungueltig.");
      }
      importInput.value = "";
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (!confirm("Wirklich den gesamten Lernstand löschen?")) return;
      learningState = createEmptyLearningState();
      pushLearningEvent("STATE_RESET", "system", {});
      saveLearningState();
      refreshLearningUI();
    });
  }
}

function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function getLogicalCanvasSize(canvas) {
  const lw = Number(canvas?.dataset?.logicalWidth);
  const lh = Number(canvas?.dataset?.logicalHeight);
  if (Number.isFinite(lw) && Number.isFinite(lh) && lw > 0 && lh > 0) return { width: lw, height: lh };
  return { width: canvas.width || 360, height: canvas.height || 210 };
}

function prepareCanvas(canvas, preferredHeight, maxWidth) {
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  const hostWidth = canvas.parentElement?.clientWidth || 380;
  const cap = Number.isFinite(maxWidth) ? maxWidth : 560;
  const logicalWidth = Math.max(280, Math.min(cap, Math.floor(hostWidth - 4)));
  const logicalHeight = preferredHeight || 210;
  const pixelWidth = Math.floor(logicalWidth * dpr);
  const pixelHeight = Math.floor(logicalHeight * dpr);
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
    canvas.style.width = `${logicalWidth}px`;
    canvas.style.height = `${logicalHeight}px`;
    canvas.dataset.logicalWidth = String(logicalWidth);
    canvas.dataset.logicalHeight = String(logicalHeight);
  }
  const ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function worldToScreen(state, x, y, canvas) {
  const size = getLogicalCanvasSize(canvas);
  return {
    x: size.width / 2 + state.tx + x * state.scale,
    y: size.height / 2 + state.ty - y * state.scale
  };
}

function screenToWorld(state, x, y, canvas) {
  const size = getLogicalCanvasSize(canvas);
  return {
    x: (x - size.width / 2 - state.tx) / state.scale,
    y: (size.height / 2 + state.ty - y) / state.scale
  };
}

function niceGridStep(rawStep) {
  const safe = Math.max(rawStep, 1e-6);
  const p10 = Math.pow(10, Math.floor(Math.log10(safe)));
  const n = safe / p10;
  if (n <= 1) return 1 * p10;
  if (n <= 2) return 2 * p10;
  if (n <= 5) return 5 * p10;
  return 10 * p10;
}

function formatAxisTick(value) {
  if (Math.abs(value) < 1e-9) return "0";
  const abs = Math.abs(value);
  if (abs >= 1000) return value.toFixed(0);
  if (abs >= 10) return value.toFixed(1).replace(/\.0$/, "");
  return value.toFixed(2).replace(/\.00$/, "").replace(/0$/, "");
}

function drawGrid(ctx, canvas, state) {
  const size = getLogicalCanvasSize(canvas);
  ctx.clearRect(0, 0, size.width, size.height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size.width, size.height);

  const scale = Math.max(state.scale || 30, 1e-6);
  const minorStep = niceGridStep(34 / scale);
  let majorStep = niceGridStep(102 / scale);
  if (majorStep < minorStep) majorStep = minorStep * 2;

  const left = screenToWorld(state, 0, 0, canvas).x;
  const right = screenToWorld(state, size.width, 0, canvas).x;
  const top = screenToWorld(state, 0, 0, canvas).y;
  const bottom = screenToWorld(state, 0, size.height, canvas).y;

  ctx.strokeStyle = "#e6edf7";
  for (let x = Math.floor(left / minorStep) * minorStep; x <= right + minorStep * 0.5; x += minorStep) {
    const px = worldToScreen(state, x, 0, canvas).x;
    if (px < -1 || px > size.width + 1) continue;
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, size.height);
    ctx.stroke();
  }
  for (let y = Math.floor(bottom / minorStep) * minorStep; y <= top + minorStep * 0.5; y += minorStep) {
    const py = worldToScreen(state, 0, y, canvas).y;
    if (py < -1 || py > size.height + 1) continue;
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(size.width, py);
    ctx.stroke();
  }

  ctx.strokeStyle = "#d3dfef";
  for (let x = Math.floor(left / majorStep) * majorStep; x <= right + majorStep * 0.5; x += majorStep) {
    const px = worldToScreen(state, x, 0, canvas).x;
    if (px < -1 || px > size.width + 1) continue;
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, size.height);
    ctx.stroke();
  }
  for (let y = Math.floor(bottom / majorStep) * majorStep; y <= top + majorStep * 0.5; y += majorStep) {
    const py = worldToScreen(state, 0, y, canvas).y;
    if (py < -1 || py > size.height + 1) continue;
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(size.width, py);
    ctx.stroke();
  }

  ctx.strokeStyle = "#5c7da9";
  const ox = worldToScreen(state, 0, 0, canvas).x;
  const oy = worldToScreen(state, 0, 0, canvas).y;
  ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(size.width, oy); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ox, 0); ctx.lineTo(ox, size.height); ctx.stroke();

  ctx.fillStyle = "#3a587d";
  ctx.font = "11px Space Grotesk, sans-serif";

  const xLabelY = Math.min(size.height - 14, Math.max(2, oy + 4));
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  for (let x = Math.floor(left / majorStep) * majorStep; x <= right + majorStep * 0.5; x += majorStep) {
    const px = worldToScreen(state, x, 0, canvas).x;
    if (px < 8 || px > size.width - 8) continue;
    if (Math.abs(x) < majorStep * 0.3) continue;
    ctx.fillText(formatAxisTick(x), px, xLabelY);
  }

  const yLabelX = Math.min(size.width - 30, Math.max(4, ox + 6));
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  for (let y = Math.floor(bottom / majorStep) * majorStep; y <= top + majorStep * 0.5; y += majorStep) {
    const py = worldToScreen(state, 0, y, canvas).y;
    if (py < 8 || py > size.height - 8) continue;
    if (Math.abs(y) < majorStep * 0.3) continue;
    ctx.fillText(formatAxisTick(y), yLabelX, py);
  }

  if (ox >= 0 && ox <= size.width && oy >= 0 && oy <= size.height) {
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("0", ox + 5, oy + 4);
  }
}

function plotFunction(ctx, canvas, state, fn, color) {
  const size = getLogicalCanvasSize(canvas);
  ctx.strokeStyle = color || "#1a5da0";
  ctx.lineWidth = 2;
  ctx.beginPath();
  let started = false;
  for (let px = 0; px <= size.width; px += 1) {
    const w = screenToWorld(state, px, 0, canvas).x;
    const y = fn(w);
    if (!Number.isFinite(y)) continue;
    const s = worldToScreen(state, w, y, canvas);
    if (!started) { ctx.moveTo(s.x, s.y); started = true; }
    else ctx.lineTo(s.x, s.y);
  }
  ctx.stroke();
  ctx.lineWidth = 1;
}

function drawMiniPlot(canvas, fn, state) {
  const s = state || { scale: 30, tx: 0, ty: 0 };
  const ctx = canvas.getContext("2d");
  drawGrid(ctx, canvas, s);
  plotFunction(ctx, canvas, s, fn, "#1a5da0");
}

function drawHandles(ctx, canvas, state) {
  if (!state.handles || state.handles.length === 0) return;
  state.handles.forEach((h) => {
    const p = worldToScreen(state, h.x, h.y, canvas);
    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#cc3f24";
    ctx.lineWidth = 2;
    ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (h.label) {
      ctx.fillStyle = "#1f3f63";
      ctx.font = "12px Georgia, serif";
      ctx.fillText(h.label, p.x + 8, p.y - 8);
    }
  });
  ctx.lineWidth = 1;
}

function pickHandle(state, wx, wy) {
  if (!state.handles || state.handles.length === 0) return -1;
  let best = -1;
  let bestD = 0.35 * 0.35;
  state.handles.forEach((h, idx) => {
    const d = (h.x - wx) * (h.x - wx) + (h.y - wy) * (h.y - wy);
    if (d <= bestD) {
      bestD = d;
      best = idx;
    }
  });
  return best;
}

function applyHandleDrag(goalId, handle, wx, wy, vals) {
  if (goalId === "eq_from_points") {
    if (handle === 0) {
      vals.x1 = wx;
      vals.y1 = wy;
    } else if (handle === 1) {
      vals.x2 = wx;
      vals.y2 = wy;
    }
  }
  if (goalId === "parabola_props" && handle === 0) {
    const a = Math.abs(vals.a) < 1e-9 ? 1 : vals.a;
    const hx = wx;
    const ky = wy;
    vals.b = -2 * a * hx;
    vals.c = a * hx * hx + ky;
  }
  if (goalId === "lgs2") {
    if (handle === 0 && Math.abs(vals.b) > 1e-9) vals.e = vals.b * wy;
    if (handle === 1 && Math.abs(vals.d) > 1e-9) vals.f = vals.d * wy;
  }
}

function drawTriangle(canvas, b, h, state) {
  const ctx = canvas.getContext("2d");
  const s = state || { scale: 20, tx: 0, ty: 0 };
  const bb = Math.max(0, Math.abs(b));
  const hh = Math.max(0, Math.abs(h));
  drawGrid(ctx, canvas, s);
  const x0 = 0, y0 = 0;
  const x1 = bb, y1 = 0;
  const x2 = bb / 2, y2 = hh;
  const p0 = worldToScreen(s, x0, y0, canvas);
  const p1 = worldToScreen(s, x1, y1, canvas);
  const p2 = worldToScreen(s, x2, y2, canvas);
  ctx.strokeStyle = "#1b5ea1";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.closePath(); ctx.stroke();
  ctx.strokeStyle = "#ba3f2a";
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(p2.x, p2.y); ctx.lineTo((p0.x + p1.x) / 2, p0.y); ctx.stroke();
  ctx.fillStyle = "#23476d";
  ctx.font = "11px Georgia, serif";
  ctx.fillText(`g=${bb.toFixed(1)}`, (p0.x + p1.x) / 2 - 15, p0.y + 12);
  ctx.fillText(`h=${hh.toFixed(1)}`, p2.x + 8, (p2.y + p0.y) / 2);
  ctx.lineWidth = 1;
}

function drawSolidBox(canvas, state) {
  const ctx = canvas.getContext("2d");
  const s = state || { scale: 15, tx: 0, ty: 0 };
  drawGrid(ctx, canvas, s);
  const corners = [
    { x: -2, y: -2, z: -2 }, { x: 2, y: -2, z: -2 },
    { x: 2, y: 2, z: -2 }, { x: -2, y: 2, z: -2 },
    { x: -2, y: -2, z: 2 }, { x: 2, y: -2, z: 2 },
    { x: 2, y: 2, z: 2 }, { x: -2, y: 2, z: 2 }
  ];
  const isometric = (c) => {
    const sx = c.x + c.z * 0.5;
    const sy = c.y + (c.z + c.x) * 0.25;
    return worldToScreen(s, sx, sy, canvas);
  };
  const pts = corners.map(isometric);
  ctx.strokeStyle = "#1b5ea1";
  ctx.lineWidth = 2;
  [[0, 1], [1, 2], [2, 3], [3, 0]].forEach(([a, b]) => {
    ctx.beginPath(); ctx.moveTo(pts[a].x, pts[a].y); ctx.lineTo(pts[b].x, pts[b].y); ctx.stroke();
  });
  [[4, 5], [5, 6], [6, 7], [7, 4]].forEach(([a, b]) => {
    ctx.beginPath(); ctx.moveTo(pts[a].x, pts[a].y); ctx.lineTo(pts[b].x, pts[b].y); ctx.stroke();
  });
  [[0, 4], [1, 5], [2, 6], [3, 7]].forEach(([a, b]) => {
    ctx.beginPath(); ctx.moveTo(pts[a].x, pts[a].y); ctx.lineTo(pts[b].x, pts[b].y); ctx.stroke();
  });
  ctx.lineWidth = 1;
}

function drawCylinder(canvas, r, h, state) {
  const ctx = canvas.getContext("2d");
  const s = state || { scale: 15, tx: 0, ty: 0 };
  drawGrid(ctx, canvas, s);
  const scale = s.scale || 15;
  const center = worldToScreen(s, 0, 0, canvas);
  const centerX = center.x;
  const centerY = center.y;
  const rScaled = Math.min(r, 3) * scale;
  const hScaled = Math.min(h, 5) * scale;
  ctx.strokeStyle = "#1b5ea1";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY - hScaled / 2, rScaled, rScaled * 0.3, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(centerX - rScaled, centerY - hScaled / 2);
  ctx.lineTo(centerX - rScaled, centerY + hScaled / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(centerX + rScaled, centerY - hScaled / 2);
  ctx.lineTo(centerX + rScaled, centerY + hScaled / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + hScaled / 2, rScaled, rScaled * 0.3, 0, 0, Math.PI * 2);
  ctx.stroke();
}

function drawCone(canvas, r, h, state) {
  const ctx = canvas.getContext("2d");
  const s = state || { scale: 15, tx: 0, ty: 0 };
  drawGrid(ctx, canvas, s);
  const scale = s.scale || 15;
  const center = worldToScreen(s, 0, 0, canvas);
  const centerX = center.x;
  const centerY = center.y;
  const rScaled = Math.min(r, 3) * scale;
  const hScaled = Math.min(h, 5) * scale;
  ctx.strokeStyle = "#1b5ea1";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(centerX, centerY + hScaled / 2, rScaled, rScaled * 0.3, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(centerX - rScaled, centerY + hScaled / 2);
  ctx.lineTo(centerX, centerY - hScaled / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(centerX + rScaled, centerY + hScaled / 2);
  ctx.lineTo(centerX, centerY - hScaled / 2);
  ctx.stroke();
}

function drawSphere(canvas, r, state) {
  const ctx = canvas.getContext("2d");
  const s = state || { scale: 15, tx: 0, ty: 0 };
  drawGrid(ctx, canvas, s);
  const scale = s.scale || 15;
  const center = worldToScreen(s, 0, 0, canvas);
  const centerX = center.x;
  const centerY = center.y;
  const rScaled = Math.min(r, 3) * scale;
  ctx.strokeStyle = "#1b5ea1";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, rScaled, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, rScaled, rScaled * 0.4, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 1;
}

function drawPrism(canvas, state) {
  const ctx = canvas.getContext("2d");
  const s = state || { scale: 15, tx: 0, ty: 0 };
  drawGrid(ctx, canvas, s);
  const corners = [
    { x: -1.5, y: -1.5, z: 0 }, { x: 1.5, y: -1.5, z: 0 },
    { x: 1.5, y: 1.5, z: 0 }, { x: -1.5, y: 1.5, z: 0 },
    { x: -1.5, y: -1.5, z: 2 }, { x: 1.5, y: -1.5, z: 2 },
    { x: 1.5, y: 1.5, z: 2 }, { x: -1.5, y: 1.5, z: 2 }
  ];
  const isometric = (c) => {
    const sx = c.x + c.z * 0.5;
    const sy = c.y + (c.z + c.x) * 0.25;
    return worldToScreen(s, sx, sy, canvas);
  };
  const pts = corners.map(isometric);
  ctx.strokeStyle = "#1b5ea1";
  ctx.lineWidth = 2;
  [[0, 1], [1, 2], [2, 3], [3, 0]].forEach(([a, b]) => {
    ctx.beginPath(); ctx.moveTo(pts[a].x, pts[a].y); ctx.lineTo(pts[b].x, pts[b].y); ctx.stroke();
  });
  [[4, 5], [5, 6], [6, 7], [7, 4]].forEach(([a, b]) => {
    ctx.beginPath(); ctx.moveTo(pts[a].x, pts[a].y); ctx.lineTo(pts[b].x, pts[b].y); ctx.stroke();
  });
  [[0, 4], [1, 5], [2, 6], [3, 7]].forEach(([a, b]) => {
    ctx.beginPath(); ctx.moveTo(pts[a].x, pts[a].y); ctx.lineTo(pts[b].x, pts[b].y); ctx.stroke();
  });
  ctx.lineWidth = 1;
}

function drawPyramid(canvas, state) {
  const ctx = canvas.getContext("2d");
  const s = state || { scale: 15, tx: 0, ty: 0 };
  drawGrid(ctx, canvas, s);
  const base = [
    { x: -2, y: -2, z: 0 }, { x: 2, y: -2, z: 0 },
    { x: 2, y: 2, z: 0 }, { x: -2, y: 2, z: 0 }
  ];
  const apex = { x: 0, y: 0, z: 3 };
  const isometric = (c) => {
    const sx = c.x + c.z * 0.5;
    const sy = c.y + (c.z + c.x) * 0.25;
    return worldToScreen(s, sx, sy, canvas);
  };
  const basePts = base.map(isometric);
  const apexPt = isometric(apex);
  ctx.strokeStyle = "#1b5ea1";
  ctx.lineWidth = 2;
  basePts.forEach((pt, i) => {
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
    ctx.lineTo(basePts[(i + 1) % basePts.length].x, basePts[(i + 1) % basePts.length].y);
    ctx.stroke();
  });
  basePts.forEach((pt) => {
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
    ctx.lineTo(apexPt.x, apexPt.y);
    ctx.stroke();
  });
  ctx.lineWidth = 1;
}

function drawCutBody(canvas, state) {
  const ctx = canvas.getContext("2d");
  const s = state || { scale: 15, tx: 0, ty: 0 };
  drawGrid(ctx, canvas, s);
  const corners = [
    { x: -2, y: -2, z: -2 }, { x: 2, y: -2, z: -2 },
    { x: 2, y: 2, z: -2 }, { x: -2, y: 2, z: -2 },
    { x: -2, y: -2, z: 2 }, { x: 2, y: -2, z: 2 },
    { x: 2, y: 2, z: 2 }, { x: -2, y: 2, z: 2 }
  ];
  const cut = [
    { x: 2, y: -2, z: -2 }, { x: 2.5, y: -2, z: -2 },
    { x: 2, y: -2.5, z: -2 }, { x: 2, y: -2, z: -1.7 }
  ];
  const isometric = (c) => {
    const sx = c.x + c.z * 0.5;
    const sy = c.y + (c.z + c.x) * 0.25;
    return worldToScreen(s, sx, sy, canvas);
  };
  const pts = corners.map(isometric);
  const cutPts = cut.map(isometric);
  ctx.strokeStyle = "#1b5ea1";
  ctx.lineWidth = 2;
  [[0, 1], [1, 2], [2, 3], [3, 0]].forEach(([a, b]) => {
    if (!(a === 1 && b === 0) && !(a === 0 && b === 1)) {
      ctx.beginPath(); ctx.moveTo(pts[a].x, pts[a].y); ctx.lineTo(pts[b].x, pts[b].y); ctx.stroke();
    }
  });
  [[4, 5], [5, 6], [6, 7], [7, 4]].forEach(([a, b]) => {
    ctx.beginPath(); ctx.moveTo(pts[a].x, pts[a].y); ctx.lineTo(pts[b].x, pts[b].y); ctx.stroke();
  });
  [[0, 4], [1, 5], [2, 6], [3, 7]].forEach(([a, b]) => {
    ctx.beginPath(); ctx.moveTo(pts[a].x, pts[a].y); ctx.lineTo(pts[b].x, pts[b].y); ctx.stroke();
  });
  ctx.strokeStyle = "#d9534f";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pts[1].x, pts[1].y);
  ctx.lineTo(cutPts[1].x, cutPts[1].y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cutPts[1].x, cutPts[1].y);
  ctx.lineTo(cutPts[2].x, cutPts[2].y);
  ctx.stroke();
  ctx.lineWidth = 1;
}

function drawRectangleFigure(canvas, a, b, state) {
  const ctx = canvas.getContext("2d");
  const aa = Math.max(0, Math.abs(a));
  const bb = Math.max(0, Math.abs(b));
  drawGrid(ctx, canvas, state);
  const p0 = worldToScreen(state, 0, 0, canvas);
  const p1 = worldToScreen(state, aa, bb, canvas);
  ctx.strokeStyle = "#1b5ea1";
  ctx.lineWidth = 2;
  ctx.strokeRect(p0.x, p1.y, p1.x - p0.x, p0.y - p1.y);
  ctx.fillStyle = "#23476d";
  ctx.font = "11px Georgia, serif";
  ctx.fillText(`a=${aa.toFixed(1)}`, (p0.x + p1.x) / 2 - 10, p0.y + 14);
  ctx.fillText(`b=${bb.toFixed(1)}`, p1.x + 8, (p0.y + p1.y) / 2);
  ctx.lineWidth = 1;
}

function drawCircleFigure(canvas, r, state) {
  const ctx = canvas.getContext("2d");
  const rr = Math.max(0, Math.abs(r));
  drawGrid(ctx, canvas, state);
  const center = worldToScreen(state, 0, 0, canvas);
  ctx.strokeStyle = "#1b5ea1";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(center.x, center.y, rr * state.scale, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(center.x, center.y);
  ctx.lineTo(center.x + rr * state.scale, center.y);
  ctx.strokeStyle = "#ba3f2a";
  ctx.stroke();
  ctx.fillStyle = "#23476d";
  ctx.font = "11px Georgia, serif";
  ctx.fillText(`r=${rr.toFixed(1)}`, center.x + rr * state.scale / 2 - 6, center.y - 8);
  ctx.lineWidth = 1;
}

function drawCompositeFigure(canvas, w, h, r, state) {
  const ctx = canvas.getContext("2d");
  const ww = Math.max(0, Math.abs(w));
  const hh = Math.max(0, Math.abs(h));
  const rr = Math.min(Math.max(0, Math.abs(r)), hh / 2);
  drawGrid(ctx, canvas, state);
  const p0 = worldToScreen(state, 0, 0, canvas);
  const p1 = worldToScreen(state, ww, hh, canvas);
  ctx.strokeStyle = "#1b5ea1";
  ctx.lineWidth = 2;
  ctx.strokeRect(p0.x, p1.y, p1.x - p0.x, p0.y - p1.y);
  const center = worldToScreen(state, ww, hh / 2, canvas);
  ctx.beginPath();
  ctx.arc(center.x, center.y, rr * state.scale, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  ctx.lineWidth = 1;
}

function drawTriangleInRectangle(canvas, w, h, tb, th, state) {
  const ww = Math.max(0, Math.abs(w));
  const hh = Math.max(0, Math.abs(h));
  drawRectangleFigure(canvas, ww, hh, state);
  const ctx = canvas.getContext("2d");
  const base = Math.max(0, Math.min(Math.abs(tb), ww));
  const height = Math.max(0, Math.min(Math.abs(th), hh));
  const p0 = worldToScreen(state, 0, 0, canvas);
  const p1 = worldToScreen(state, base, 0, canvas);
  const p2 = worldToScreen(state, base / 2, height, canvas);
  ctx.strokeStyle = "#ba3f2a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.closePath();
  ctx.stroke();
  ctx.lineWidth = 1;
}

function drawRightTriangle(canvas, adj, opp, state) {
  const hyp = Math.hypot(adj, opp);
  const ctx = canvas.getContext("2d");
  drawGrid(ctx, canvas, state);
  const p0 = worldToScreen(state, 0, 0, canvas);
  const p1 = worldToScreen(state, adj, 0, canvas);
  const p2 = worldToScreen(state, adj, opp, canvas);
  ctx.strokeStyle = "#1b5ea1";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = "#23476d";
  ctx.font = "11px Georgia, serif";
  ctx.fillText(`AK=${adj.toFixed(1)}`, (p0.x + p1.x) / 2 - 10, p0.y + 14);
  ctx.fillText(`GK=${opp.toFixed(1)}`, p2.x + 8, (p1.y + p2.y) / 2);
  ctx.fillText(`H=${hyp.toFixed(1)}`, (p0.x + p2.x) / 2 - 10, (p0.y + p2.y) / 2 - 10);
  ctx.lineWidth = 1;
}

function drawLgs3System(canvas, vals, det) {
  const ctx = canvas.getContext("2d");
  const size = getLogicalCanvasSize(canvas);
  ctx.clearRect(0, 0, size.width, size.height);
  ctx.fillStyle = "#f9fbff";
  ctx.fillRect(0, 0, size.width, size.height);

  const rows = [
    { label: "I", c: [vals.a1, vals.b1, vals.c1], d: vals.d1, color: "#2b6cb0" },
    { label: "II", c: [vals.a2, vals.b2, vals.c2], d: vals.d2, color: "#2f855a" },
    { label: "III", c: [vals.a3, vals.b3, vals.c3], d: vals.d3, color: "#b7791f" }
  ];

  const top = 22;
  const rowH = 58;
  const barBaseX = 72;
  const barW = 22;
  const spacing = 38;
  const barMaxH = 36;

  ctx.font = "12px Arial";
  ctx.fillStyle = "#143a69";
  ctx.fillText("Grafische Matrixansicht (Betrag der Koeffizienten)", 12, 14);

  rows.forEach((row, r) => {
    const y = top + r * rowH;
    ctx.fillStyle = "#1f3d62";
    ctx.fillText(`${row.label}:`, 20, y + 20);
    row.c.forEach((v, idx) => {
      const h = Math.min(barMaxH, Math.abs(v) * 6 + 2);
      const x = barBaseX + idx * spacing;
      ctx.fillStyle = row.color;
      ctx.fillRect(x, y + (barMaxH - h) + 8, barW, h);
      ctx.fillStyle = "#16385c";
      ctx.fillText(String(v), x + 3, y + 54);
    });
    ctx.fillStyle = "#1f3d62";
    ctx.fillText(`= ${row.d}`, barBaseX + 3 * spacing + 14, y + 33);
  });

  ctx.strokeStyle = Math.abs(det) < 1e-9 ? "#c53030" : "#2f855a";
  ctx.lineWidth = 2;
  ctx.strokeRect(12, size.height - 54, size.width - 24, 40);
  ctx.fillStyle = "#1f3d62";
  ctx.fillText(`det(A) = ${det.toFixed(3)} ${Math.abs(det) < 1e-9 ? "-> nicht eindeutig" : "-> eindeutig"}`, 20, size.height - 28);
  ctx.lineWidth = 1;
}

function drawPointOnPlot(ctx, canvas, state, x, y, label, color) {
  const p = worldToScreen(state, x, y, canvas);
  ctx.beginPath();
  ctx.fillStyle = color || "#d1432a";
  ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
  ctx.fill();
  if (label) {
    ctx.fillStyle = "#123a62";
    ctx.font = "12px Arial";
    ctx.fillText(label, p.x + 6, p.y - 8);
  }
}

function drawLgs3Intersection(canvas, vals, det, solution) {
  const ctx = canvas.getContext("2d");
  const size = getLogicalCanvasSize(canvas);
  ctx.clearRect(0, 0, size.width, size.height);
  ctx.fillStyle = "#f9fbff";
  ctx.fillRect(0, 0, size.width, size.height);

  const project = (x, y, z) => {
    const sx = x - y;
    const sy = (x + y) * 0.42 - z;
    const scale = 18;
    return { x: size.width * 0.36 + sx * scale, y: size.height * 0.6 - sy * scale };
  };

  const edges = [
    [[-4, -4, -4], [4, -4, -4]], [[-4, 4, -4], [4, 4, -4]], [[-4, -4, 4], [4, -4, 4]], [[-4, 4, 4], [4, 4, 4]],
    [[-4, -4, -4], [-4, 4, -4]], [[4, -4, -4], [4, 4, -4]], [[-4, -4, 4], [-4, 4, 4]], [[4, -4, 4], [4, 4, 4]],
    [[-4, -4, -4], [-4, -4, 4]], [[4, -4, -4], [4, -4, 4]], [[-4, 4, -4], [-4, 4, 4]], [[4, 4, -4], [4, 4, 4]]
  ];

  const planePolygons = (a, b, c, d) => {
    const pts = [];
    edges.forEach(([p1, p2]) => {
      const v1 = a * p1[0] + b * p1[1] + c * p1[2] - d;
      const v2 = a * p2[0] + b * p2[1] + c * p2[2] - d;
      if (Math.abs(v1) < 1e-9 && Math.abs(v2) < 1e-9) {
        pts.push(p1, p2);
        return;
      }
      if (Math.abs(v1 - v2) < 1e-9) return;
      const t = v1 / (v1 - v2);
      if (t < -1e-9 || t > 1 + 1e-9) return;
      pts.push([
        p1[0] + (p2[0] - p1[0]) * t,
        p1[1] + (p2[1] - p1[1]) * t,
        p1[2] + (p2[2] - p1[2]) * t
      ]);
    });

    const uniq = [];
    pts.forEach((p) => {
      if (!uniq.some((q) => Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) < 0.06)) {
        uniq.push(p);
      }
    });
    if (uniq.length < 3) return [];

    const center = uniq.reduce((acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]], [0, 0, 0]).map((x) => x / uniq.length);
    uniq.sort((u, v) => {
      const pu = project(u[0], u[1], u[2]);
      const pv = project(v[0], v[1], v[2]);
      const pc = project(center[0], center[1], center[2]);
      const au = Math.atan2(pu.y - pc.y, pu.x - pc.x);
      const av = Math.atan2(pv.y - pc.y, pv.x - pc.x);
      return au - av;
    });
    return uniq;
  };

  const axes = [
    { from: [0, 0, 0], to: [4.5, 0, 0], color: "#1f5fa2", label: "x" },
    { from: [0, 0, 0], to: [0, 4.5, 0], color: "#2f855a", label: "y" },
    { from: [0, 0, 0], to: [0, 0, 4.5], color: "#9a4e1b", label: "z" }
  ];
  axes.forEach((axis) => {
    const p0 = project(...axis.from);
    const p1 = project(...axis.to);
    ctx.strokeStyle = axis.color;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.stroke();
    ctx.fillStyle = axis.color;
    ctx.font = "12px Arial";
    ctx.fillText(axis.label, p1.x + 4, p1.y + 2);
  });

  const planes = [
    { label: "E1", coeff: [vals.a1, vals.b1, vals.c1, vals.d1], color: "rgba(52, 107, 187, 0.26)" },
    { label: "E2", coeff: [vals.a2, vals.b2, vals.c2, vals.d2], color: "rgba(52, 153, 91, 0.24)" },
    { label: "E3", coeff: [vals.a3, vals.b3, vals.c3, vals.d3], color: "rgba(189, 124, 41, 0.24)" }
  ];

  planes.forEach((plane) => {
    const poly = planePolygons(...plane.coeff);
    if (poly.length < 3) return;
    const first = project(poly[0][0], poly[0][1], poly[0][2]);
    ctx.beginPath();
    ctx.moveTo(first.x, first.y);
    poly.slice(1).forEach((p) => {
      const sp = project(p[0], p[1], p[2]);
      ctx.lineTo(sp.x, sp.y);
    });
    ctx.closePath();
    ctx.fillStyle = plane.color;
    ctx.fill();
    ctx.strokeStyle = "rgba(24, 54, 92, 0.55)";
    ctx.lineWidth = 1.3;
    ctx.stroke();
  });

  ctx.fillStyle = "#143a69";
  ctx.font = "12px Arial";
  ctx.fillText("Geometrische Sicht: Schnittpunkt der drei Ebenen", 12, 16);

  if (solution) {
    const sp = project(solution.x, solution.y, solution.z);
    ctx.beginPath();
    ctx.fillStyle = "#c1322a";
    ctx.arc(sp.x, sp.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a3d66";
    ctx.fillText("S", sp.x + 7, sp.y - 8);
  }

  ctx.strokeStyle = Math.abs(det) < 1e-9 ? "#c53030" : "#2f855a";
  ctx.lineWidth = 1.8;
  ctx.strokeRect(12, size.height - 48, size.width - 24, 34);
  ctx.fillStyle = "#1f3d62";
  ctx.fillText(`det(A) = ${det.toFixed(3)} ${Math.abs(det) < 1e-9 ? "-> nicht eindeutig" : "-> eindeutig"}`, 20, size.height - 27);
  ctx.lineWidth = 1;
}

function goalCompute(goalId, vals, canvas, state, goalState) {
  const pi = Math.PI;
  const ctx = canvas ? canvas.getContext("2d") : null;
  state.handles = [];
  const ref = getGoalById(goalId);
  const active = ref ? getActiveGoalContent(ref.goal, goalState || ensureGoalState(goalId, ref.topic)) : null;
  if (active && isAdaptiveGoal(ref.goal)) {
    if (goalId === "pow_log") {
      const variantId = active.variant?.id;
      const modeId = active.mode?.id;
      if (variantId === "powers") {
        if (modeId === "rules") {
          const value = Math.pow(vals.a, vals.m + vals.n);
          return `Potenzregeln: \(${vals.a}^{${vals.m}}\\cdot ${vals.a}^{${vals.n}}=${vals.a}^{${vals.m + vals.n}}=${value.toFixed(3)}\).`;
        }
        if (modeId === "equations") {
          const base = Math.max(vals.base, 1.0001);
          const target = Math.max(vals.target, 0.0001);
          const x = Math.log(target) / Math.log(base);
          return `Potenzgleichung: \(${base.toFixed(3)}^x=${target.toFixed(3)}\Rightarrow x=${x.toFixed(3)}\).`;
        }
        const value = vals.n0 * Math.pow(Math.max(vals.q, 0.01), vals.t);
        drawMiniPlot(canvas, (x) => vals.n0 * Math.pow(Math.max(vals.q, 0.01), x), state);
        return `Anwendung Potenzen: \(N(${vals.t})=${value.toFixed(3)}\).`;
      }
      if (variantId === "roots") {
        if (modeId === "rules") {
          const root = Math.pow(Math.max(vals.rad, 0), 1 / Math.max(vals.n, 1));
          return `Wurzelregel: \(\\sqrt[${Math.max(vals.n, 1)}]{${vals.rad}}\\approx ${root.toFixed(3)}\).`;
        }
        if (modeId === "equations") {
          const x = vals.d * vals.d - vals.c;
          return `Wurzelgleichung: \(\\sqrt{x+${vals.c}}=${vals.d}\\Rightarrow x=${x.toFixed(3)}\).`;
        }
        const side = Math.sqrt(Math.max(vals.A, 0));
        return `Anwendung Wurzeln: Quadratseite \(a=\\sqrt{${vals.A}}=${side.toFixed(3)}\).`;
      }
      if (variantId === "logs") {
        if (modeId === "rules") {
          const value = Math.log(Math.max(vals.u * vals.v, 0.0001)) / Math.log(Math.max(vals.base, 1.0001));
          return `Log-Regeln: \(\\log_{${vals.base}}(${vals.u}\\cdot ${vals.v})=${value.toFixed(3)}\).`;
        }
        if (modeId === "equations") {
          const x = Math.pow(Math.max(vals.base, 1.0001), vals.c);
          return `Log-Gleichung: \(\\log_{${vals.base}}(x)=${vals.c}\\Rightarrow x=${x.toFixed(3)}\).`;
        }
        const ph = -Math.log10(Math.max(vals.c, 0.0000001));
        return `Anwendung Logarithmen: \(\\mathrm{pH}=${ph.toFixed(3)}\).`;
      }
      if (modeId === "rules") {
        const value = vals.k * (Math.log(Math.max(vals.a, 0.0001)) / Math.log(2));
        return `Gemischt (Regeln): \(\\log_2(${vals.a}^{${vals.k}})=${value.toFixed(3)}\).`;
      }
      if (modeId === "equations") {
        const x = vals.a * vals.a;
        const y = Math.pow(Math.max(vals.base, 1.0001), vals.c);
        return `Gemischt (Gleichungen): \(x=${x.toFixed(3)},\\;y=${y.toFixed(3)}\).`;
      }
      const qSafe = Math.max(vals.q, 1.0001);
      const n = Math.log(Math.max(vals.Tn, 0.0001) / Math.max(vals.T0, 0.0001)) / Math.log(qSafe);
      return `Gemischt (Anwendung): \(${vals.Tn}=${vals.T0}\\cdot ${qSafe.toFixed(3)}^n\\Rightarrow n=${n.toFixed(3)}\).`;
    }
    if (goalId === "interest") {
      const variantId = active.variant?.id;
      const growth = (x) => vals.k0 * Math.pow(1 + vals.p / 100, x);
      if (variantId === "compound") {
        drawMiniPlot(canvas, (x) => growth(x) / (vals.k0 || 1), state);
        const kn = growth(vals.n);
        return `Zinseszins: \(K_${vals.n}=${kn.toFixed(2)}\).`;
      }
      if (variantId === "target_intersection") {
        drawGrid(ctx, canvas, state);
        plotFunction(ctx, canvas, state, (x) => growth(x) / (vals.k0 || 1), "#1d5fa3");
        const targetScaled = vals.target / (vals.k0 || 1);
        plotFunction(ctx, canvas, state, () => targetScaled, "#b3412f");
        const b = 1 + vals.p / 100;
        if (b <= 0 || Math.abs(b - 1) < 1e-9 || vals.target <= 0 || vals.k0 <= 0) return "Schnittpunkt nicht berechenbar mit diesen Parametern.";
        const n = Math.log(vals.target / vals.k0) / Math.log(b);
        drawPointOnPlot(ctx, canvas, state, n, targetScaled, "S", "#d1432a");
        return `Schnittpunkt mit Zielkapital: \(n=${n.toFixed(3)}\) Jahre.`;
      }
      drawGrid(ctx, canvas, state);
      plotFunction(ctx, canvas, state, (x) => growth(x) / (vals.k0 || 1), "#1d5fa3");
      plotFunction(ctx, canvas, state, (x) => (vals.lineM * x + vals.lineQ) / (vals.k0 || 1), "#b3412f");
      let left = 0;
      let right = 40;
      const diff = (x) => growth(x) - (vals.lineM * x + vals.lineQ);
      while (diff(left) * diff(right) > 0 && right < 200) right += 20;
      if (diff(left) * diff(right) > 0) return "Kein Schnittpunkt im betrachteten Bereich [0, 200].";
      for (let i = 0; i < 40; i += 1) {
        const mid = (left + right) / 2;
        if (diff(left) * diff(mid) <= 0) right = mid;
        else left = mid;
      }
      const xHit = (left + right) / 2;
      const yHit = growth(xHit) / (vals.k0 || 1);
      drawPointOnPlot(ctx, canvas, state, xHit, yHit, "S", "#d1432a");
      return `Schnittpunkt exponentiell/linear: \(x=${xHit.toFixed(3)}\) Jahre.`;
    }
    if (goalId === "plane_measurement") {
      const variantId = active.variant?.id;
      const modeId = active.mode?.id || "area";
      if (variantId === "rectangle") {
        drawRectangleFigure(canvas, vals.a, vals.b, state);
        if (modeId === "perimeter") return `Rechteck (Umfang): \(U=${(2 * (vals.a + vals.b)).toFixed(3)}\).`;
        return `Rechteck (Fläche): \(A=${(vals.a * vals.b).toFixed(3)}\).`;
      }
      if (variantId === "triangle") {
        const g = Math.max(0, Math.abs(vals.g));
        const h = Math.max(0, Math.abs(vals.h));
        drawTriangle(canvas, g, h, state);
        if (modeId === "perimeter") return `Dreieck (Umfang): \(U=${(Math.max(0, vals.a) + Math.max(0, vals.b) + Math.max(0, vals.c)).toFixed(3)}\).`;
        return `Dreieck (Fläche): \(A=${(0.5 * g * h).toFixed(3)}\).`;
      }
      if (variantId === "circle") {
        const r = Math.max(0, Math.abs(vals.r));
        drawCircleFigure(canvas, r, state);
        if (modeId === "perimeter") return `Kreis (Umfang): \(U=${(2 * pi * r).toFixed(3)}\).`;
        return `Kreis (Fläche): \(A=${(pi * r * r).toFixed(3)}\).`;
      }
      if (variantId === "composite") {
        const w = Math.max(0, Math.abs(vals.w));
        const h = Math.max(0, Math.abs(vals.h));
        const r = Math.min(Math.max(0, Math.abs(vals.r)), h / 2);
        drawCompositeFigure(canvas, w, h, r, state);
        const area = w * h + 0.5 * pi * r * r;
        const perimeter = 2 * w + 2 * h - 2 * r + pi * r;
        if (modeId === "perimeter") return `Zusammengesetzte Figur (Umfang): Außenrand \(U=${perimeter.toFixed(3)}\).`;
        return `Zusammengesetzte Figur (Fläche): \(A=${area.toFixed(3)}\).`;
      }
      if (variantId === "rect_triangle") {
        const w = Math.max(0, Math.abs(vals.w));
        const h = Math.max(0, Math.abs(vals.h));
        const tb = Math.max(0, Math.min(Math.abs(vals.tb), w));
        const th = Math.max(0, Math.min(Math.abs(vals.th), h));
        drawTriangleInRectangle(canvas, w, h, tb, th, state);
        const rectArea = w * h;
        const triArea = 0.5 * tb * th;
        if (modeId === "perimeter") return `Rahmen (Umfang): \(U=${(2 * (w + h)).toFixed(3)}\).`;
        return `Rechteck und Dreieck (Fläche): \(A_{Rest}=${(rectArea - triArea).toFixed(3)}\).`;
      }
      if (variantId === "similarity") {
        const L = Math.max(0, Math.abs(vals.L));
        const A = Math.max(0, Math.abs(vals.A));
        drawRectangleFigure(canvas, L, L / 2, state);
        if (modeId === "length") return `Ähnlichkeit (Längen): \(L'=${(vals.k * L).toFixed(3)}\).`;
        return `Ähnlichkeit (Flächen): \(A'=${(vals.k * vals.k * A).toFixed(3)}\).`;
      }
    }
    if (goalId === "solid_measurement") {
      const variantId = active.variant?.id;
      const modeId = active.mode?.id;
      if (variantId === "box") {
        drawSolidBox(canvas, state);
        if (modeId === "volume") return `Quader: \(V=${(vals.a * vals.b * vals.h).toFixed(3)}\).`;
        if (modeId === "mantle") return `Quader: \(M=${(2 * vals.h * (vals.a + vals.b)).toFixed(3)}\).`;
        return `Quader: \(O=${(2 * (vals.a * vals.b + vals.a * vals.h + vals.b * vals.h)).toFixed(3)}\).`;
      }
      if (variantId === "cylinder") {
        drawCylinder(canvas, vals.r, vals.h, state);
        if (modeId === "volume") return `Zylinder: \(V=${(pi * vals.r * vals.r * vals.h).toFixed(3)}\).`;
        if (modeId === "mantle") return `Zylinder: \(M=${(2 * pi * vals.r * vals.h).toFixed(3)}\).`;
        return `Zylinder: \(O=${(2 * pi * vals.r * vals.r + 2 * pi * vals.r * vals.h).toFixed(3)}\).`;
      }
      if (variantId === "cone") {
        drawCone(canvas, vals.r, vals.h, state);
        if (modeId === "volume") return `Kegel: \(V=${(((1 / 3) * pi * vals.r * vals.r * vals.h)).toFixed(3)}\).`;
        if (modeId === "mantle") return `Kegel: \(M=${(pi * vals.r * vals.s).toFixed(3)}\).`;
        return `Kegel: \(O=${(pi * vals.r * vals.r + pi * vals.r * vals.s).toFixed(3)}\).`;
      }
      if (variantId === "sphere") {
        drawSphere(canvas, vals.r, state);
        if (modeId === "volume") return `Kugel: \(V=${(((4 / 3) * pi * vals.r ** 3)).toFixed(3)}\).`;
        return `Kugel: \(O=${(4 * pi * vals.r * vals.r).toFixed(3)}\).`;
      }
      if (variantId === "prism") {
        drawPrism(canvas, state);
        if (modeId === "volume") return `Prisma: \(V=${(vals.G * vals.h).toFixed(3)}\).`;
        if (modeId === "mantle") return `Prisma: \(M=${(vals.u * vals.h).toFixed(3)}\).`;
        return `Prisma: \(O=${(2 * vals.G + vals.u * vals.h).toFixed(3)}\).`;
      }
      if (variantId === "pyramid") {
        drawPyramid(canvas, state);
        if (modeId === "volume") return `Pyramide: \(V=${(((1 / 3) * vals.G * vals.h)).toFixed(3)}\).`;
        if (modeId === "mantle") return `Pyramide: \(M=${(0.5 * vals.u * vals.s).toFixed(3)}\).`;
        return `Pyramide: \(O=${(vals.G + 0.5 * vals.u * vals.s).toFixed(3)}\).`;
      }
      if (variantId === "cut_compose") {
        drawCutBody(canvas, state);
        const base = vals.a ** 3;
        const cut = vals.cut ** 3 / 6;
        if (modeId === "restvolume") return `Restvolumen: \(V_{rest}=${(base - cut).toFixed(3)}\) bei Grundkörper \(V_0=${base.toFixed(3)}\).`;
        if (modeId === "surface") return `Neue Oberfläche: Denke in Flächenbilanz. Ausgangsfläche \(6a^2=${(6 * vals.a * vals.a).toFixed(3)}\), dann wegfallende und neue Schnittflächen anpassen.`;
        return `Zählaufgabe: Verfolge nach dem Schnitt systematisch neue Flächen, neue Kanten und veränderte Ecken.`;
      }
    }
    if (goalId === "triangle_trig") {
      const variantId = active.variant?.id;
      if (variantId === "right_triangle") {
        const opp = vals.adj * Math.tan((vals.alpha * pi) / 180);
        const hyp = vals.adj / Math.cos((vals.alpha * pi) / 180);
        drawRightTriangle(canvas, vals.adj, opp, state);
        return `Rechtwinkliges Dreieck: \(GK=${opp.toFixed(3)}\), \(H=${hyp.toFixed(3)}\).`;
      }
      if (variantId === "any_triangle") {
        const rad = (vals.gamma * pi) / 180;
        const c = Math.sqrt(Math.max(0, vals.a * vals.a + vals.b * vals.b - 2 * vals.a * vals.b * Math.cos(rad)));
        const area = 0.5 * vals.a * vals.b * Math.sin(rad);
        const s2 = state || { scale: 20, tx: 0, ty: 0 };
        drawGrid(ctx, canvas, s2);
        const p0 = worldToScreen(s2, 0, 0, canvas);
        const p1 = worldToScreen(s2, vals.a, 0, canvas);
        const p2 = worldToScreen(s2, vals.b * Math.cos(rad), vals.b * Math.sin(rad), canvas);
        ctx.strokeStyle = "#1b5ea1";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.closePath();
        ctx.stroke();
        ctx.lineWidth = 1;
        return `Allgemeines Dreieck: \(c=${c.toFixed(3)}\), Fläche \(A=${area.toFixed(3)}\).`;
      }
      drawSolidBox(canvas, state);
      const dotUV = vals.ux * vals.vx + vals.uy * vals.vy + vals.uz * vals.vz;
      const lenU = Math.hypot(vals.ux, vals.uy, vals.uz);
      const lenV = Math.hypot(vals.vx, vals.vy, vals.vz);
      const phi = (Math.acos(Math.max(-1, Math.min(1, dotUV / ((lenU || 1) * (lenV || 1))))) * 180) / pi;
      const dotDN = vals.ux * vals.nx + vals.uy * vals.ny + vals.uz * vals.nz;
      const lenN = Math.hypot(vals.nx, vals.ny, vals.nz);
      const beta = (Math.asin(Math.max(-1, Math.min(1, Math.abs(dotDN) / ((lenU || 1) * (lenN || 1))))) * 180) / pi;
      return `Raumwinkel: Gerade-Gerade \(\varphi=${phi.toFixed(3)}^\circ\), Gerade-Ebene \(\beta=${beta.toFixed(3)}^\circ\).`;
    }
  }
  switch (goalId) {
    case "lgs2": {
      const { a, b, e, c, d, f } = vals;
      const det = a * d - c * b;
      drawGrid(ctx, canvas, state);
      plotFunction(ctx, canvas, state, (x) => (e - a * x) / (b || 1e-9), "#1d5fa3");
      plotFunction(ctx, canvas, state, (x) => (f - c * x) / (d || 1e-9), "#b3412f");
      if (Math.abs(b) > 1e-9) state.handles.push({ x: 0, y: e / b, label: "g1" });
      if (Math.abs(d) > 1e-9) state.handles.push({ x: 0, y: f / d, label: "g2" });
      drawHandles(ctx, canvas, state);
      if (Math.abs(det) < 1e-9) return "det=0: keine eindeutige Lösung";
      const x = (e * d - f * b) / det;
      const y = (a * f - c * e) / det;
      return `x=${x.toFixed(3)}, y=${y.toFixed(3)} (Schnittpunkt der Geraden)`;
    }
    case "lgs3": {
      const { a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3 } = vals;
      const det = a1 * (b2 * c3 - b3 * c2) - b1 * (a2 * c3 - a3 * c2) + c1 * (a2 * b3 - a3 * b2);
      if (Math.abs(det) < 1e-9) {
        if (canvas) drawLgs3Intersection(canvas, vals, det, null);
        return `\\(\\text{det}=0\\Rightarrow\\text{keine eindeutige Lösung}\\)`;
      }
      const solX = (d1 * (b2 * c3 - b3 * c2) - b1 * (d2 * c3 - d3 * c2) + c1 * (d2 * b3 - d3 * b2)) / det;
      const solY = (a1 * (d2 * c3 - d3 * c2) - d1 * (a2 * c3 - a3 * c2) + c1 * (a2 * d3 - a3 * d2)) / det;
      const solZ = (a1 * (b2 * d3 - b3 * d2) - b1 * (a2 * d3 - a3 * d2) + d1 * (a2 * b3 - a3 * b2)) / det;
      if (canvas) drawLgs3Intersection(canvas, vals, det, { x: solX, y: solY, z: solZ });
      return `\\(x=${solX.toFixed(3)},\\;y=${solY.toFixed(3)},\\;z=${solZ.toFixed(3)}\\)`;
    }
    case "quad_methods": {
      const { a, b, c } = vals;
      drawMiniPlot(canvas, (x) => a * x * x + b * x + c, state);
      const D = b * b - 4 * a * c;
      if (D < 0) return `D=${D.toFixed(3)}: keine reellen Nullstellen`;
      const x1 = (-b + Math.sqrt(D)) / (2 * a);
      const x2 = (-b - Math.sqrt(D)) / (2 * a);
      return `D=${D.toFixed(3)}, x1=${x1.toFixed(3)}, x2=${x2.toFixed(3)}`;
    }
    case "pow_log": {
      const { a, m, n } = vals;
      return `\\(${a}^{${m}} \\cdot ${a}^{${n}} = ${a}^{${m + n}}\\)`;
    }
    case "exp_log_eq": {
      const { base, x } = vals;
      const val = Math.pow(Math.max(0.01, base), x);
      return `\\(${base}^{${x}} = ${val.toFixed(4)}\\)`;
    }
    case "interest": {
      const { k0, p, n } = vals;
      const b = 1 + p / 100;
      drawMiniPlot(canvas, (x) => (k0 * Math.pow(b, x)) / (k0 || 1), state);
      const kn = k0 * Math.pow(b, n);
      return `K_n = ${k0.toFixed(2)}*(1+${(p / 100).toFixed(3)})^${n} = ${kn.toFixed(2)}`;
    }
    case "lin_quad_plot": {
      const { a, b, c, m, q } = vals;
      drawGrid(ctx, canvas, state);
      plotFunction(ctx, canvas, state, (x) => a * x * x + b * x + c, "#1d5fa3");
      plotFunction(ctx, canvas, state, (x) => m * x + q, "#b3412f");

      const A = a;
      const B = b - m;
      const C = c - q;
      if (Math.abs(A) < 1e-9) {
        if (Math.abs(B) < 1e-9) {
          return Math.abs(C) < 1e-9
            ? "f(x) und g(x) sind identisch: unendlich viele Schnittpunkte."
            : "Keine Schnittpunkte (parallele bzw. getrennte Geraden).";
        }
        const x = -C / B;
        const y = m * x + q;
        drawPointOnPlot(ctx, canvas, state, x, y, "S1", "#d1432a");
        return `1 Schnittpunkt: S(${x.toFixed(3)}|${y.toFixed(3)})`;
      }

      const D = B * B - 4 * A * C;
      if (D < -1e-9) {
        return `Keine reellen Schnittpunkte (Diskriminante D=${D.toFixed(3)}).`;
      }
      if (Math.abs(D) <= 1e-9) {
        const x = -B / (2 * A);
        const y = m * x + q;
        drawPointOnPlot(ctx, canvas, state, x, y, "S", "#d1432a");
        return `1 Berührpunkt: S(${x.toFixed(3)}|${y.toFixed(3)})`;
      }

      const root = Math.sqrt(D);
      const x1 = (-B + root) / (2 * A);
      const x2 = (-B - root) / (2 * A);
      const y1 = m * x1 + q;
      const y2 = m * x2 + q;
      drawPointOnPlot(ctx, canvas, state, x1, y1, "S1", "#d1432a");
      drawPointOnPlot(ctx, canvas, state, x2, y2, "S2", "#d1432a");
      return `2 Schnittpunkte: S1(${x1.toFixed(3)}|${y1.toFixed(3)}), S2(${x2.toFixed(3)}|${y2.toFixed(3)})`;
    }
    case "eq_from_points": {
      const { x1, y1, x2, y2 } = vals;
      const m = (y2 - y1) / ((x2 - x1) || 1e-9);
      const q = y1 - m * x1;
      drawMiniPlot(canvas, (x) => m * x + q, state);
      state.handles = [
        { x: x1, y: y1, label: "P1" },
        { x: x2, y: y2, label: "P2" }
      ];
      drawHandles(ctx, canvas, state);
      return `Linear durch P1/P2: m=${m.toFixed(3)}, q=${q.toFixed(3)}, also y=${m.toFixed(3)}x+${q.toFixed(3)}`;
    }
    case "parabola_props": {
      const { a, b, c } = vals;
      drawMiniPlot(canvas, (x) => a * x * x + b * x + c, state);
      const xs = -b / (2 * (a || 1e-9));
      const ys = a * xs * xs + b * xs + c;
      state.handles = [{ x: xs, y: ys, label: "S" }];
      drawHandles(ctx, canvas, state);
      return `Scheitel S(${xs.toFixed(3)}|${ys.toFixed(3)}), Symmetrieachse x=${xs.toFixed(3)}, Öffnung ${a >= 0 ? "nach oben" : "nach unten"}`;
    }
    case "expo_growth": {
      const { a, b } = vals;
      drawMiniPlot(canvas, (x) => a * Math.pow(Math.max(0.05, b), x), state);
      return `f(x)=${a}*${b}^x -> ${b > 1 ? "Wachstum" : "Zerfall"}`;
    }
    case "triangle_lines": {
      const { b, h } = vals;
      drawTriangle(canvas, b, h, state);
      const area = 0.5 * b * h;
      return `Dreiecksfläche A=0.5*g*h=${area.toFixed(3)}. Höhe eingezeichnet.`;
    }
    case "area_composite": {
      const { w, h, r } = vals;
      const A = w * h + 0.5 * pi * r * r;
      const U = 2 * (w + h) + pi * r;
      drawTriangle(canvas, w, h, state);
      return `Zusammengesetzt: A=${A.toFixed(3)}, U≈${U.toFixed(3)}`;
    }
    case "similarity": {
      const { k, a } = vals;
      return `\\(k = ${k.toFixed(2)}, k^2 = ${(k * k).toFixed(3)}\\)`;
    }
    case "solids": {
      const { a, b, h, r } = vals;
      drawSolidBox(canvas, state);
      const quader = a * b * h;
      const zyl = pi * r * r * h;
      const kug = (4 / 3) * pi * r * r * r;
      return `\\(V_{\\text{Q}}=${quader.toFixed(2)}, V_{\\text{Zyl}}=${zyl.toFixed(2)}, V_{\\text{K}}=${kug.toFixed(2)}\\)`;
    }
    case "cut_compose": {
      const { a, cut } = vals;
      drawSolidBox(canvas, state);
      const baseV = a * a * a;
      const removedApprox = (cut * cut * cut) / 6;
      const restV = baseV - removedApprox;
      return `Grundkörper: \\(V_0=${baseV.toFixed(2)}\\). Abgeschnittener Teil (Modellnäherung): \\(V_{\\mathrm{cut}}\\approx ${removedApprox.toFixed(2)}\\). Restvolumen: \\(V_{\\mathrm{rest}}\\approx ${restV.toFixed(2)}\\).`;
    }
    case "any_triangle": {
      const { a, b, gamma } = vals;
      const rad = (gamma * pi) / 180;
      const c = Math.sqrt(Math.max(0, a * a + b * b - 2 * a * b * Math.cos(rad)));
      const s = state || { scale: 20, tx: 0, ty: 0 };
      const ctx = canvas.getContext("2d");
      drawGrid(ctx, canvas, s);
      const x0 = 0, y0 = 0;
      const x1 = a, y1 = 0;
      const x2 = b * Math.cos(rad), y2 = b * Math.sin(rad);
      const p0 = worldToScreen(s, x0, y0, canvas);
      const p1 = worldToScreen(s, x1, y1, canvas);
      const p2 = worldToScreen(s, x2, y2, canvas);
      ctx.strokeStyle = "#1b5ea1";
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.closePath(); ctx.stroke();
      ctx.fillStyle = "#23476d";
      ctx.font = "11px Georgia, serif";
      ctx.fillText(`a=${a.toFixed(1)}`, (p0.x + p1.x) / 2, p0.y + 12);
      ctx.fillText(`b=${b.toFixed(1)}`, (p0.x + p2.x) / 2 - 15, (p0.y + p2.y) / 2);
      ctx.fillText(`c=${c.toFixed(1)}`, (p1.x + p2.x) / 2 + 5, (p1.y + p2.y) / 2);
      ctx.fillText(`γ=${gamma.toFixed(0)}°`, p0.x + 12, p0.y - 8);
      return `\\(\\text{Kosinussatz: } c \\approx ${c.toFixed(3)}; \\text{Fläche } A \\approx ${(0.5 * a * b * Math.sin(rad)).toFixed(3)}\\)`;
    }
    case "space_angle": {
      const { edge, ux, uy, uz, vx, vy, vz, nx, ny, nz } = vals;
      drawSolidBox(canvas, state);
      const alphaCube = (Math.acos(1 / Math.sqrt(3)) * 180) / pi;
      const dotUV = ux * vx + uy * vy + uz * vz;
      const lenU = Math.hypot(ux, uy, uz);
      const lenV = Math.hypot(vx, vy, vz);
      const cosPhi = lenU > 1e-9 && lenV > 1e-9 ? Math.max(-1, Math.min(1, dotUV / (lenU * lenV))) : 1;
      const phi = (Math.acos(cosPhi) * 180) / pi;

      const dotDN = ux * nx + uy * ny + uz * nz;
      const lenN = Math.hypot(nx, ny, nz);
      const sinBeta = lenU > 1e-9 && lenN > 1e-9 ? Math.max(-1, Math.min(1, Math.abs(dotDN) / (lenU * lenN))) : 0;
      const beta = (Math.asin(sinBeta) * 180) / pi;

      return `Würfel-Spezialfall: α≈${alphaCube.toFixed(2)}°. Gerade-Gerade aus u und v: φ≈${phi.toFixed(2)}°. Gerade-Ebene aus d=u und n: β≈${beta.toFixed(2)}°.`;
    }
    default:
      return "Zu diesem Eingabestand ist noch keine eigene Rückmeldung hinterlegt.";
  }
}

function randomExercise(goalId, goalState) {
  const rnd = (min, max) => min + Math.random() * (max - min);
  const pi = Math.PI;
  const randomDifficulty = () => {
    const r = Math.random();
    if (r < 0.4) return "leicht";
    if (r < 0.8) return "mittel";
    return "schwer";
  };
  const withDifficulty = (payload, forcedDifficulty) => ({
    ...payload,
    difficulty: forcedDifficulty || payload.difficulty || randomDifficulty()
  });
  const ref = getGoalById(goalId);
  const active = ref ? getActiveGoalContent(ref.goal, goalState || ensureGoalState(goalId, ref.topic)) : null;
  if (active && ref && isAdaptiveGoal(ref.goal)) {
    if (goalId === "pow_log") {
      const variantId = active.variant?.id;
      const modeId = active.mode?.id;
      if (variantId === "powers" && modeId === "rules") {
        const a = Math.round(rnd(2, 6));
        const m = Math.round(rnd(2, 6));
        const n = Math.round(rnd(2, 6));
        return withDifficulty({ q: `Vereinfache den Term ${a}^${m}*${a}^${n}.`, qLatex: `\\[${a}^{${m}}\\cdot ${a}^{${n}}\\]`, s: `${a}^${m + n}`, sLatex: `\\(${a}^{${m + n}}\\)`, params: { a, m, n } });
      }
      if (variantId === "powers" && modeId === "equations") {
        const base = Math.round(rnd(2, 5));
        const x = Math.round(rnd(2, 7));
        const target = Math.pow(base, x);
        return withDifficulty({ q: `Löse die Potenzgleichung ${base}^x=${target}.`, qLatex: `\\[${base}^x=${target}\\]`, s: `x=${x}`, sLatex: `\\(x=${x}\\)`, params: { base, target } });
      }
      if (variantId === "powers" && modeId === "applications") {
        const n0 = Math.round(rnd(80, 180));
        const q = Math.round(rnd(105, 135)) / 100;
        const t = Math.round(rnd(3, 8));
        const value = n0 * Math.pow(q, t);
        return withDifficulty({ q: `Ein Bestand startet bei ${n0} und wächst je Schritt mit Faktor ${q}. Wie groß ist der Bestand nach ${t} Schritten?`, qLatex: `\\[N=${n0}\\cdot ${q}^{${t}}\\]`, s: `N≈${value.toFixed(2)}`, sLatex: `\\(N\\approx ${value.toFixed(2)}\\)`, params: { n0, q, t } });
      }
      if (variantId === "roots" && modeId === "rules") {
        const rad = Math.round(rnd(32, 196));
        return withDifficulty({ q: `Vereinfache die Wurzel aus ${rad} soweit wie möglich.`, qLatex: `\\[\\sqrt{${rad}}\\]`, s: `\\sqrt{${rad}}≈${Math.sqrt(rad).toFixed(3)}`, sLatex: `\\(\\sqrt{${rad}}\\approx ${Math.sqrt(rad).toFixed(3)}\\)`, params: { rad, n: 2 } });
      }
      if (variantId === "roots" && modeId === "equations") {
        const c = Math.round(rnd(2, 10));
        const d = Math.round(rnd(3, 9));
        return withDifficulty({ q: `Löse die Gleichung \\sqrt{x+${c}}=${d} und prüfe per Probe.`, qLatex: `\\[\\sqrt{x+${c}}=${d}\\]`, s: `x=${d * d - c}`, sLatex: `\\(x=${d * d - c}\\)`, params: { c, d } });
      }
      if (variantId === "roots" && modeId === "applications") {
        const A = Math.round(rnd(64, 324));
        return withDifficulty({ q: `Ein quadratisches Beet hat die Fläche ${A}. Bestimme die Seitenlänge.`, qLatex: `\\[a=\\sqrt{${A}}\\]`, s: `a=${Math.sqrt(A).toFixed(3)}`, sLatex: `\\(a=${Math.sqrt(A).toFixed(3)}\\)`, params: { A } });
      }
      if (variantId === "logs" && modeId === "rules") {
        const base = 10;
        const u = Math.pow(10, Math.round(rnd(1, 2)));
        const v = Math.pow(10, Math.round(rnd(2, 4)));
        return withDifficulty({ q: `Nutze Logarithmusregeln und berechne \\log_${base}(${u}*${v}).`, qLatex: `\\[\\log_{${base}}(${u}\\cdot ${v})\\]`, s: `${Math.log10(u * v).toFixed(3)}`, sLatex: `\\(${Math.log10(u * v).toFixed(3)}\\)`, params: { base, u, v } });
      }
      if (variantId === "logs" && modeId === "equations") {
        const base = Math.round(rnd(2, 5));
        const c = Math.round(rnd(2, 6));
        return withDifficulty({ q: `Löse die Logarithmusgleichung \\log_${base}(x)=${c}.`, qLatex: `\\[\\log_{${base}}(x)=${c}\\]`, s: `x=${Math.pow(base, c)}`, sLatex: `\\(x=${Math.pow(base, c)}\\)`, params: { base, c } });
      }
      if (variantId === "logs" && modeId === "applications") {
        const c = Math.pow(10, -Math.round(rnd(2, 5)));
        const ph = -Math.log10(c);
        return withDifficulty({ q: `Berechne den pH-Wert einer Lösung mit Konzentration c=${c}.`, qLatex: `\\[\\mathrm{pH}=-\\log_{10}(${c})\\]`, s: `pH=${ph.toFixed(3)}`, sLatex: `\\(\\mathrm{pH}=${ph.toFixed(3)}\\)`, params: { c } });
      }
      if (variantId === "mixed" && modeId === "rules") {
        const a = Math.pow(2, Math.round(rnd(3, 6)));
        const k = Math.round(rnd(2, 4));
        return withDifficulty({ q: `Kombiniere Potenz- und Logarithmusregeln: \\log_2(${a}^${k}).`, qLatex: `\\[\\log_2(${a}^{${k}})\\]`, s: `${k * Math.log2(a)}`, sLatex: `\\(${k * Math.log2(a)}\\)`, params: { a, k } });
      }
      if (variantId === "mixed" && modeId === "equations") {
        const a = Math.round(rnd(4, 9));
        const base = Math.round(rnd(2, 4));
        const c = Math.round(rnd(3, 6));
        return withDifficulty({ q: `Löse das gemischte Set: \\sqrt{x}=${a} und \\log_${base}(y)=${c}.`, qLatex: `\\[\\sqrt{x}=${a},\\;\\log_{${base}}(y)=${c}\\]`, s: `x=${a * a}, y=${Math.pow(base, c)}`, sLatex: `\\(x=${a * a},\\;y=${Math.pow(base, c)}\\)`, params: { a, base, c } });
      }
      const T0 = Math.round(rnd(30, 90));
      const q = Math.round(rnd(104, 125)) / 100;
      const n = Math.round(rnd(4, 10));
      const Tn = Math.round(T0 * Math.pow(q, n));
      return withDifficulty({ q: `Bestimme die benötigte Zeit n aus ${Tn}=${T0}*${q}^n.`, qLatex: `\\[${Tn}=${T0}\\cdot ${q}^n\\]`, s: `n≈${(Math.log(Tn / T0) / Math.log(q)).toFixed(3)}`, sLatex: `\\(n\\approx ${(Math.log(Tn / T0) / Math.log(q)).toFixed(3)}\\)`, params: { T0, q, Tn } });
    }
    if (goalId === "interest") {
      const variantId = active.variant?.id;
      if (variantId === "compound") {
        const k0 = Math.round(rnd(500, 2500));
        const p = Math.round(rnd(2, 8));
        const n = Math.round(rnd(3, 14));
        const kn = k0 * Math.pow(1 + p / 100, n);
        return withDifficulty({ q: `Startkapital ${k0}, Zinssatz ${p}% für ${n} Jahre. Bestimme das Endkapital.`, qLatex: `\\[K_n=${k0}\\cdot\\left(1+\\frac{${p}}{100}\\right)^{${n}}\\]`, s: `K_n=${kn.toFixed(2)}`, sLatex: `\\(K_n\\approx ${kn.toFixed(2)}\\)`, params: { k0, p, n } });
      }
      if (variantId === "target_intersection") {
        const k0 = Math.round(rnd(800, 1800));
        const p = Math.round(rnd(3, 8));
        const years = Math.round(rnd(6, 14));
        const target = Math.round(k0 * Math.pow(1 + p / 100, years));
        const n = Math.log(target / k0) / Math.log(1 + p / 100);
        return withDifficulty({ q: `Wann erreicht ein Kapital von ${k0} EUR bei ${p}% p.a. das Ziel ${target} EUR?`, qLatex: `\\[${k0}\\cdot\\left(1+\\frac{${p}}{100}\\right)^n=${target}\\]`, s: `n≈${n.toFixed(3)} Jahre`, sLatex: `\\(n\\approx ${n.toFixed(3)}\\)`, params: { k0, p, target } });
      }
      const k0 = Math.round(rnd(900, 1500));
      const p = Math.round(rnd(3, 7));
      const lineM = Math.round(rnd(60, 120));
      const lineQ = Math.round(rnd(700, 1200));
      return withDifficulty({ q: `Bestimme den Schnittpunkt zwischen Zinseszins ${k0}*(1+${p}/100)^x und linearem Modell ${lineM}x+${lineQ}.`, qLatex: `\\[${k0}\\left(1+\\frac{${p}}{100}\\right)^x=${lineM}x+${lineQ}\\]`, s: "Schnittpunkt numerisch in der Sandbox bestimmen.", sLatex: "\\(\\text{Nutze Plot und numerische Suche}\\)", params: { k0, p, lineM, lineQ } }, "schwer");
    }
    if (goalId === "plane_measurement") {
      const variantId = active.variant?.id;
      const modeId = active.mode?.id || "area";
      if (variantId === "rectangle") {
        const a = Math.round(rnd(4, 12));
        const b = Math.round(rnd(3, 10));
        if (modeId === "perimeter") {
          return { q: `Ein Rechteck hat die Seiten ${a} und ${b}. Berechne den Umfang.`, qLatex: `\\(a=${a},\\;b=${b}\\)`, s: `U=${2 * (a + b)}`, sLatex: `\\(U=${2 * (a + b)}\\)`, params: { a, b }, modeId };
        }
        return { q: `Ein Rechteck hat die Seiten ${a} und ${b}. Berechne die Fläche.`, qLatex: `\\(a=${a},\\;b=${b}\\)`, s: `A=${a * b}`, sLatex: `\\(A=${a * b}\\)`, params: { a, b }, modeId };
      }
      if (variantId === "triangle") {
        const g = Math.round(rnd(4, 12));
        const h = Math.round(rnd(3, 9));
        const a = g;
        const b = h;
        const c = Number(Math.hypot(a, b).toFixed(3));
        if (modeId === "perimeter") {
          return { q: `Dreieck mit Seiten a=${a}, b=${b}, c=${c}. Berechne den Umfang.`, qLatex: `\\(a=${a},\\;b=${b},\\;c=${c}\\)`, s: `U=${(a + b + c).toFixed(3)}`, sLatex: `\\(U=${(a + b + c).toFixed(3)}\\)`, params: { g, h, a, b, c }, modeId };
        }
        return { q: `Ein Dreieck hat Grundseite ${g} und Höhe ${h}. Berechne die Fläche.`, qLatex: `\\(g=${g},\\;h=${h}\\)`, s: `A=${0.5 * g * h}`, sLatex: `\\(A=${0.5 * g * h}\\)`, params: { g, h, a, b, c }, modeId };
      }
      if (variantId === "circle") {
        const r = Math.round(rnd(2, 9));
        if (modeId === "perimeter") {
          return { q: `Ein Kreis hat Radius ${r}. Berechne den Umfang.`, qLatex: `\\(r=${r}\\)`, s: `U=${(2 * pi * r).toFixed(2)}`, sLatex: `\\(U\\approx ${(2 * pi * r).toFixed(2)}\\)`, params: { r }, modeId };
        }
        return { q: `Ein Kreis hat Radius ${r}. Berechne die Fläche.`, qLatex: `\\(r=${r}\\)`, s: `A=${(pi * r * r).toFixed(2)}`, sLatex: `\\(A\\approx ${(pi * r * r).toFixed(2)}\\)`, params: { r }, modeId };
      }
      if (variantId === "rect_triangle") {
        const w = Math.round(rnd(8, 16));
        const h = Math.round(rnd(6, 12));
        const tb = w;
        const th = h;
        if (modeId === "perimeter") {
          return { q: `Ein Rechteck hat Breite ${w} und Höhe ${h}. Berechne den Rahmenumfang.`, qLatex: `\\(U=2(w+h)\\)`, s: `U=${2 * (w + h)}`, sLatex: `\\(U=${2 * (w + h)}\\)`, params: { w, h, tb, th }, modeId };
        }
        return { q: `In einem Rechteck ${w} x ${h} liegt ein Dreieck mit Grundseite ${w} und Höhe ${h}. Bestimme die Restfläche.`, qLatex: `\\(A_{Rest}=A_R-A_D\\)`, s: `A_rest=${w * h - 0.5 * w * h}`, sLatex: `\\(A_{Rest}=${w * h - 0.5 * w * h}\\)`, params: { w, h, tb, th }, modeId };
      }
      if (variantId === "similarity") {
        const k = rnd(1.2, 3);
        const L = Math.round(rnd(5, 12));
        const A = Math.round(rnd(15, 50));
        const kNum = parseFloat(k.toFixed(2));
        if (modeId === "length") {
          return { q: `Eine Figur wird mit Faktor ${kNum} skaliert. Originallaenge ${L}. Welche neue Laenge entsteht?`, qLatex: `\\(L'=${kNum}\\cdot L\\)`, s: `L'=${(kNum * L).toFixed(2)}`, sLatex: `\\(L'=${(kNum * L).toFixed(2)}\\)`, params: { k: kNum, L, A }, modeId };
        }
        return { q: `Eine Figur wird mit Faktor ${kNum} skaliert. Originalfläche ${A}. Welche neue Fläche entsteht?`, qLatex: `\\(A'=${kNum}^2\\cdot A\\)`, s: `A'=${(kNum * kNum * A).toFixed(2)}`, sLatex: `\\(A'=${(kNum * kNum * A).toFixed(2)}\\)`, params: { k: kNum, L, A }, modeId };
      }
      const w = Math.round(rnd(8, 14));
      const h = Math.round(rnd(5, 10));
      const r = Math.round(rnd(2, 5));
      if (modeId === "perimeter") {
        return { q: "Bestimme den Außenumfang der zusammengesetzten Figur aus Rechteck und Halbkreis.", qLatex: `\\(w=${w},\\;h=${h},\\;r=${r}\\)`, s: `U=${(2 * w + 2 * h - 2 * r + pi * r).toFixed(2)}`, sLatex: `\\(U\\approx ${(2 * w + 2 * h - 2 * r + pi * r).toFixed(2)}\\)`, params: { w, h, r }, modeId };
      }
      return { q: "Zerlege die zusammengesetzte Figur in Rechteck und Halbkreis und berechne die Fläche.", qLatex: `\\(w=${w},\\;h=${h},\\;r=${r}\\)`, s: `A=${(w * h + 0.5 * pi * r * r).toFixed(2)}`, sLatex: `\\(A\\approx ${(w * h + 0.5 * pi * r * r).toFixed(2)}\\)`, params: { w, h, r }, modeId };
    }
    if (goalId === "solid_measurement") {
      const variantId = active.variant?.id;
      const modeId = active.mode?.id;
      if (variantId === "box") {
        const a = Math.round(rnd(4, 8)), b = Math.round(rnd(3, 7)), h = Math.round(rnd(3, 7));
        const value = modeId === "volume" ? a * b * h : modeId === "mantle" ? 2 * h * (a + b) : 2 * (a * b + a * h + b * h);
        return { q: `Berechne beim Quader mit a=${a}, b=${b}, h=${h} die Größe ${modeId}.`, qLatex: `\\(a=${a},\\;b=${b},\\;h=${h}\\)`, s: `${modeId === "volume" ? "V" : modeId === "mantle" ? "M" : "O"}=${value}`, sLatex: `\\(${modeId === "volume" ? "V" : modeId === "mantle" ? "M" : "O"}=${value}\\)`, params: { a, b, h } };
      }
      if (variantId === "cylinder") {
        const r = Math.round(rnd(2, 6)), h = Math.round(rnd(4, 10));
        let value, label;
        if (modeId === "volume") { value = (pi * r * r * h).toFixed(2); label = "V"; }
        else if (modeId === "mantle") { value = (2 * pi * r * h).toFixed(2); label = "M"; }
        else { value = (2 * pi * r * r + 2 * pi * r * h).toFixed(2); label = "O"; }
        return { q: `Berechne beim Zylinder mit r=${r}, h=${h} die Größe ${modeId}.`, qLatex: `\\(r=${r},\\;h=${h}\\)`, s: `${label}\\approx${value}`, sLatex: `\\(${label}\\approx ${value}\\)`, params: { r, h } };
      }
      if (variantId === "cone") {
        const r = Math.round(rnd(2, 6)), h = Math.round(rnd(4, 10)), s = Math.round(Math.sqrt(r * r + h * h) * 10) / 10;
        let value, label;
        if (modeId === "volume") { value = ((1 / 3) * pi * r * r * h).toFixed(2); label = "V"; }
        else if (modeId === "mantle") { value = (pi * r * s).toFixed(2); label = "M"; }
        else { value = (pi * r * r + pi * r * s).toFixed(2); label = "O"; }
        return { q: `Berechne beim Kegel mit r=${r}, h=${h}, s=${s} die Größe ${modeId}.`, qLatex: `\\(r=${r},\\;h=${h},\\;s=${s}\\)`, s: `${label}\\approx${value}`, sLatex: `\\(${label}\\approx ${value}\\)`, params: { r, h, s } };
      }
      if (variantId === "sphere") {
        const r = Math.round(rnd(2, 6));
        let value, label;
        if (modeId === "volume") { value = ((4 / 3) * pi * Math.pow(r, 3)).toFixed(2); label = "V"; }
        else { value = (4 * pi * r * r).toFixed(2); label = "O"; }
        return { q: `Berechne bei der Kugel mit r=${r} die Größe ${modeId}.`, qLatex: `\\(r=${r}\\)`, s: `${label}\\approx${value}`, sLatex: `\\(${label}\\approx ${value}\\)`, params: { r } };
      }
      if (variantId === "prism") {
        const G = Math.round(rnd(12, 30)), u = Math.round(rnd(12, 24)), h = Math.round(rnd(4, 10));
        let value, label;
        if (modeId === "volume") { value = G * h; label = "V"; }
        else if (modeId === "mantle") { value = u * h; label = "M"; }
        else { value = 2 * G + u * h; label = "O"; }
        return { q: `Berechne beim Prisma mit G=${G}, u_G=${u}, h=${h} die Größe ${modeId}.`, qLatex: `\\(G=${G},\\;u_G=${u},\\;h=${h}\\)`, s: `${label}=${value}`, sLatex: `\\(${label}=${value}\\)`, params: { G, u, h } };
      }
      if (variantId === "pyramid") {
        const G = Math.round(rnd(15, 36)), u = Math.round(rnd(12, 24)), h = Math.round(rnd(4, 10)), s = Math.round(Math.sqrt(h * h + 4) * 10) / 10;
        let value, label;
        if (modeId === "volume") { value = ((1 / 3) * G * h).toFixed(2); label = "V"; }
        else if (modeId === "mantle") { value = (0.5 * u * s).toFixed(2); label = "M"; }
        else { value = (G + 0.5 * u * s).toFixed(2); label = "O"; }
        return { q: `Berechne bei der Pyramide mit G=${G}, u_G=${u}, h=${h}, s=${s} die Größe ${modeId}.`, qLatex: `\\(G=${G},\\;u_G=${u},\\;h=${h},\\;s=${s}\\)`, s: `${label}\\approx${value}`, sLatex: `\\(${label}\\approx ${value}\\)`, params: { G, u, h, s } };
      }
      if (variantId === "cut_compose") {
        const a = Math.round(rnd(6, 12)), cut = Math.round(rnd(1, 3));
        let value, label, desc;
        if (modeId === "restvolume") { value = (Math.pow(a, 3) - Math.pow(cut, 3) / 6).toFixed(2); label = "V_rest"; desc = "Restvolumen"; }
        else if (modeId === "surface") { value = (6 * a * a - 3 * cut * cut / 2).toFixed(2); label = "O_neu"; desc = "Neue Oberfläche"; }
        else { label = "Zählaufgabe"; desc = "Ecken/Kanten/Flächen"; value = "gezählt"; }
        return { q: `Berechne beim veränderten Würfel (a=${a}, Schnitt=${cut}) die ${desc}.`, qLatex: `\\(a=${a},\\;\\text{Schnitt}=${cut}\\)`, s: `${label}=${value}`, sLatex: `\\(${label}${label !== "Zählaufgabe" ? "=" + value : "\\text{ (systematisch zählen)}"} \\)`, params: { a, cut } };
      }
      return { q: `Berechne beim gewählten Körper die Zielgröße ${active.mode?.label || ""}.`, s: "Nutze die aktuelle Formel aus dem Theorieteil und setze die Eingaben sauber ein." };
    }
    if (goalId === "triangle_trig") {
      const variantId = active.variant?.id;
      if (variantId === "right_triangle") {
        const adj = Math.round(rnd(5, 12));
        const alpha = Math.round(rnd(25, 65));
        const opp = (adj * Math.tan((alpha * pi) / 180)).toFixed(2);
        const hyp = (adj / Math.cos((alpha * pi) / 180)).toFixed(2);
        return { q: `Im rechtwinkligen Dreieck sind Ankathete ${adj} und Winkel ${alpha}° gegeben. Berechne Gegenkathete und Hypotenuse.`, qLatex: `\\(AK=${adj},\\;\\alpha=${alpha}^\\circ\\)`, s: `GK=${opp}, H=${hyp}`, sLatex: `\\(GK\\approx ${opp},\\;H\\approx ${hyp}\\)`, params: { adj, alpha } };
      }
      if (variantId === "any_triangle") {
        const a = Math.round(rnd(5, 10)), b = Math.round(rnd(4, 9)), gamma = Math.round(rnd(35, 120));
        const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos((gamma * pi) / 180)).toFixed(2);
        return { q: `Gegeben sind a=${a}, b=${b} und γ=${gamma}°. Berechne c mit dem Kosinussatz.`, qLatex: `\\(a=${a},\\;b=${b},\\;\\gamma=${gamma}^\\circ\\)`, s: `c=${c}`, sLatex: `\\(c\\approx ${c}\\)`, params: { a, b, gamma } };
      }
      if (variantId === "space_angle") {
        const edge = Math.round(rnd(3, 8));
        return { q: `Bestimme den Winkel zwischen zwei Raumrichtungen oder zwischen Gerade und Ebene mit Skalarprodukt und Normalenvektor für einen Würfel mit Kantenlänge ${edge}.`, qLatex: `\\(a=${edge}\\)`, s: "Nutze die Formel: cos(φ) = |u·v|/(|u|·|v|) oder Normalenvektoren.", sLatex: `\\(\\cos(\\varphi)=\\frac{|\\mathbf{u}\\cdot\\mathbf{v}|}{|\\mathbf{u}|\\cdot|\\mathbf{v}|}\\)`, params: { edge } };
      }
      return {
        q: "Bestimme den Winkel zwischen zwei Raumrichtungen oder zwischen Gerade und Ebene mit Skalarprodukt und Normalenvektor.",
        s: "Nutze die eingeblendete Formelstruktur und rechne zuerst Skalarprodukt und Beträge aus.",
        params: { edge: 4, ux: 1, uy: 2, uz: 2, vx: 2, vy: 1, vz: 2, nx: 0, ny: 0, nz: 1 }
      };
    }
  }
  switch (goalId) {
    case "lgs2": {
      const x = Math.round(rnd(-4, 4));
      const y = Math.round(rnd(-4, 4));
      const a1 = Math.round(rnd(1, 4));
      const b1 = Math.round(rnd(1, 4));
      const c1 = a1 * x + b1 * y;
      const a2 = Math.round(rnd(1, 4));
      const b2 = -Math.round(rnd(1, 4));
      const c2 = a2 * x + b2 * y;
      if (Math.random() < 0.5) {
        return {
          q: `Löse das lineare Gleichungssystem mit zwei Variablen.`,
          qLatex: `\\[\\begin{aligned}\\text{I: }&${a1}x${b1 >= 0 ? "+" : ""}${b1}y=${c1}\\\\\\text{II: }&${a2}x${b2 >= 0 ? "+" : ""}${b2}y=${c2}\\end{aligned}\\]`,
          s: `Lösung: x=${x}, y=${y}`,
          sLatex: `\\(x=${x},\\;y=${y}\\)`,
          params: { a: a1, b: b1, e: c1, c: a2, d: b2, f: c2 }
        };
      }
      return {
        q: `Gegeben Lösungspunkt x=${x}, y=${y}. Bestimme c2.`,
        qLatex: `\\[\\text{Gegeben: }x=${x},\\;y=${y},\\;\\text{gesucht: }c_2\\text{ in }${a2}x${b2 >= 0 ? "+" : ""}${b2}y=c_2\\]`,
        s: `c2 = ${c2}`,
        sLatex: `\\(c_2=${c2}\\)`,
        params: { a: a1, b: b1, e: c1, c: a2, d: b2, f: c2 }
      };
    }
    case "lgs3": {
      const x = Math.round(rnd(-3, 3));
      const y = Math.round(rnd(-3, 3));
      const z = Math.round(rnd(-3, 3));
      const a1 = Math.round(rnd(1, 3)), b1 = Math.round(rnd(1, 3)), c1 = Math.round(rnd(1, 3));
      const d1 = a1 * x + b1 * y + c1 * z;
      const a2 = Math.round(rnd(1, 3)), b2 = Math.round(rnd(1, 3)), c2 = Math.round(rnd(1, 3));
      const d2 = a2 * x + b2 * y + c2 * z;
      const a3 = Math.round(rnd(1, 3)), b3 = Math.round(rnd(1, 3)), c3 = Math.round(rnd(1, 3));
      const d3 = a3 * x + b3 * y + c3 * z;
      return {
        q: "Löse das lineare 3x3 Gleichungssystem.",
        qLatex: `\\[\\begin{aligned}\\text{I: }&${a1}x${b1 >= 0 ? "+" : ""}${b1}y${c1 >= 0 ? "+" : ""}${c1}z=${d1}\\\\\\text{II: }&${a2}x${b2 >= 0 ? "+" : ""}${b2}y${c2 >= 0 ? "+" : ""}${c2}z=${d2}\\\\\\text{III: }&${a3}x${b3 >= 0 ? "+" : ""}${b3}y${c3 >= 0 ? "+" : ""}${c3}z=${d3}\\end{aligned}\\]`,
        s: `Lösung: x=${x}, y=${y}, z=${z}`,
        sLatex: `\\(x=${x},\\;y=${y},\\;z=${z}\\)`,
        params: { a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3 }
      };
    }
    case "quad_methods": {
      const x1 = Math.round(rnd(-4, 4));
      const x2 = Math.round(rnd(-4, 4));
      const a = 1;
      const b = -(x1 + x2);
      const c = x1 * x2;
      return {
        q: `Löse ${a}x^2${b >= 0 ? "+" : ""}${b}x${c >= 0 ? "+" : ""}${c}=0`,
        qLatex: `\\[${a}x^2${b >= 0 ? "+" : ""}${b}x${c >= 0 ? "+" : ""}${c}=0\\]`,
        s: `Nullstellen: x1=${x1}, x2=${x2}`,
        sLatex: `\\(x_1=${x1},\\;x_2=${x2}\\)`,
        params: { a, b, c }
      };
    }
    case "pow_log": {
      const a = Math.round(rnd(2, 5));
      const m = Math.round(rnd(2, 5));
      const n = Math.round(rnd(2, 5));
      if (Math.random() < 0.5) {
        return {
          q: `Vereinfache: ${a}^${m} * ${a}^${n}`,
          qLatex: `\\[${a}^{${m}} \\cdot ${a}^{${n}}\\]`,
          s: `${a}^${m + n}`,
          sLatex: `\\(${a}^{${m + n}}\\)`,
          params: { a, m, n }
        };
      }
      return {
        q: `Vereinfache: ${a}^${m + n} / ${a}^${n}`,
        qLatex: `\\[\\frac{${a}^{${m + n}}}{${a}^{${n}}}\\]`,
        s: `${a}^${m}`,
        sLatex: `\\(${a}^{${m}}\\)`,
        params: { a, m: m + n, n }
      };
    }
    case "exp_log_eq": {
      const base = Math.round(rnd(2, 4));
      const x = Math.round(rnd(2, 5));
      const result = Math.pow(base, x);
      if (Math.random() < 0.5) {
        return {
          q: `Löse ${base}^x = ${result}`,
          qLatex: `\\[${base}^x=${result}\\]`,
          s: `x = ${x}`,
          sLatex: `\\(x=${x}\\)`,
          params: { base, x }
        };
      }
      return {
        q: `Bestimme die Basis b: b^${x} = ${result}`,
        qLatex: `\\[b^{${x}}=${result}\\]`,
        s: `b = ${base}`,
        sLatex: `\\(b=${base}\\)`,
        params: { base, x }
      };
    }
    case "interest": {
      const k0 = Math.round(rnd(500, 2000));
      const p = Math.round(rnd(1, 7));
      const n = Math.round(rnd(2, 12));
      const kn = k0 * Math.pow(1 + p / 100, n);
      if (Math.random() < 0.5) {
        return {
          q: `Startkapital ${k0}, Zinssatz ${p}% für ${n} Jahre. Endkapital?`,
          qLatex: `\\[K_n=${k0}\\cdot\\left(1+\\frac{${p}}{100}\\right)^{${n}}\\]`,
          s: `K_n=${kn.toFixed(2)}`,
          sLatex: `\\(K_n\\approx ${kn.toFixed(2)}\\)`,
          params: { k0, p, n }
        };
      }
      return {
        q: `Endkapital ${kn.toFixed(2)} aus Startkapital ${k0} bei ${p}% Zins. Gesuchte Laufzeit n (nahezu)?`,
        qLatex: `\\[${kn.toFixed(2)}=${k0}\\cdot\\left(1+\\frac{${p}}{100}\\right)^n\\]`,
        s: `n≈${(Math.log(kn / k0) / Math.log(1 + p / 100)).toFixed(2)}`,
        sLatex: `\\(n\\approx ${(Math.log(kn / k0) / Math.log(1 + p / 100)).toFixed(2)}\\)`,
        params: { k0, p, n }
      };
    }
    case "lin_quad_plot": {
      const a = Math.round(rnd(1, 3));
      const b = Math.round(rnd(-4, 4));
      const c = Math.round(rnd(-5, 4));
      const m = Math.round(rnd(-3, 3));
      const q = Math.round(rnd(-4, 4));
      const A = a;
      const B = b - m;
      const C = c - q;
      const D = B * B - 4 * A * C;
      if (D < 0) {
        return {
          q: `Bestimme die Schnittpunkte von f(x)=${a}x²${b >= 0 ? "+" : ""}${b}x${c >= 0 ? "+" : ""}${c} und g(x)=${m}x${q >= 0 ? "+" : ""}${q}.`,
          qLatex: `\\[f(x)=${a}x^2${b >= 0 ? "+" : ""}${b}x${c >= 0 ? "+" : ""}${c},\\quad g(x)=${m}x${q >= 0 ? "+" : ""}${q}\\]`,
          s: `Keine reellen Schnittpunkte (D=${D.toFixed(2)}).`,
          sLatex: `\\(D=${D.toFixed(2)}<0\\Rightarrow\\text{ keine reellen Schnittpunkte}\\)`,
          params: { a, b, c, m, q }
        };
      }
      const x1 = (-B + Math.sqrt(Math.max(0, D))) / (2 * A);
      const x2 = (-B - Math.sqrt(Math.max(0, D))) / (2 * A);
      const y1 = m * x1 + q;
      const y2 = m * x2 + q;
      if (Math.abs(D) < 1e-9) {
        return {
          q: `Bestimme den Berührpunkt von f(x)=${a}x²${b >= 0 ? "+" : ""}${b}x${c >= 0 ? "+" : ""}${c} und g(x)=${m}x${q >= 0 ? "+" : ""}${q}.`,
          qLatex: `\\[f(x)=${a}x^2${b >= 0 ? "+" : ""}${b}x${c >= 0 ? "+" : ""}${c},\\quad g(x)=${m}x${q >= 0 ? "+" : ""}${q}\\]`,
          s: `S(${x1.toFixed(2)}|${y1.toFixed(2)})`,
          sLatex: `\\(S\\left(${x1.toFixed(2)}\\mid ${y1.toFixed(2)}\\right)\\)`,
          params: { a, b, c, m, q }
        };
      }
      return {
        q: `Bestimme die Schnittpunkte von f(x)=${a}x²${b >= 0 ? "+" : ""}${b}x${c >= 0 ? "+" : ""}${c} und g(x)=${m}x${q >= 0 ? "+" : ""}${q}.`,
        qLatex: `\\[f(x)=${a}x^2${b >= 0 ? "+" : ""}${b}x${c >= 0 ? "+" : ""}${c},\\quad g(x)=${m}x${q >= 0 ? "+" : ""}${q}\\]`,
        s: `S1(${x1.toFixed(2)}|${y1.toFixed(2)}), S2(${x2.toFixed(2)}|${y2.toFixed(2)})`,
        sLatex: `\\(S_1\\left(${x1.toFixed(2)}\\mid ${y1.toFixed(2)}\\right),\\;S_2\\left(${x2.toFixed(2)}\\mid ${y2.toFixed(2)}\\right)\\)`,
        params: { a, b, c, m, q }
      };
    }
    case "eq_from_points": {
      const x1 = Math.round(rnd(-4, 4));
      const y1 = Math.round(rnd(-4, 4));
      const x2 = x1 + Math.round(rnd(1, 4));
      const y2 = y1 + Math.round(rnd(1, 5));
      const m = (y2 - y1) / (x2 - x1);
      const q = y1 - m * x1;
      return {
        q: `Finde die Gleichung durch P(${x1},${y1}) und Q(${x2},${y2}).`,
        qLatex: `\\[P(${x1}\\mid ${y1}),\\quad Q(${x2}\\mid ${y2})\\]`,
        s: `y=${m.toFixed(2)}x${q >= 0 ? "+" : ""}${q.toFixed(2)}`,
        sLatex: `\\[y=${m.toFixed(2)}x${q >= 0 ? "+" : ""}${q.toFixed(2)}\\]`,
        params: { x1, y1, x2, y2 }
      };
    }
    case "parabola_props": {
      const a = Math.round(rnd(1, 3));
      const xs = Math.round(rnd(-4, 4));
      const ys = Math.round(rnd(-4, 4));
      const b = -2 * a * xs;
      const c = a * xs * xs + ys;
      return {
        q: `f(x)=${a}x^2${b >= 0 ? "+" : ""}${b}x${c >= 0 ? "+" : ""}${c}: Finde Scheitelpunkt und Symmetrieachse.`,
        qLatex: `\\[f(x)=${a}x^2${b >= 0 ? "+" : ""}${b}x${c >= 0 ? "+" : ""}${c}\\]`,
        s: `S(${xs}|${ys}), Achse: x=${xs}`,
        sLatex: `\\(S(${xs}\\mid ${ys}),\\;x=${xs}\\)`,
        params: { a, b, c }
      };
    }
    case "expo_growth": {
      const a = Math.round(rnd(1, 3));
      const b = rnd(1.1, 2.5);
      return {
        q: `f(x)=${a}*${b.toFixed(2)}^x: Wachstum oder Zerfall?`,
        qLatex: `\\[f(x)=${a}\\cdot ${b.toFixed(2)}^x\\]`,
        s: `${b > 1 ? "Wachstum" : "Zerfall"} (b=${b.toFixed(2)})`,
        sLatex: `\\(${b.toFixed(2)}${b > 1 ? ">" : "<"}1\\Rightarrow ${b > 1 ? "Wachstum" : "Zerfall"}\\)`,
        params: { a, b: parseFloat(b.toFixed(2)) }
      };
    }
    case "triangle_lines": {
      const b = Math.round(rnd(4, 12));
      const h = Math.round(rnd(3, 8));
      const area = 0.5 * b * h;
      return {
        q: `Dreieck mit g=${b}, h=${h}. Berechne die Fläche.`,
        qLatex: `\\[g=${b},\\;h=${h}\\]`,
        s: `A = 0.5 * ${b} * ${h} = ${area}`,
        sLatex: `\\[A=\\frac{1}{2}\\cdot ${b}\\cdot ${h}=${area}\\]`,
        params: { b, h }
      };
    }
    case "area_composite": {
      const w = Math.round(rnd(4, 8));
      const h = Math.round(rnd(3, 6));
      const r = Math.round(rnd(2, 4));
      const A = w * h + 0.5 * pi * r * r;
      return {
        q: `Rechteck (${w}x${h}) + Halbkreis (r=${r}): Fläche?`,
        qLatex: `\\[A=${w}\\cdot ${h}+\\frac{1}{2}\\pi\\cdot ${r}^2\\]`,
        s: `A ≈ ${A.toFixed(2)}`,
        sLatex: `\\(A\\approx ${A.toFixed(2)}\\)`,
        params: { w, h, r }
      };
    }
    case "similarity": {
      const k = rnd(1.5, 3);
      const a = Math.round(rnd(4, 8));
      return {
        q: `Ähnlichkeit mit k=${k.toFixed(2)}: Strecke ${a} wird...?`,
        qLatex: `\\[k=${k.toFixed(2)},\\;a=${a}\\]`,
        s: `L'=${(k * a).toFixed(2)}, A'=${(k * k).toFixed(2)}A`,
        sLatex: `\\[L'=${(k * a).toFixed(2)},\\;A'=${(k * k).toFixed(2)}A\\]`,
        params: { k: parseFloat(k.toFixed(2)), a }
      };
    }
    case "solids": {
      const a = Math.round(rnd(2, 5));
      const b = Math.round(rnd(2, 5));
      const h = Math.round(rnd(2, 5));
      const V = a * b * h;
      return {
        q: `Quader mit a=${a}, b=${b}, h=${h}: Volumen?`,
        qLatex: `\\[V=a\\cdot b\\cdot h=${a}\\cdot ${b}\\cdot ${h}\\]`,
        s: `V = ${a}*${b}*${h} = ${V}`,
        sLatex: `\\(V=${V}\\)`,
        params: { a, b, h, r: Math.round(rnd(2, 5)) }
      };
    }
    case "cut_compose": {
      const a = Math.round(rnd(4, 8));
      const cut = Math.round(rnd(1, 3));
      const v = a * a * a - (cut * cut * cut) / 6;
      return {
        q: `Würfel (${a}^3) mit abgeschnittener Ecke (${cut}^3). Volumen?`,
        qLatex: `\\[V\\approx ${a}^3-\\frac{${cut}^3}{6}\\]`,
        s: `V ≈ ${v.toFixed(2)}`,
        sLatex: `\\(V\\approx ${v.toFixed(2)}\\)`,
        params: { a, cut }
      };
    }
    case "any_triangle": {
      const a = rnd(4, 9);
      const b = rnd(4, 9);
      const g = rnd(35, 110);
      const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos((g * pi) / 180));
      const area = 0.5 * a * b * Math.sin((g * pi) / 180);
      if (Math.random() < 0.5) {
        return {
          q: `Gegeben a=${a.toFixed(2)}, b=${b.toFixed(2)}, γ=${g.toFixed(1)}°. Berechne c.`,
          qLatex: `\\[a=${a.toFixed(2)},\\;b=${b.toFixed(2)},\\;\\gamma=${g.toFixed(1)}^\\circ\\]`,
          s: `c≈${c.toFixed(3)}`,
          sLatex: `\\(c\\approx ${c.toFixed(3)}\\)`,
          params: { a: parseFloat(a.toFixed(2)), b: parseFloat(b.toFixed(2)), gamma: parseFloat(g.toFixed(1)) }
        };
      }
      return {
        q: `Gegeben a=${a.toFixed(2)}, b=${b.toFixed(2)}, γ=${g.toFixed(1)}°. Berechne die Fläche A.`,
        qLatex: `\\[A=\\frac{1}{2}ab\\sin(\\gamma),\\;a=${a.toFixed(2)},\\;b=${b.toFixed(2)},\\;\\gamma=${g.toFixed(1)}^\\circ\\]`,
        s: `A≈${area.toFixed(3)}`,
        sLatex: `\\(A\\approx ${area.toFixed(3)}\\)`,
        params: { a: parseFloat(a.toFixed(2)), b: parseFloat(b.toFixed(2)), gamma: parseFloat(g.toFixed(1)) }
      };
    }
    case "space_angle": {
      const edge = Math.round(rnd(3, 8));
      const alpha = (Math.acos(1 / Math.sqrt(3)) * 180) / pi;
      const u = [1, 2, 2];
      const v = [2, 1, 2];
      const dot = u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
      const phi = (Math.acos(dot / (Math.hypot(...u) * Math.hypot(...v))) * 180) / pi;
      return {
        q: `Würfelkante ${edge}: Spezialfallwinkel und zusätzlich Winkel zwischen u=(1,2,2) und v=(2,1,2)?`,
        qLatex: `\\[u=(1,2,2),\\;v=(2,1,2)\\]`,
        s: `Würfel: α≈${alpha.toFixed(2)}°, Vektoren: φ≈${phi.toFixed(2)}°`,
        sLatex: `\\(\\alpha\\approx ${alpha.toFixed(2)}^\\circ,\\;\\varphi\\approx ${phi.toFixed(2)}^\\circ\\)`,
        params: { edge, ux: 1, uy: 2, uz: 2, vx: 2, vy: 1, vz: 2, nx: 0, ny: 0, nz: 1 }
      };
    }
    default:
      return {
        q: "Generiere passende Zufallswerte und berechne die Zielgröße im Sandkasten.",
        s: "Lösungshinweis: Nutze die gezeigte Theorieformel mit deinen Parametern."
      };
  }
}

function buildGoalCard(topic, goal) {
  const card = document.createElement("div");
  card.className = "goal-card";
  card.id = `goal-${goal.id}`;
  const stateEntry = ensureGoalState(goal.id, topic);
  const activeAtStart = getActiveGoalContent(goal, stateEntry);
  if (isAdaptiveGoal(goal) && !stateEntry.activeVariantId && activeAtStart.variant) stateEntry.activeVariantId = activeAtStart.variant.id;
  if (isAdaptiveGoal(goal) && activeAtStart.mode && !stateEntry.activeModeId) stateEntry.activeModeId = activeAtStart.mode.id;
  const reqRefsText = (goal.requirementRefs || []).map((r) => `${r.id}`).join(", ") || "keine";
  const archiveLinks = archiveLinksForGoal(goal.id)
    .map((id) => {
      const item = BASICS_ARCHIVE.find((x) => x.id === id);
      if (!item) return "";
      return `<button type="button" class="archive-jump-btn" data-archive-jump="${id}">${item.title}</button>`;
    })
    .join(" ");

  card.innerHTML = `
    <h4>${goal.title}</h4>
    <p class="goal-meta">Quelle: ${goal.source}</p>
    <p class="goal-req"><strong>Prüfungsanforderung:</strong> ${reqRefsText}</p>
    ${isAdaptiveGoal(goal) ? '<div class="goal-variant-bar" data-variant-bar></div><div class="goal-mode-bar" data-mode-bar></div>' : ''}
    <details class="goal-detail">
      <summary>Theorie</summary>
      <p class="goal-theory goal-detail-content" data-goal-theory></p>
      <div class="goal-detail-content goal-extra-theory-host">${theorySupplementHtml(topic)}</div>
      <div class="goal-source-block"><strong>Quellen:</strong><ul data-goal-sources></ul></div>
    </details>
    <details class="goal-detail">
      <summary>So arbeitest du hier</summary>
      <p class="goal-detail-content" data-goal-operator></p>
    </details>
    <details class="goal-detail">
      <summary>Praxisbeispiele und Anwendungen</summary>
      <div class="goal-detail-content" data-goal-examples></div>
    </details>
    <details class="goal-detail">
      <summary>Wenn dir Vorwissen fehlt</summary>
      <div class="goal-detail-content">
        <p>Wenn du zuerst Grundlagen auffrischen möchtest, helfen dir diese Nachschlageblätter und Zusatzübungen weiter:</p>
        <div>${archiveLinks}</div>
      </div>
    </details>
    <div class="guided-flow">
      <h5>Empfohlener Lernweg für dieses Lernziel</h5>
      <ol class="guided-steps">
        <li data-guided-step="theory">Lies zuerst die Theorie und markiere sie danach als gelernt.</li>
        <li data-guided-step="example">Schau dir mindestens ein Praxisbeispiel an oder lade es in die Sandbox.</li>
        <li data-guided-step="random">Erzeuge danach mindestens eine Zufallsaufgabe und probiere sie selbst.</li>
        <li data-guided-step="attempts">Sammle mindestens 3 bewertete Versuche mit 67% Trefferquote und einem mittleren oder schweren Treffer.</li>
        <li data-guided-step="transfer">Zeige Transfer, indem du ein Beispiel nutzt oder eine Nachschlageübung bearbeitest.</li>
      </ol>
      <p class="guided-next" data-guided-next>Ich berechne den nächsten sinnvollen Schritt für dich ...</p>
    </div>
    <label class="theory-check">
      <input type="checkbox" class="theory-check-input"> Theorie für dieses Lernziel ist für mich klar
    </label>
    <p class="goal-equation formula-latex"></p>
    <div class="sandbox-controls" data-sandbox-controls></div>
    <canvas class="sandbox-canvas" width="360" height="210"></canvas>
    <div class="goal-actions">
      <button class="compute-btn">${goal.noCanvas ? 'Berechnen' : 'Berechnen + Grafik'}</button>
      <button class="exercise-btn">Zufallsaufgabe</button>
      <button class="toggle-btn">Lösung anzeigen/ausblenden</button>
    </div>
    <div class="goal-result">Hier erscheint gleich deine Berechnung.</div>
    <div class="exercise-box">Hier erscheint deine nächste Zufallsaufgabe.</div>
    <div class="goal-solution hidden">Die passende Lösung erscheint, sobald du eine Aufgabe erzeugst.</div>
    <div class="attempt-rating">
      <p>Nach dem Lösen kurz einschätzen:</p>
      <div class="attempt-rating-buttons">
        <button type="button" data-rate="wrong" data-difficulty="medium">Falsch</button>
        <button type="button" data-rate="correct" data-difficulty="easy">Korrekt (einfach)</button>
        <button type="button" data-rate="correct" data-difficulty="medium">Korrekt (mittel)</button>
        <button type="button" data-rate="correct" data-difficulty="hard">Korrekt (schwer)</button>
      </div>
    </div>
  `;

  const canvas = card.querySelector("canvas");
  const result = card.querySelector(".goal-result");
  const exBox = card.querySelector(".exercise-box");
  const sol = card.querySelector(".goal-solution");
  const eqNode = card.querySelector(".goal-equation");
  const theoryCheckInput = card.querySelector(".theory-check-input");
  const state = { scale: 26, tx: 0, ty: 0, panning: false, dragHandle: -1, lx: 0, ly: 0 };
  theoryCheckInput.checked = !!stateEntry.theoryChecked;
  const guidedNextNode = card.querySelector("[data-guided-next]");
  const theoryNode = card.querySelector("[data-goal-theory]");
  const sourceNode = card.querySelector("[data-goal-sources]");
  const operatorNode = card.querySelector("[data-goal-operator]");
  const examplesNode = card.querySelector("[data-goal-examples]");
  const controlsNode = card.querySelector("[data-sandbox-controls]");
  const variantBar = card.querySelector("[data-variant-bar]");
  const modeBar = card.querySelector("[data-mode-bar]");

  function activeBundle() {
    return getActiveGoalContent(goal, ensureGoalState(goal.id, topic));
  }

  function currentControls() {
    return activeBundle().content.controls || [];
  }

  function renderSelectors() {
    if (!isAdaptiveGoal(goal)) return;
    const bundle = activeBundle();
    if (variantBar) {
      variantBar.innerHTML = goal.variants.map((variant) => `<button type="button" class="variant-chip${bundle.variant?.id === variant.id ? ' active' : ''}" data-variant-id="${variant.id}">${variant.label}</button>`).join("");
      variantBar.querySelectorAll("[data-variant-id]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const entry = ensureGoalState(goal.id, topic);
          entry.activeVariantId = btn.dataset.variantId;
          const variant = getVariantById(goal, entry.activeVariantId);
          entry.activeModeId = getDefaultMode(goal, variant)?.id || null;
          saveLearningState();
          renderBundle();
        });
      });
    }
    if (modeBar) {
      const modes = getVariantModes(goal, bundle.variant);
      modeBar.innerHTML = modes.length ? modes.map((mode) => `<button type="button" class="variant-chip${bundle.mode?.id === mode.id ? ' active' : ''}" data-mode-id="${mode.id}">${mode.label}</button>`).join("") : "";
      modeBar.classList.toggle("hidden", !modes.length);
      modeBar.querySelectorAll("[data-mode-id]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const entry = ensureGoalState(goal.id, topic);
          entry.activeModeId = btn.dataset.modeId;
          saveLearningState();
          renderBundle();
        });
      });
    }
  }

  function renderBundle() {
    const bundle = activeBundle();
    const content = bundle.content;
    const didactic = content.didactic || {};
    const stepsHtml = Array.isArray(didactic.steps) && didactic.steps.length
      ? `<div class="goal-extra-theory"><p><strong>Vorgehen</strong></p><ul>${didactic.steps.map((step) => `<li>${step}</li>`).join("")}</ul></div>`
      : "";
    const mistakesHtml = Array.isArray(didactic.mistakes) && didactic.mistakes.length
      ? `<div class="goal-extra-theory"><p><strong>Häufige Fehler</strong></p><ul>${didactic.mistakes.map((item) => `<li>${item}</li>`).join("")}</ul></div>`
      : "";
    const edgeHtml = Array.isArray(didactic.edge) && didactic.edge.length
      ? `<div class="goal-extra-theory"><p><strong>Worauf du achten solltest</strong></p><ul>${didactic.edge.map((item) => `<li>${item}</li>`).join("")}</ul></div>`
      : "";
    const workedHtml = didactic.worked ? `<div class="goal-extra-theory"><p><strong>Durchgerechnetes Beispiel</strong></p><p>${didactic.worked}</p></div>` : "";
    theoryNode.innerHTML = `${linkGlossaryTerms(content.didactic?.definition || goal.theory || "")}${stepsHtml}${mistakesHtml}${edgeHtml}${workedHtml}`;
    operatorNode.textContent = content.operatorGuide || goal.operatorGuide || "Passe die Eingaben in Ruhe an, starte die Berechnung und vergleiche danach dein Ergebnis mit der Rückmeldung.";
    sourceNode.innerHTML = `<li>${content.source || goal.source}</li>`;
    controlsNode.innerHTML = (content.controls || []).map((c) => `<label><span class="input-latex">\\(${c.label}\\)</span><input type="number" step="any" data-k="${c.key}" value="${c.value}"></label>`).join("");
    const exampleItems = (content.examples || []).map((ex, idx) => {
      const encoded = encodeURIComponent(JSON.stringify(ex.params || {}));
      return `<div class="example-item"><p class="example-title">${ex.title}</p><p>${ex.text}</p><button type="button" class="example-load-btn" data-example="${encoded}" data-example-idx="${idx}" data-example-mode="${ex.modeId || ''}">Beispiel in Sandbox laden</button></div>`;
    }).join("");
    examplesNode.innerHTML = exampleItems || "Hier wird bald noch ein passendes Praxisbeispiel ergänzt.";
    controlsNode.querySelectorAll("input[data-k]").forEach((inp) => inp.addEventListener("input", render));
    card.querySelectorAll(".example-load-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        try {
          const payload = JSON.parse(decodeURIComponent(btn.dataset.example || "{}"));
          const exampleMode = String(btn.dataset.exampleMode || "").trim();
          if (exampleMode) {
            const entry = ensureGoalState(goal.id, topic);
            entry.activeModeId = exampleMode;
            renderSelectors();
          }
          setVals(payload);
          const entry = ensureGoalState(goal.id, topic);
          entry.exampleUseCount += 1;
          pushLearningEvent("EXAMPLE_APPLIED", goal.id, { index: Number(btn.dataset.exampleIdx || 0), variantId: bundle.variant?.id || null, modeId: bundle.mode?.id || null });
          render();
          saveLearningState();
          refreshLearningUI();
          updateGuidedFlow();
        } catch {
          // ignore invalid example payload
        }
      });
    });
    renderSelectors();
    render();
  }

  function updateGuidedFlow() {
    const entry = ensureGoalState(goal.id, topic);
    const correctAttempts = entry.results.filter((r) => r.correct).length;
    const accuracy = entry.results.length ? correctAttempts / entry.results.length : 0;
    const hasMediumPlus = entry.results.some((r) => r.correct && (r.difficulty === "medium" || r.difficulty === "hard"));
    const hasTransfer = (entry.exampleUseCount || 0) > 0 || archivePracticeCount(goal.id) > 0;

    const checks = {
      theory: !!entry.theoryChecked,
      example: (entry.exampleUseCount || 0) > 0,
      random: (entry.randomCount || 0) > 0,
      attempts: entry.results.length >= 3 && accuracy >= 0.67 && hasMediumPlus,
      transfer: hasTransfer
    };

    Object.entries(checks).forEach(([key, done]) => {
      const node = card.querySelector(`[data-guided-step="${key}"]`);
      if (!node) return;
      node.classList.toggle("done", done);
    });

    const nextMessages = [
      { key: "theory", text: "Nächster Schritt: Lies zuerst die Theorie in Ruhe durch und setze danach den Haken." },
      { key: "example", text: "Nächster Schritt: Öffne ein Praxisbeispiel und gehe es Schritt für Schritt nach." },
      { key: "random", text: "Nächster Schritt: Erzeuge eine Zufallsaufgabe und versuche sie selbst zu lösen." },
      { key: "attempts", text: "Nächster Schritt: Sammle 3 bewertete Versuche mit ausreichender Trefferquote." },
      { key: "transfer", text: "Nächster Schritt: Zeige Transfer mit einem Beispiel oder einer Nachschlageübung." }
    ];
    const open = nextMessages.find((x) => !checks[x.key]);
    if (guidedNextNode) {
      guidedNextNode.textContent = open ? open.text : "Dieser Lernweg ist vollständig. Wenn du möchtest, kannst du jetzt zur nächsten Prüfungsanforderung weitergehen.";
    }
  }

  function logAttempt(correct, difficulty) {
    const entry = ensureGoalState(goal.id, topic);
    entry.attemptCount += 1;
    entry.lastAttemptAt = new Date().toISOString();
    entry.results.push({ correct, difficulty, timestamp: entry.lastAttemptAt });
    pushLearningEvent("ATTEMPT_LOGGED", goal.id, { correct, difficulty });
    saveLearningState();
    refreshLearningUI();
    updateGuidedFlow();
  }

  function collect() {
    const vals = {};
    card.querySelectorAll("input[data-k]").forEach((inp) => {
      vals[inp.dataset.k] = num(inp.value);
    });
    return vals;
  }

  function setVals(vals) {
    card.querySelectorAll("input[data-k]").forEach((inp) => {
      if (Object.hasOwn(vals, inp.dataset.k)) inp.value = Number(vals[inp.dataset.k]).toFixed(3);
    });
  }

  function render() {
    if (canvas) prepareCanvas(canvas, 210);
    const vals = collect();
    const bundle = activeBundle();
    eqNode.textContent = `\\(${(bundle.content.equation ? bundle.content.equation(vals, bundle.mode?.id) : "")}\\)`;
    const text = goalCompute(goal.id, vals, canvas, state, ensureGoalState(goal.id, topic));
    result.innerHTML = text;
    typeset(card);
  }

  card.querySelector(".compute-btn").addEventListener("click", render);

  card.querySelector(".exercise-btn").addEventListener("click", () => {
    const bundle = activeBundle();
    const item = randomExercise(goal.id, ensureGoalState(goal.id, topic));
    const difficultyLabel = item.difficulty ? `<div class="exercise-difficulty ${item.difficulty}">Niveau: ${item.difficulty}</div>` : "";
    const exerciseHtml = item.qLatex ? `${item.q}<div class="formula-latex">${item.qLatex}</div>` : item.q;
    const loadBtnHtml = item.params ? `<button type="button" class="example-load-btn" data-exercise-load="${encodeURIComponent(JSON.stringify(item.params || {}))}" data-exercise-mode="${item.modeId || ''}">Übung in Sandbox laden</button>` : "";
    exBox.innerHTML = difficultyLabel + exerciseHtml + loadBtnHtml;
    if (item.params) {
      exBox.querySelector(".example-load-btn").addEventListener("click", () => {
        try {
          const modeId = String(exBox.querySelector(".example-load-btn").dataset.exerciseMode || "").trim();
          if (modeId) {
            const entry = ensureGoalState(goal.id, topic);
            entry.activeModeId = modeId;
            renderSelectors();
          }
          const payload = JSON.parse(decodeURIComponent(exBox.querySelector(".example-load-btn").dataset.exerciseLoad || "{}"));
          setVals(payload);
          const entry = ensureGoalState(goal.id, topic);
          entry.exampleUseCount += 1;
          pushLearningEvent("EXERCISE_APPLIED", goal.id, { variantId: bundle.variant?.id || null, modeId: bundle.mode?.id || null });
          render();
          saveLearningState();
          refreshLearningUI();
          updateGuidedFlow();
        } catch {
          // ignore invalid exercise params
        }
      });
    }
    sol.innerHTML = item.sLatex ? `${item.s}<div class="formula-latex">${item.sLatex}</div>` : item.s;
    sol.classList.add("hidden");
    const entry = ensureGoalState(goal.id, topic);
    entry.randomCount += 1;
    pushLearningEvent("RANDOM_EXERCISE_GENERATED", goal.id, { variantId: bundle.variant?.id || null, modeId: bundle.mode?.id || null });
    saveLearningState();
    refreshLearningUI();
    updateGuidedFlow();
    typeset(card);
  });

  card.querySelector(".toggle-btn").addEventListener("click", () => {
    sol.classList.toggle("hidden");
  });

  theoryCheckInput.addEventListener("change", () => {
    const entry = ensureGoalState(goal.id, topic);
    entry.theoryChecked = theoryCheckInput.checked;
    pushLearningEvent("THEORY_TOGGLED", goal.id, { checked: theoryCheckInput.checked });
    saveLearningState();
    refreshLearningUI();
    updateGuidedFlow();
  });

  card.querySelectorAll(".attempt-rating-buttons button").forEach((btn) => {
    btn.addEventListener("click", () => {
      logAttempt(btn.dataset.rate === "correct", btn.dataset.difficulty || "medium");
    });
  });

  card.querySelectorAll(".archive-jump-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      showTopic("archive");
      const anchor = document.getElementById(`archive-${btn.dataset.archiveJump}`);
      if (anchor) anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  if (canvas) {
    canvas.addEventListener("wheel", (ev) => {
      ev.preventDefault();
      const f = ev.deltaY < 0 ? 1.1 : 0.9;
      state.scale = Math.max(10, Math.min(90, state.scale * f));
      render();
    }, { passive: false });

    canvas.addEventListener("mousedown", (ev) => {
      const p = screenToWorld(state, ev.offsetX, ev.offsetY, canvas);
      state.dragHandle = pickHandle(state, p.x, p.y);
      state.panning = state.dragHandle < 0;
      state.lx = ev.offsetX;
      state.ly = ev.offsetY;
    });
    canvas.addEventListener("mousemove", (ev) => {
      if (state.dragHandle >= 0) {
        const vals = collect();
        const p = screenToWorld(state, ev.offsetX, ev.offsetY, canvas);
        applyHandleDrag(goal.id, state.dragHandle, p.x, p.y, vals);
        setVals(vals);
        render();
        return;
      }
      if (!state.panning) return;
      state.tx += ev.offsetX - state.lx;
      state.ty += ev.offsetY - state.ly;
      state.lx = ev.offsetX;
      state.ly = ev.offsetY;
      render();
    });
      canvas.addEventListener("mouseup", () => { state.panning = false; state.dragHandle = -1; });
      canvas.addEventListener("mouseleave", () => { state.panning = false; state.dragHandle = -1; });
  }

  renderBundle();
  updateGuidedFlow();

  return card;
}

function initGoalWorkshops() {
  const topics = ["algebra", "funktionen", "geometrie", "trigonometrie"];
  topics.forEach((topic) => {
    const mount = document.getElementById(`goals-${topic}`);
    if (!mount) return;
    (GOAL_DEFS[topic] || []).forEach((goal) => mount.appendChild(buildGoalCard(topic, goal)));
  });
}

function initSolidFallbackViewer(mount, info) {
  const canvas = document.createElement("canvas");
  canvas.className = "solid3d-canvas-fallback";
  canvas.style.display = "block";
  canvas.style.width = "100%";
  canvas.style.height = "280px";
  canvas.style.touchAction = "none";
  mount.innerHTML = "";
  mount.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const state = {
    yaw: -0.7,
    pitch: 0.5,
    zoom: 1,
    drag: false,
    lx: 0,
    ly: 0,
    type: "box",
    a: 4,
    h: 5,
    r: 2
  };

  function getInputs() {
    state.type = document.getElementById("solid3dType")?.value || "box";
    state.a = Math.max(0.2, n(document.getElementById("solid3dA")?.value));
    state.h = Math.max(0.2, n(document.getElementById("solid3dH")?.value));
    state.r = Math.max(0.2, n(document.getElementById("solid3dR")?.value));
  }

  function updateInfo() {
    let vol = 0;
    let surf = 0;
    if (state.type === "box") {
      vol = state.a * state.h * state.a;
      surf = 2 * (state.a * state.h + state.a * state.a + state.h * state.a);
    } else if (state.type === "cylinder") {
      vol = Math.PI * state.r * state.r * state.h;
      surf = 2 * Math.PI * state.r * (state.r + state.h);
    } else if (state.type === "cone") {
      vol = (Math.PI * state.r * state.r * state.h) / 3;
      surf = Math.PI * state.r * (state.r + Math.sqrt(state.r * state.r + state.h * state.h));
    } else if (state.type === "pyramid") {
      const slant = Math.sqrt((state.a / 2) * (state.a / 2) + state.h * state.h);
      vol = (state.a * state.a * state.h) / 3;
      surf = state.a * state.a + 2 * state.a * slant;
    } else {
      vol = (4 / 3) * Math.PI * state.r * state.r * state.r;
      surf = 4 * Math.PI * state.r * state.r;
    }
    if (info) info.textContent = `V=${vol.toFixed(3)}, O=${surf.toFixed(3)} (Fallback-Viewer)`;
  }

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(320, mount.clientWidth || 420);
    const h = 280;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    render();
  }

  function project(x, y, z, w, h) {
    const cy = Math.cos(state.yaw), sy = Math.sin(state.yaw);
    const cp = Math.cos(state.pitch), sp = Math.sin(state.pitch);
    const xr = x * cy - z * sy;
    const zr = x * sy + z * cy;
    const yr = y * cp - zr * sp;
    const zr2 = y * sp + zr * cp;
    const camDist = 8;
    const f = (130 * state.zoom) / (camDist - zr2);
    return { x: w / 2 + xr * f, y: h / 2 - yr * f };
  }

  function drawWire(points, edges, color) {
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.6;
    edges.forEach(([a, b]) => {
      const p1 = project(points[a][0], points[a][1], points[a][2], w, h);
      const p2 = project(points[b][0], points[b][1], points[b][2], w, h);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    });
  }

  function drawCircle3D(radius, y, segments, color) {
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (let i = 0; i <= segments; i += 1) {
      const t = (i / segments) * Math.PI * 2;
      const x = radius * Math.cos(t);
      const z = radius * Math.sin(t);
      const p = project(x, y, z, w, h);
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }

  function render() {
    getInputs();
    updateInfo();
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#f4f8ff";
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = "#1e3f66";
    ctx.font = "12px Arial";
    ctx.fillText("Interaktiver 3D-Fallback (Drag: drehen, Wheel: zoomen)", 10, 16);

    if (state.type === "box") {
      const a = state.a / 2;
      const y = state.h / 2;
      const pts = [
        [-a, -y, -a], [a, -y, -a], [a, y, -a], [-a, y, -a],
        [-a, -y, a], [a, -y, a], [a, y, a], [-a, y, a]
      ];
      const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
      drawWire(pts, edges, "#2f6fb3");
    } else if (state.type === "cylinder") {
      const hh = state.h / 2;
      drawCircle3D(state.r, hh, 36, "#2f6fb3");
      drawCircle3D(state.r, -hh, 36, "#2f6fb3");
      const pts = [[state.r, -hh, 0], [state.r, hh, 0], [-state.r, -hh, 0], [-state.r, hh, 0], [0, -hh, state.r], [0, hh, state.r], [0, -hh, -state.r], [0, hh, -state.r]];
      drawWire(pts, [[0,1],[2,3],[4,5],[6,7]], "#2f6fb3");
    } else if (state.type === "cone") {
      const hh = state.h / 2;
      drawCircle3D(state.r, -hh, 36, "#2f6fb3");
      const wv = canvas.width / (window.devicePixelRatio || 1);
      const hv = canvas.height / (window.devicePixelRatio || 1);
      const apex = project(0, hh, 0, wv, hv);
      [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].forEach((t) => {
        const bp = project(state.r * Math.cos(t), -hh, state.r * Math.sin(t), wv, hv);
        ctx.strokeStyle = "#2f6fb3";
        ctx.beginPath();
        ctx.moveTo(apex.x, apex.y);
        ctx.lineTo(bp.x, bp.y);
        ctx.stroke();
      });
    } else if (state.type === "pyramid") {
      const a = state.a / 2;
      const hh = state.h / 2;
      const pts = [
        [-a, -hh, -a], [a, -hh, -a], [a, -hh, a], [-a, -hh, a],
        [0, hh, 0]
      ];
      const edges = [[0,1],[1,2],[2,3],[3,0],[0,4],[1,4],[2,4],[3,4]];
      drawWire(pts, edges, "#2f6fb3");
    } else {
      drawCircle3D(state.r, 0, 36, "#2f6fb3");
      const wv = canvas.width / (window.devicePixelRatio || 1);
      const hv = canvas.height / (window.devicePixelRatio || 1);
      const rings = [
        { rx: state.r, rz: state.r * 0.55 },
        { rx: state.r * 0.55, rz: state.r }
      ];
      rings.forEach((ring) => {
        ctx.strokeStyle = "#2f6fb3";
        ctx.beginPath();
        for (let i = 0; i <= 36; i += 1) {
          const t = (i / 36) * Math.PI * 2;
          const p = project(ring.rx * Math.cos(t), ring.rz * Math.sin(t), 0, wv, hv);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      });
    }
  }

  const toCanvasPos = (ev) => {
    const rect = canvas.getBoundingClientRect();
    return { x: ev.clientX - rect.left, y: ev.clientY - rect.top };
  };

  canvas.addEventListener("mousedown", (ev) => {
    state.drag = true;
    const p = toCanvasPos(ev);
    state.lx = p.x;
    state.ly = p.y;
  });
  window.addEventListener("mouseup", () => {
    state.drag = false;
  });
  canvas.addEventListener("mousemove", (ev) => {
    if (!state.drag) return;
    const p = toCanvasPos(ev);
    const dx = p.x - state.lx;
    const dy = p.y - state.ly;
    state.lx = p.x;
    state.ly = p.y;
    state.yaw += dx * 0.01;
    state.pitch = Math.max(-1.3, Math.min(1.3, state.pitch + dy * 0.01));
    render();
  });
  canvas.addEventListener("wheel", (ev) => {
    ev.preventDefault();
    const factor = ev.deltaY < 0 ? 1.08 : 0.92;
    state.zoom = Math.max(0.45, Math.min(2.5, state.zoom * factor));
    render();
  }, { passive: false });

  ["solid3dType", "solid3dA", "solid3dH", "solid3dR"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", render);
  });

  const onWindowResize = () => resize();
  window.addEventListener("resize", onWindowResize);

  resize();
  requestAnimationFrame(render);

  return {
    resize,
    dispose: () => {
      window.removeEventListener("resize", onWindowResize);
    }
  };
}

function initSolid3D() {
  const mount = document.getElementById("solid3dViewport");
  const info = document.getElementById("solid3dInfo");
  if (!mount) return null;
  if (!window.THREE || !window.THREE.OrbitControls) {
    if (info) info.textContent = "3D-Bibliothek nicht verfügbar, Fallback-Viewer aktiv.";
    return initSolidFallbackViewer(mount, info);
  }

  try {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "280px";
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.pointerEvents = "auto";
    mount.innerHTML = "";
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f8ff);
    const camera = new THREE.PerspectiveCamera(45, 420 / 280, 0.1, 1000);
    camera.position.set(7, 6, 8);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.rotateSpeed = 0.9;
    controls.zoomSpeed = 1.0;
    controls.panSpeed = 0.9;

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const d = new THREE.DirectionalLight(0xffffff, 0.9);
    d.position.set(8, 12, 6);
    scene.add(d);
    scene.add(new THREE.GridHelper(14, 14, 0x91a8c8, 0xd0dcef));

    const material = new THREE.MeshStandardMaterial({ color: 0x3f78be, metalness: 0.15, roughness: 0.5 });
    let mesh = null;

    function rebuild() {
      const type = document.getElementById("solid3dType")?.value || "box";
      const a = Math.max(0.2, n(document.getElementById("solid3dA")?.value));
      const h = Math.max(0.2, n(document.getElementById("solid3dH")?.value));
      const r = Math.max(0.2, n(document.getElementById("solid3dR")?.value));

      if (mesh) scene.remove(mesh);
      let geo;
      let vol = 0;
      let surf = 0;
      if (type === "box") {
        geo = new THREE.BoxGeometry(a, h, a);
        vol = a * h * a;
        surf = 2 * (a * h + a * a + h * a);
      } else if (type === "cylinder") {
        geo = new THREE.CylinderGeometry(r, r, h, 48);
        vol = Math.PI * r * r * h;
        surf = 2 * Math.PI * r * (r + h);
      } else if (type === "cone") {
        geo = new THREE.ConeGeometry(r, h, 48);
        vol = (Math.PI * r * r * h) / 3;
        surf = Math.PI * r * (r + Math.sqrt(r * r + h * h));
      } else if (type === "pyramid") {
        geo = new THREE.ConeGeometry(a / Math.SQRT2, h, 4);
        const slant = Math.sqrt((a / 2) * (a / 2) + h * h);
        vol = (a * a * h) / 3;
        surf = a * a + 2 * a * slant;
      } else {
        geo = new THREE.SphereGeometry(r, 48, 48);
        vol = (4 / 3) * Math.PI * r * r * r;
        surf = 4 * Math.PI * r * r;
      }
      mesh = new THREE.Mesh(geo, material);
      scene.add(mesh);
      if (info) info.textContent = `V=${vol.toFixed(3)}, O=${surf.toFixed(3)}`;
    }

    ["solid3dType", "solid3dA", "solid3dH", "solid3dR"].forEach((id) => {
      document.getElementById(id)?.addEventListener("input", rebuild);
    });

    function resize() {
      const width = Math.max(320, mount.clientWidth || 420);
      const height = 280;
      renderer.setSize(width, height, true);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    resize();
    requestAnimationFrame(resize);
    setTimeout(resize, 120);
    rebuild();

    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    const onWindowResize = () => resize();
    window.addEventListener("resize", onWindowResize);

    return {
      resize,
      dispose: () => {
        window.removeEventListener("resize", onWindowResize);
        controls.dispose();
        renderer.dispose();
      }
    };
  } catch {
    if (info) info.textContent = "3D konnte nicht geladen werden (Three.js fehlt).";
    return initSolidFallbackViewer(mount, info);
  }
}

function ensureSolid3D() {
  if (!solid3DController) {
    solid3DController = initSolid3D();
  }
  requestAnimationFrame(() => {
    solid3DController?.resize?.();
  });
  setTimeout(() => {
    solid3DController?.resize?.();
  }, 120);
}

function initApp() {
  enrichGoalDefinitions();
  loadLearningState();
  buildSidebarTree();
  initGoalWorkshops();
  renderArchivePanel();
  renderGlossaryPanel();
  loadTheorySupplements();
  initStateControls();
  refreshLearningUI();
  showTopic("overview");

  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest(".glossary-link");
    if (!btn) return;
    const term = btn.dataset.term;
    showTopic("glossary");
    setTimeout(() => {
      const id = "glossary-card-" + term.replace(/[\s\/()]/g, "-");
      const card = document.getElementById(id);
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        card.classList.add("glossary-highlight");
        setTimeout(() => card.classList.remove("glossary-highlight"), 1800);
      }
    }, 150);
  });
}

initApp();
