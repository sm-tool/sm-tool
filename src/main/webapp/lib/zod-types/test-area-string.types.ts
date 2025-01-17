import { z } from 'zod';
import { fieldConfig } from '@autoform/zod';
/**
 * Tworzy schemat walidacji Zod dla pola tekstowego wielolinijkowego (textarea).
 * Domyślna wartość to pusty ciąg znaków.
 *
 * @param {Object} [options] Opcjonalne parametry konfiguracyjne
 * @param {string} [options.required_error] Własna wiadomość błędu dla pola wymaganego
 * @param {string} [options.description] Opis pola wyświetlany w dokumentacji/UI
 *
 * @example
 * // Utworzenie schematu dla pola opisu
 * const descriptionSchema = textAreaString({
 *   required_error: 'Opis jest wymagany',
 *   description: 'Wprowadź szczegółowy opis produktu'
 * });
 *
 * // Walidacja wartości
 * const result = descriptionSchema.safeParse('To jest\nwielolinijkowy\ntekst'); // poprawna wartość
 * const empty = descriptionSchema.safeParse('');  // także poprawna (wartość domyślna)
 */
export const textAreaString = (options?: {
  required_error?: string;
  description?: string;
}) =>
  z
    .string({
      description: options?.description,
      required_error: options?.required_error,
    })
    .default('')
    .superRefine(fieldConfig({ fieldType: 'textAreaString' }));
