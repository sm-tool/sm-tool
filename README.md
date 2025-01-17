# System planowania scenariuszy kryzysowych

Organizacje zajmujące się ćwiczeniami oraz reagowaniem na sytuacje kryzysowe systematycznie przeprowadzają symulacje i testy procedur postępowania. Celem tych działań jest ciągłe ulepszanie systemów bezpieczeństwa oraz doskonalenie umiejętności radzenia sobie w sytuacjach niekontrolowanych. W takich ćwiczeniach biorą udział różne grupy osób, w tym służby mundurowe, personel medyczny, pracownicy infrastruktury transportowej oraz użytkownicy testowanych systemów.

Ze względu na złożoność, koszty oraz zaangażowane zasoby, kluczowe znaczenie ma dokładne planowanie takich działań z uwzględnieniem standardów jak TGM (Trial Guidance Methodology) czy CWA 18009:2023.

Niniejsza aplikacja została stworzona jako kompleksowe narzędzie wspierające proces planowania eksperymentów, ze szczególnym uwzględnieniem projektowania scenariuszy sytuacji kryzysowych.

## Funkcjonalności systemu

System umożliwia tworzenie scenariuszy zawierających:

* Sekwencje działań pozwalające na uporządkowane planowanie kolejnych kroków procedury
* Podziały na wątki umożliwiające organizację różnych aspektów scenariusza
* Poszczególne akcje definiujące konkretne działania do wykonania
* Obiekty opisane przez typy, szablony i asocjacje, pozwalające na szczegółowe modelowanie elementów scenariusza
* Zmiany na obiektach przez atrybuty lub asocjacje, umożliwiające śledzenie modyfikacji w czasie
* Rozdzielone operacje podziałów wątków dla lepszej organizacji złożonych scenariuszy

# Struktura projektu
## Organizacja katalogów

    /documentation - Zawiera pełną dokumentację projektu, włączając instrukcje techniczne i dokumentację użytkową
    /src - Główny katalog zawierający kod źródłowy, podzielony na sekcje testową i produkcyjną
        /main - Kod produkcyjny aplikacji
            /java - Backend aplikacji napisany w Java
            /resources - Współdzielone zasoby wykorzystywane przez różne komponenty systemu
            /webapp - Frontend aplikacji napisany w React
        /test - Testy jednostkowe i integracyjne

## Wymagania deweloperskie
### Konfiguracja środowiska

Przed rozpoczęciem pracy wymagane jest:

    Uruchomienie środowiska Docker dla serwera developerskiego
    Konfiguracja build.gradle.kts do pracy z backendem
    Instalacja menadżera pakietów Node.js
    Konfiguracja Husky do weryfikacji kodu
    Ustawienie Prettier do formatowania kodu

### Praca z frontendem

Do rozpoczęcia pracy z częścią frontendową należy:

    Spełnić wszystkie poprzednie wymagania deweloperskie
    Zainstalować zależności z pliku src/main/webapp/package.json
    Uruchomić aplikację w trybie deweloperskim za pomocą skryptu dev

