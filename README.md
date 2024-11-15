# Server-Klient në Node.js

Ky është një server TCP që mundëson komunikimin midis klientëve dhe ekzekutimin e komandave në skedarë të specifikuar. Serveri mbështet operacione të ndryshme për lexim dhe shkruarje skedarësh, si dhe mundësi për dërgimin e mesazheve midis klientëve.

## Qëllimi i Projektit

Qëllimi i këtij projekti është të ofrojë një shembull të thjeshtë të një aplikacioni server-klient që mundëson menaxhimin e skedarëve dhe komunikimin në një mjedis të sigurt. Ky projekt është i përshtatshëm për përdorim në mjedise të mbyllura, ku përdoruesit mund të ekzekutojnë komanda për manipulimin e skedarëve dhe për të komunikuar me njëri-tjetrin përmes një kanali TCP.

### Protokolli TCP

TCP (Transmission Control Protocol) është një protokoll lidhjeje që siguron një kanal të besueshëm dhe të sigurt për komunikimin mes serverit dhe klientëve. Ky projekt përdor TCP sockets për të krijuar një lidhje të sigurt dhe për të mundësuar komunikimin midis serverit dhe shumë klientëve të ndryshëm.

### Përparësitë e TCP-së
- *Besueshmëria*: TCP siguron që të dhënat të arrijnë tek destinacioni pa humbje.
- *Kontrolli i rrjedhës*: Ka mekanizma për të kontrolluar fluksin e të dhënave.
- *Drejtimi*: Komunikimi mund të bëhet në mënyrë të njëpasnjëshme dhe të kontrolluar.

## Teknologjitë e Përdorura

- **Node.js** - Shkarkoni dhe instaloni nga [nodejs.org](https://nodejs.org/)

### Instalimi dhe Ekzekutimi

1. **Përgatitja e Serverit**:
   - Hapni terminalin dhe drejtohuni te dosja e projektit.
   - Ekzekutoni komandën për të startuar serverin:
     ```bash
     node server.js
     ```

2. **Përgatitja e Klientit**:
   - Hapni një tjetër terminal dhe drejtohuni te dosja e projektit.
   - Ekzekutoni komandën për të lidhur një klient:
     ```bash
     node client.js
     ```

## Funksionaliteti i Projektit

Ky projekt përfshin dy module kryesore:

- **Serveri**: Pret lidhjet nga klientët dhe menaxhon komandat që klientët mund të dërgojnë, duke u bazuar në privilegjet e tyre.
- **Klienti**: Dërgon komanda dhe merr përgjigje nga serveri përmes TCP.

### Struktura e Privilegjeve

Përdoruesit që lidhen me serverin mund të kenë dy lloje privilegjesh:

1. **Privilegje të Plota**:

   - Përdoruesit admin mund të ekzekutojnë çdo komandë, përfshirë operacionet sensitive si ekzekutimi i skedarëve, shkruarja dhe fshirja e skedarëve.

2. **Privilegje të Pjesshme**:

   - Përdoruesit me privilegje të pjesshme mund të dërgojnë mesazhe dhe të lexojnë skedarët, por nuk mund të ekzekutojnë operacione si shkruarja, fshirja apo ekzekutimi i skedarëve.

### Komandat e Lejuara

| Komanda                             | Admin | Lexues | Roli i Komandës              |
|-------------------------------------|-------|--------|------------------------------|
| `broadcast <mesazh>`                | Po    | Po     | Komunikim i përgjithshëm     |
| `chat <clientName> <mesazh>`        | Po    | Po     | Komunikim privat             |
| `read <emriSkedarit>`               | Po    | Po     | Leximi i skedarëve           |
| `write <emriSkedarit> <përmbajtje>` | Po    | Jo     | Shkrimi në skedar            |
| `create <emriSkedarit> <përmbajtje>`| Po    | Jo     | Krijimi i skedarëve          |
| `delete <emriSkedarit>`             | Po    | Jo     | Fshirja e skedarëve          |
| `list <folder>`                     | Po    | Po     | Shfaqja e skedarëve në dosje |
| `execute <emriSkedarit>`            | Po    | Jo     | Ekzekutimi i skedarëve       |
