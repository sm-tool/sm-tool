
## Typy w systemie

Typy służą do kategoryzacji i definiowania zasad zachowania elementów w systemie. Wyróżniamy dwa podstawowe rodzaje:

## Typ Obiektu

Jest to definicja kategorii obiektu występującego w scenariuszu. Określa jego podstawowe cechy i zachowania, w tym konieczność globalnego dostępu do obiektu, możliwość przypisania do niego użytkownika czy przynależność do szerszej kategorii (występuje hierarchia)
## Typ Asocjacji

Definiuje dozwolony rodzaj relacji między obiektami w systemie. Określa typy obiektów które mogą wchodzić ze sobą w interakcje

Typy stanowią podstawę do zachowania spójności i prawidłowych relacji między elementami w systemie.

### Szablony w systemie

Szablony definiują wzorce dla obiektów i ich atrybutów, umożliwiając standaryzację i automatyzację procesu tworzenia nowych elementów w scenariuszach.

## Szablon Obiektu

Stanowi wzorzec definiujący strukturę i domyślne właściwości dla grupy podobnych obiektów. Określa zarówno typ obiektu, do którego jest przypisany jak i wymagane atrybuty

## Szablon Atrybutu

Definiuje pojedynczą cechę, którą mogą posiadać obiekty danego szablonu.
Szablony pozwalają na szybkie i spójne tworzenie nowych elementów w systemie, zapewniając standardowy zestaw właściwości i wartości początkowych.
## Scenariusz
Scenariusz reprezentuje złożoną strukturę organizacyjną służącą do modelowania i symulacji sekwencji wydarzeń zachodzących w określonych ramach czasowych. Jest to centralny element systemu, który integruje i zarządza wieloma powiązanymi komponentami: wydarzeniami, wątkami, fazami i obiektami. Bezpośrednio zawiera metadane opisujące jego kontekst.
Implementuje system uprawnień kontrolujący dostęp użytkowników.
Scenariusz podzielony jest na akcje - konkretne fragmenty czasowe, których długość można zdefiniować.

## Faza scenariusza
Faza scenariusza reprezentuje logiczny, wydzielony przedział czasowy w ramach całego scenariusza. Pozwala na podział scenariusza na mniejsze, znaczące etapy, ułatwiając organizację i wizualizację wydarzeń.
## Wątek

Wątek reprezentuje sekwencję wydarzeń w scenariuszu, pozwalając na modelowanie równoległych ciągów wydarzeń. Trwają określoną liczbę akcji. W systemie występują dwa rodzaje wątków:

### Wątek Globalny

- Jest jeden na scenariusz
- Zawiera wydarzenia dostępne i wpływające na wszystkie pozostałe wątki
- Przechowuje obiekty globalne dostępne w całym scenariuszu

### Wątki Lokalne

- Reprezentują niezależne sekwencje wydarzeń
- Zawierają własne, lokalne obiekty
- Mogą być łączone lub rozdzielane za pomocą rozgałęzień

### Rozgałęzienia

Wątki mogą na siebie oddziaływać poprzez operacje:

- FORK - podział jednego wątku na wiele, wraz z dystrybucją obiektów - definiowaną przez użytkownika
- JOIN - łączenie wielu wątków w jeden, wraz z przekazaniem ich obiektów

### Wydarzenie

Wydarzenie trwa zawsze jedną akcję. Opisuje zachodzące w określonym momencie scenariusza zmiany (także te wpływające na organizację wątków). 
System rozróżnia następujące typy wydarzeń:

- START/END - kontrolują rozpoczęcie i zakończenie wątku
- NORMAL - standardowe wydarzenia w wątku lokalnym
- GLOBAL - wydarzenia w wątku globalnym (najwyższy priorytet)
- FORK_IN/FORK_OUT - obsługują proces podziału wątku
- JOIN_IN/JOIN_OUT - obsługują proces łączenia wątków
- IDLE - wydarzenia puste, brak zmian w wątku

Tylko wydarzenia IDLE, NORMAL oraz GLOBAL są bezpośrednio tworzone przez użytkownika. 
W wydarzeniach NORMAL oraz GLOBAL następują modyfikacje atrybutów obiektów oraz zarządzanie asocjacjami między nimi
## Obiekty

Obiekt stanowi podstawową jednostkę w scenariuszu, reprezentującą konkretny element posiadający zdefiniowane atrybuty i mogący wchodzić w relacje z innymi obiektami. System rozróżnia obiekty globalne tworzone w wątku globalnym i dostępne w każdym innym oraz obiekty lokalne przypisane do konkretnych wątków i niedostępne w danym czasie w żadnym innym. Jedynym sposobem ich przekazania dalej są operacje rozgałęzień na wątkach.
Każdy obiekt tworzony jest na podstawie szablonu określającego jego strukturę
## Asocjacje

Asocjacje reprezentują relacje między obiektami w scenariuszu. Mogą być tworzone i usuwane w ramach wydarzeń

## Atrybuty

Atrybuty definiują właściwości obiektów, które mogą zmieniać się w czasie trwania scenariusza. Każdy atrybut jest tworzony na podstawie szablonu obiektu określającego jego cechy domyślnie przyjmuje wartość zdefiniowaną w szablonie

# Logika biznesowa

## Dodawanie Scenariusza

### Cel operacji

Utworzenie nowego scenariusza, który służy jako główny kontener organizujący wydarzenia, wątki i obiekty w określonych ramach czasowych.
### Operacja

Proces dodawania scenariusza obejmuje:

