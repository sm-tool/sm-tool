import { z } from '@/lib/zod-types/hiden-field.types.ts';
import { fieldConfig } from '@autoform/zod';
import { ZodNumber } from 'zod';
/**
 * Tworzy schemat walidacji Zod dla referencji do identyfikatora typu obiektu.
 * Automatycznie konwertuje wartości wejściowe na liczby.
 *
 * @param {Object} config Konfiguracja schematu
 * @param {Object} [config.options] Opcjonalne parametry konfiguracyjne
 * @param {string} [config.options.required_error] Własna wiadomość błędu dla pola wymaganego
 * @param {string} [config.options.description] Opis pola wyświetlany w dokumentacji/UI
 * @param {Function} [config.modifier] Funkcja modyfikująca bazowy schemat ZodNumber przed dodaniem konfiguracji pola.
 *                                    Pozwala na dodanie dodatkowych reguł walidacji.
 *
 * @example
 * // Podstawowe użycie
 * const basicSchema = objectTypeIdReference({
 *   options: {
 *     description: 'Wybierz typ obiektu nadrzędnego'
 *   }
 * });
 *
 * // Użycie z modyfikatorem dodającym własne reguły
 * const customSchema = objectTypeIdReference({
 *   options: {
 *     required_error: 'Musisz wybrać typ obiektu'
 *   },
 *   modifier: (schema) => schema.min(1, 'ID musi być większe niż 0')
 * });
 *
 * // Walidacja
 * const result = customSchema.safeParse(5);    // poprawna wartość
 * const invalid = customSchema.safeParse(-1);   // niepoprawna wartość
 */
export const objectTypeIdReference = ({
  options,
  modifier,
}: {
  options?: {
    required_error?: string;
    description?: string;
  };
  modifier?: (schema: ZodNumber) => ZodNumber;
}) => {
  let schema = z.coerce.number({
    required_error:
      options?.required_error ?? 'The parent reference must be set',
    invalid_type_error: 'The parent reference must be set',
    description: options?.description,
  });

  if (modifier) {
    schema = modifier(schema);
  }

  return schema.superRefine(fieldConfig({ fieldType: 'objectTypeReference' }));
};
