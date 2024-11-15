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