1. **Konfigurację podstawową**
    - Określenie ram czasowych (data początku i końca)
    - Zdefiniowanie jednostki czasu dla wydarzeń
    - Ustalenie metadanych (tytuł, opis, kontekst, cel)
2. **Inicjalizacji struktury**
    - Utworzenie wątku globalnego do zarządzania głównymi wydarzeniami
    - Przygotowanie dostępnych typów obiektów w scenariuszu
3. **Konfiguracji uprawnień**
    - Przypisanie twórcy jako właściciela scenariusza
    - Nadanie pełnych uprawnień administracyjnych

### Ograniczenia biznesowe

- Ramy czasowe muszą być logicznie spójne (data końcowa później niż początkowa)
- Każdy scenariusz musi mieć dokładnie jednego właściciela
- Scenariusz musi posiadać wątek globalny do synchronizacji wydarzeń

### Rezultat

Utworzony scenariusz wraz z możliwymi do wykorzystania podstawowymi typami i zdefiniowanym wątkiem globalnym

## Usuwanie scenariusza
### Cel
Usunięcie scenariusza wraz z zawartymi w nim wydarzeniami, wątkami i obiektami.
### Operacja

Proces usuwania scenariusza obejmuje:

1. **Usuwanie obiektów
    - Wraz z nimi usuwane są wszelkie ich zmiany
2. **Usuwanie wątków**
    - Usuwanie rozgałęzień
    - Usuwanie wydarzeń
3. **Usuwanie samego scenariusza**
    - Wraz z nim pozostałych powiązań
### Ograniczenia biznesowe
Usuwający musi być autorem scenariusza
### Rezultat
Usunięty scenariusz wraz z wszystkimi śladami jego obecności
## Aktualizacja metadanych scenariusza
### Cel
Zmiana kontekstu scenariusza
### Operacja

Proces zmiany kontekstu scenariusza obejmuje wprowadzenie i zapisanie zmienionych informacji
### Ograniczenia biznesowe
Wprowadzone dane muszą istnieć (nie można wprowadzić wartości `null`)
### Rezultat
Zmienione metadane scenariusza

## Dodawanie wątku
### Cel
Dodanie nowego wątku w scenariuszu
### Operacja
Wątek może być dodany na dwa różne sposoby (nie uwzględniając wątku globalnego wstawianego automatycznie wraz z tworzeniem scenariusza)
Istnieją trzy podstawowe sposoby dodania wątku - jeden bezpośredni i dwa pośrednie
Sposób bezpośredni obejmuje zwykłe wstawienie wątku w określonym czasie natomiast pośrednie wstawienie rozgałęzień.
Ponadto podstawowymi różnicami po za sposobem samego wstawienia wątku jest przekazywanie obiektów (stąd też podział na trzy).
W przypadku "zwykłego" wątku obiekty możliwe są do dodania ręcznie
W przypadku łączenia wątków (JOIN) wszystkie obiekty z wątków wchodzących przekazywane są do nowego wątku.
W przypadku podziału wątku należy zdefiniować które obiekty mają być przekazane do którego potomka
#### Bezpośredni
Proces wstawienia takiego wątku obejmuje:
1. **Konfigurację podstawową**
    - Zdefiniowanie podstawowych danych oraz czasu powstania wątku (konkretna akcja)
2. **Inicjalizacji odpowiednich struktur**
    - Dodanie wątku skutkuje wstawieniem wydarzeń START na jego początek oraz END na bezpośrednio kolejną akcję
#### Pośredni
Dodanie rozgałęzienia JOIN skutkuje utworzeniem jednego nowego wątku z połączenia innych. A FORK stworzeniem wielu wątków z jednego.
Tworzenie rozgałęzień możliwe jest w trakcie trwania danego (jednego) (w przypadku FORK jedynego dla JOIN - wybranego) wątku co umożliwia jego "podział" na dwa następujące po sobie wątki.
Dokładniejszy opis zawarty w dodawaniu rozgałęzień

### Ograniczenia biznesowe
W przypadku dodawania wątku bezpośrednio brak,
dla rozgałęzień opisany oddzielnie
### Rezultat
Utworzenie nowego wątku

## Zmiana informacji wątku
### Cel
Zmiana informacji określonych w wątku
### Operacja
Operacja obejmuje wprowadzenie zmienionych danych i ich zapisanie
### Ograniczenia biznesowe
Nie można wstawić pustych danych
### Rezultat
Zmiana danych wątku

## Usuwanie wątku
### Cel
Usunięcie danego wątku
### Operacja
Ze względu na możliwe powiązania z innymi wątkami jest to operacja dość niebezpieczna, gdyż usuwa także wszystkie wątki bezpośrednio wynikające z usuwanego
Sama operacja obejmuje:
1. **Analizę wątków**
    - Znajdowane są wszystkie wątki bezpośrednio wynikające z danego wątku za pomocą rozgałęzień
    - FORK w całości zależy od konkretnego wątku
    - JOIN tylko jeżeli wszystkie wątki wchodzące do niego zależą od jednego wątku
    - W przypadku pozostawienia jednego wątku wchodzącego do łączenia nie jest ono potrzebne i w dalszej części będzie usunięte
2. **Usunięcie danych wątków**
    - Usuwany jest dany wątek i wszystkie z niego wynikające
    - Usuwane są niepotrzebne rozgałęzienia
3. Usunięcie łączeń jeden-do-jednego
	- Wszystkie znalezione rozgałęzienia są usuwane
	- Wydarzenia wątku wychodzącego są przenoszone do wątku wchodzącego, który jest odpowiednio wydłużany

### Ograniczenia biznesowe
Brak
### Rezultat
Usunięcie wątku wraz z wszystkimi innymi które były od niego zależne