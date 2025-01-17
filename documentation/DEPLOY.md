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

## Wymagania systemowe

### Oprogramowanie

- Docker (minimum wersja 20.10.x)
- Docker Compose (minimum wersja 2.x)
- Minimum 4GB RAM
- Minimum 20GB przestrzeni dyskowej

### Porty

- 80: Nginx (konfigurowalny przez NGINX_PORT)
- 5432: PostgreSQL master
- 8180: Keycloak (dostępny przez /auth)
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

#### Domyślne uruchamianie

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

## Weryfikacja deploymentu

- Frontend: `http://localhost:${NGINX_PORT}`
- Keycloak: `http://localhost:${NGINX_PORT}/auth`
- API: `http://localhost:${NGINX_PORT}/api`

## Przygotowanie serwera

Tutaj zakładamy, że administrator serwera posiada własną konfigurację, ale poniżej przedstawiona jest przykładowa konfiguracja

### 1. Podstawowa konfiguracja serwera

```bash
# Aktualizacja systemu
sudo apt update && sudo apt upgrade -y

# Instalacja wymaganych narzędzi
sudo apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    ufw \
    fail2ban

# Konfiguracja firewalla
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

### 2. Instalacja Dockera i Docker Compose

```bash
# Dodanie oficjalnego repozytorium Dockera
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalacja Dockera
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Dodanie użytkownika do grupy docker
sudo usermod -aG docker $USER
```

### 3. Przygotowanie struktury katalogów

```bash
# Utworzenie katalogów
mkdir -p ~/app/{config,data,logs}
cd ~/app

# Konfiguracja uprawnień
chmod 700 config
```

### 4. Konfiguracja SSH

```bash
# Generowanie klucza SSH na lokalnej maszynie (jeśli nie istnieje)
ssh-keygen -t ed25519 -C "twoj_email@domena.com"

# Kopiowanie klucza na serwer
ssh-copy-id user@twoj-serwer.com

# Konfiguracja SSH na serwerze
sudo nano /etc/ssh/sshd_config
```

```conf
# Zalecane ustawienia SSH
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

## Konfiguracja HTTPS

### 1. Instalacja Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
```

### 2. Generowanie certyfikatu

```bash
sudo certbot --nginx -d twoja-domena.com
```

### 3. Aktualizacja konfiguracji Nginx

```nginx
server {
    listen 443 ssl;
    server_name twoja-domena.com;

    ssl_certificate /etc/letsencrypt/live/twoja-domena.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/twoja-domena.com/privkey.pem;

    # Dodanie nagłówków bezpieczeństwa
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

## Problem z połączeniem do bazy danych

1. Sprawdź logi PostgreSQL:

```bash
docker-compose -f docker-compose.prod.yml logs postgresql-master
```

2. Zweryfikuj zmienne środowiskowe w `.env.prod`
3. Sprawdź dostępność portu 5432

### Problem z autoryzacją Keycloak

1. Sprawdź logi Keycloak:

```bash
docker-compose -f docker-compose.prod.yml logs keycloak
```

2. Zweryfikuj, czy realm.json został poprawnie zaimportowany
3. Sprawdź połączenie Keycloak z bazą danych

### Problem z Nginx

1. Sprawdź logi Nginx:

```bash
docker-compose -f docker-compose.prod.yml logs nginx
```

2. Zweryfikuj konfigurację CORS
3. Sprawdź czy wszystkie upstream serwisy są dostępne

### Restart pojedynczego serwisu

```bash
docker-compose -f docker-compose.prod.yml restart [nazwa-serwisu]
```

### Całkowity restart systemu

```bash
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```
