import { Button } from '@/components/ui/shadcn/button.tsx';

const injectLongText = () => {
  const longText =
    'Po co mi był ZX Spectrum?\nNa co mi była Amiga?\nWybrałem sobie karierę\nstarego nudnego grzyba.\n\nA mogłem być hydraulikiem,\nklientów miałbym bez liku,\nale mnie się zachciało\npisać programy w BASIC-u.\n\n(Refren:)\nProgramuję w .Necie\njuż trzecie stulecie,\nbo kto się w PHP-ie połapie?\n\nI zmierzam do celu\nz użyciem SQL-u\npod Microsoft Windows Vista.\n\nA kiedy mi smutno,\nstatyczny konstruktor\nutworzę\nw edytorze.\n\nBo wewnątrz mej głowy\nmam świat obiektowy,\nja, smutny programista.\n(Koniec refrenu)\n\nZa oknem ptaki śpiewają\ni tyle jest piękna na świecie,\nlecz nic nie widzę pięknego\nw pisaniu programów w .Necie.\n\nAch, gdzie te wózki widłowe,\ngdzie te miotły i szmaty?\nJa nie chcę być programistą,\nja chcę iść do łopaty!\n\n(Refren)\n\nGdy widzę szczęśliwych roboli,\npijanych w cztery litery,\nwiem wtedy, że wybrałem\nbłędną ścieżkę kariery.\n\nTeż chcę być na budowie,\ntam pić mi nikt nie zabroni.\nChcę tyle co oni pracować,\nchcę tyle zarabiać co oni!\n\n(Refren)\n\nTekst pochodzi z https://www.tekstowo.pl/piosenka,martin_lechowicz,smutny_programista.html'.repeat(
      1,
    );

  for (const element of document.querySelectorAll(
    'p, span, div, td, h1, h2, h3, h4, h5, h6',
  )) {
    if (
      element.childNodes.length === 1 &&
      element.childNodes[0].nodeType === 3
    ) {
      const styles = globalThis.getComputedStyle(element);
      if (styles.display !== 'none' && styles.visibility !== 'hidden') {
        element.textContent = longText;
      }
    }
  }
};
/**
 * Komponent narzędziowy do debugowania layoutu poprzez wstrzykiwanie długiego tekstu testowego.
 * Po kliknięciu przycisku, wszystkie elementy tekstowe na stronie zostają wypełnione
 * długim tekstem piosenki "Smutny Programista".
 *
 * Przycisk jest przypięty do dolnej krawędzi ekranu i wyświetla się ponad innymi elementami.
 * Komponent wykorzystuje shadcn/ui Button z wariantem destructive.
 *
 * @example
 * // Podstawowe użycie:
 * <DebugTextTool />
 *
 * // Komponent najlepiej umieścić na poziomie root aplikacji:
 * const App = () => {
 *   return (
 *     <>
 *       <MainContent />
 *       <DebugTextTool />
 *     </>
 *   );
 * };
 */
export const DebugTextTool = () => {
  return (
    <div className='size-auto flex items-center justify-center'>
      <Button
        variant='destructive'
        onClick={injectLongText}
        className='fixed bottom-0 mx-auto z-50'
      >
        <span className='text-sm font-medium max-w-[200px] overflow-hidden'>
          The heheszyki button
        </span>
      </Button>
    </div>
  );
};

export default DebugTextTool;
