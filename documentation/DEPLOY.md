# Instrukcja Deploymentu Aplikacji

## Spis treści

- [Wymagania systemowe](#wymagania-systemowe)
- [Struktura projektu](#struktura-projektu)
- [Konfiguracja środowiska](#konfiguracja-środowiska)
- [Przygotowanie serwera](#przygotowanie-serwera)
- [Proces deploymentu](#proces-deploymentu)
- [Weryfikacja deploymentu](#weryfikacja-deploymentu)
- [Konfiguracja HTTPS](#konfiguracja-https)
- [Monitoring i maintenance](#monitoring-i-maintenance)
- [Backup i recovery](#backup-i-recovery)
- [Rozwiązywanie problemów](#rozwiązywanie-problemów)

## ⚠️ WAŻNE UWAGI

1. **Status Keycloak**: Z powodu problemów z nieskończonymi zapętleniami w wywołaniach,
   Keycloak został tymczasowo wyłączony i zastąpiony mockiem autoryzacji.
   Wszystkie odniesienia do Keycloak w dokumentacji należy obecnie ignorować.

2. **Środowisko "produkcyjne"**:

   - Obecna konfiguracja "produkcyjna" (docker-compose.prod.yml) jest w rzeczywistości środowiskiem testowym/rozwojowym
   - W konfiguracji ustawiono CORS na '\*' dla ułatwienia testów
   - Zalecane jest używanie konfiguracji "produkcyjnej", ponieważ ukrywa ona większość komunikatów błędów i logów debugowych
   - To środowisko można określić jako "prodomock" lub "prododev"

3. **Bezpieczeństwo**: Ze względu na powyższe, obecna konfiguracja NIE jest odpowiednia do prawdziwego wdrożenia produkcyjnego. Przed faktycznym wdrożeniem produkcyjnym wymagane będzie:
   - Implementacja właściwej autoryzacji
   - Konfiguracja odpowiednich ustawień CORS
   - Włączenie pełnego logowania błędów
   - Przegląd i dostosowanie wszystkich aspektów bezpieczeństwas
   - Przygotowanie kontenerów pod środowisko produkcyjne

## Wymagania systemowe

### Oprogramowanie

- Docker (minimum wersja 20.10.x)
- Docker Compose (minimum wersja 2.x)
- Minimum 4GB RAM
- Minimum 20GB przestrzeni dyskowej

### Porty

- 80: Nginx (konfigurowalny przez NGINX_PORT)
- 5432: PostgreSQL master
- ~~8180: Keycloak (dostępny przez /auth)~~~
- 8000: Backend API

## Struktura projektu

Wymagana struktura katalogów:

```
.
├── .env.prod
├── docker-compose.prod.yml
└── src
    ├── main
        ├── java
        │   └── Dockerfile
        ├── webapp
        │   └── Dockerfile
        └── resources
            ├── nginx
            │   └── nginx.conf
            └── realm
                ├── realm.json
                ├── keycloak-theme-for-kc-22-to-25.jar
                └── keycloak-webhook-0.6.0-all.jar
```

## Konfiguracja środowiska

### 1. Pliki konfiguracyjne środowiska

#### Struktura plików środowiskowych

- `.env` - konfiguracja dla środowiska developerskiego (używana domyślnie)
- `.env.template` - szablon z pustymi zmiennymi środowiskowymi
- `.env.prod` - konfiguracja produkcyjna (⚠️ zawiera wrażliwe dane)

> **WAŻNE**: Plik `.env.prod` zawiera krytyczne dane dostępowe. Przed deploymentem należy bezwzględnie zmienić wszystkie domyślne hasła i dane dostępowe na własne, bezpieczne wartości.

### Uwaga odnośnie środowiska produkcyjnego

Obecna konfiguracja "produkcyjna" (.env.prod i docker-compose.prod.yml) jest w rzeczywistości konfiguracją testową z wyłączonym Keycloak
i zastąpionym mockiem autoryzacji. Służy ona głównie do celów rozwojowych i testowych,
gdzie priorytetem jest stabilność działania nad bezpieczeństwem.

### Domyślne uruchamianie - opcje

#### 1. Użycie gotowych kontenerów (zalecane)

```bash
# Najszybsza opcja - użycie przygotowanych kontenerów z GHCR
docker-compose -f docker-compose.registry.yml --env-file ./.env.prod up -d
```

Ta opcja wykorzystuje gotowe kontenery z GitHub Container Registry przyspieszając proces wdrożenia.
Zbudowane są na konfiguracji "produkcyjnej" (.env.prod)

#### 2. Budowanie lokalne

```bash
# Uruchomienie z domyślnym plikiem .env (środowisko developerskie)
docker-compose up -d

# Uruchomienie środowiska produkcyjnego
docker-compose -f docker-compose.prod.yml --env-file ./.env.prod up -d
```

### 2. Przygotowanie pliku .env.prod

Dla przyspieszenia konfiguracji do projektu został załączony .env.prod z wypełnieniem. NIEPOWINNO się z niego kożystać do deploymentu a pola oznaczone '#' są bare minimum jakie należy trzeba zamienić

### 3. Weryfikacja konfiguracji Nginx

Upewnij się, że plik `nginx.conf` jest poprawnie skonfigurowany dla Twojego środowiska produkcyjnego. Szczególną uwagę zwróć na:

- Konfigurację CORS (Access-Control-Allow-Origin)
- Timeouty dla Keycloak
- Ścieżki proxy dla API i autoryzacji

### 4. Weryfikacja konfiguracji keycloack

Plik `realm.json` zawiera zaproponowaną przez nas konfiguracją realm, z którą NALEŻY zapoznać się przed przystąpieniem do preocesu deploymentu i wprowadzić poprawki pod serwer produkcyjny

## Proces deploymentu

### 1. Budowa i uruchomienie

```bash
docker-compose -f docker-compose.prod.yml --env-file ./.env.prod up -d
```

System uruchomi kontenery w następującej kolejności:

1. postgresql-master
2. postgresql-slave
3. keycloak
4. backend
5. nginx

### 2. Weryfikacja statusu kontenerów

```bash
docker-compose -f docker-compose.prod.yml ps
```

## Weryfikacja deploymentu i prawidłowego uruchomienia

- Frontend: `http://localhost:${NGINX_PORT}`
- Keycloak: `http://localhost:${NGINX_PORT}/auth`
- API: `http://localhost:${NGINX_PORT}/api`

1. Status kontenerów powinien być "healthy" lub "running". Jeśli któryś z kontenerów ma status "exited" lub "dead", należy sprawdzić logi tego kontenera

### Uwaga: Kontenery uruchamiają się z opóźnieniem do 40 sekund, aby uniknąć problemów z zależnościami. Należy poczekać przed weryfikacją.

## Sprawdzanie podstawowej funkcjonalności

### 1. Połącz się z serwerem na porcie 80 przez przeglądarke - wynikiem powinien być następujący widok:

[widok strony głównej](deploy-images/img.png)

#### Typowe błędy tego punktu

#### Błąd 502 Bad Gateway

Możliwe przyczyny i rozwiązania:

1. Niedokończona inicjalizacja kontenerów

- Odczekaj dodatkowe 30 sekund na pełne uruchomienie wszystkich serwisów
- Sprawdź status kontenerów: `docker ps`
- Zweryfikuj logi: `docker-compose logs -f`

2. Problem z siecią Docker

- Wyczyść nieużywane sieci Docker:

### Scenariusze testowe weryfikujące poprawność działania

#### 1. Test edycji scenariusza

1. Kliknij prawym przyciskiem myszy na dowolny scenariusz
2. Wybierz opcję edycji z menu kontekstowego [menu kontekstowe z wyborem](deploy-images/img_1.png)
3. W formularzu edycji dodaj krótki opis w polu opisu [Opis](deploy-images/img_2.png)
4. Zapisz zmiany
5. Oczekiwany rezultat: Pojawi się powiadomienie potwierdzające poprawne zapisanie zmian [Rezultat](deploy-images/img_3.png)

#### 2. Test uruchomienia scenariusza

1. Kliknij lewym przyciskiem myszy na wiersz wybranego scenariusza
2. Oczekiwany rezultat: [Widok scenariusza](deploy-images/img_4.png)

> **Uwaga**: Szczegółowe przypadki testowe i pełna funkcjonalność systemu zostały opisane w [dokumentacji użytkowej](user-manual/smt-user-manual-0.95.pdf)

## Problem z połączeniem do bazy danych

1. Sprawdź logi PostgreSQL:

```bash
docker-compose -f docker-compose.prod.yml logs postgresql-master
```

2. Zweryfikuj zmienne środowiskowe w `.env.prod`
3. Sprawdź dostępność portu 5432

### ~~Problem z autoryzacją Keycloak~~

~~1. Sprawdź logi Keycloak:~~

```bash
docker-compose -f docker-compose.prod.yml logs keycloak
```

~~2. Zweryfikuj, czy realm.json został poprawnie zaimportowany~~
~~3. Sprawdź połączenie Keycloak z bazą danych~~

### Problem z Nginx

1. Sprawdź logi Nginx:

```bash
docker-compose -f docker-compose.prod.yml logs nginx
```

~~2. Zweryfikuj konfigurację CORS~~ 3. Sprawdź czy wszystkie upstream serwisy są dostępne

### Restart pojedynczego serwisu

```bash
docker-compose -f docker-compose.prod.yml restart [nazwa-serwisu]
```

### Całkowity restart systemu

```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```
