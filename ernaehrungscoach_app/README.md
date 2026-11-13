# FuelUp – dein kostenloser Ernährungscoach

**Version 1.0 – persönliches iPhone-Dashboard**

## Was die App kann

- Startseite mit großem Foto-Knopf, Kalorienring, Eiweiß/Kohlenhydrat/Fett-Fortschritt
- Essensfoto von der Kamera oder aus der Fotomediathek auswählen: KI ordnet das Bild automatisch einem von **101 bekannten Gerichten** zu
- Grobe Schätzung für **eine typische Portion** wird ohne Bestätigungsdialog gespeichert
- Automatisches Tagesprotokoll, 7-Tage-Diagramm, Gewichtstagebuch, anpassbare Tagesziele
- Kein Konto, keine kostenpflichtige API, kein Abo, kein Server für persönliche Daten
- Ernährungseinträge werden **lokal im Browser des Geräts** gespeichert; die Fotos werden nicht gespeichert
- Export/Import als JSON zur Datensicherung

## WICHTIGE GRENZEN

1. **Ein Foto verrät weder exakte Mengen noch Zutaten.** Die Gerichterkennung kennt nur 101 Klassen; ein mehrteiliger Teller kann falsch eingeordnet werden. Nährwerte sind bewusst grobe Richtwerte für typische Portionen und dürfen nicht als genaue Ernährungsmessungen betrachtet werden.
2. **Beim ersten Essensfoto benötigt die App Internet**, um eine Browser-KI-Laufzeit und das rund 93-MB-ONNX-Modell von Hugging Face zu laden. Später kann der Browser Teile zwischenspeichern. Offline-Fotoanalyse ist NICHT garantiert. Alle Bildanalysen laufen im Browser auf dem Gerät, ohne bezahlte KI-Aufrufe.
3. **iPhone-Safari-Leistung wurde hier nicht live getestet.** Das Modell ist relativ groß und kann auf manchen Geräten langsam sein oder wegen Speichermangel scheitern. Dann meldet die App einen Fehler und erfindet keinen Eintrag.
4. **Nur lokales Speichern:** Safari kann Browserdaten löschen. Deshalb regelmäßig über Einstellungen → Backup herunterladen sichern. Bei Wechsel des iPhones die JSON-Sicherung über Einstellungen → Backup einlesen wiederherstellen.
5. Die App erzeugt selbst keine Gebühren. Ein Internetzugang und gegebenenfalls dessen übliche Datenkosten sind natürlich nötig. Die Verfügbarkeit externer kostenloser Modelldateien ist nicht garantiert.

## Installation auf dem iPhone (kostenlos)

Für Kamera, lokale Speicherung und die Installation als Home-Bildschirm-App benötigt sie eine **HTTPS-Adresse**. Ein bloßer ZIP-Ordner auf dem iPhone reicht nicht.

**Mit GitHub Pages (kostenlos für öffentliche Repositories):**

1. Kostenloses GitHub-Konto verwenden; ein neues **öffentliches** Repository, z. B. `fuelup`, erstellen.
2. **Alle Dateien aus diesem ZIP mitsamt Unterordner `assets/`** ins Hauptverzeichnis des Repositorys hochladen, sodass `index.html` dort liegt.
3. Repository → **Settings → Pages → Build and deployment → Deploy from a branch**; als Branch `main` und Ordner `/ (root)` wählen; speichern.
4. GitHub erzeugt eine HTTPS-Adresse wie `https://DEIN-NUTZERNAME.github.io/fuelup/`.
5. Diese Adresse in **Safari auf dem iPhone** öffnen → **Teilen → Zum Home-Bildschirm** → hinzufügen.
6. Beim ersten Foto mit WLAN verbinden. Der KI-Download kann auf dem iPhone Zeit in Anspruch nehmen.

**Privatsphäre:** Bei GitHub Pages ist der Programmcode öffentlich, aber dein Essenstagebuch **wird nicht zu GitHub übertragen**. Die App speichert persönliche Einträge nur auf dem verwendeten Gerät. Das Foto wird im Browser verarbeitet; externe Bibliotheken und Modellgewichte werden heruntergeladen.

## Startziele

- 2.900 kcal/Tag
- 155 g Eiweiß/Tag
- 390 g Kohlenhydrate/Tag
- 80 g Fett/Tag

Das sind **vorläufige Richtwerte**, die über Zeit und tatsächliche Gewichtsentwicklung angepasst werden sollten.

## Lokal auf einem Computer testen

Im entpackten Ordner:

```bash
python3 -m http.server 8000
```

Dann im Browser `http://localhost:8000` öffnen. In der Adressleiste `?preview=1` ergänzen, um eine **nicht gespeicherte Designvorschau mit Beispieldaten** zu sehen. Die echte App startet ohne Beispieldaten.

## Technische Hinweise

- Reine HTML/CSS/JavaScript-PWA ohne Server/Build-Schritt.
- Kostenlose Hugging-Face-Transformers.js-Bibliothek, Open-Source-Modell `onnx-community/swin-finetuned-food101-ONNX` (Apache-2.0).
- Food-101-Gerichtsklassen mit hausinternen groben Portionswerten in `nutrition.js`; **keine** offiziellen Nährwertberechnungen.
- Modelldownload direkt vom Modell-Host; Bilddaten werden lokal analysiert, nicht als API-Request an einen Kalorien-Dienst geschickt.
- JavaScript-Speicher `localStorage`, Service Worker cached statische App-Dateien. Modell-Cache wird vom ML-Runtime/Browser verwaltet.
- Kein Hintergrundmonitoring: Bei Änderungen können Funktionstests erneut durchgeführt werden.

## Prüfstatus

Grundfunktionen und Layout im Desktop-Browser überprüfbar; Foto-KI erfordert einen echten 93-MB-Modelldownload und einen Praxistest auf dem iPhone. Ein reiner Desktop-Screenshot bestätigt nicht die zuverlässige iPhone-Bilderkennung.
