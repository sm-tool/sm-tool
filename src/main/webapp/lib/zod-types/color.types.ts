import { z } from '@/lib/zod-types/hiden-field.types.ts';
import { fieldConfig } from '@autoform/zod';
/**
 * Tworzy schemat walidacji Zod dla pola koloru w formacie HEX.
 *
 * @param {Object} [options] Opcjonalne parametry konfiguracyjne
 * @param {string} [options.required_error] Własna wiadomość błędu dla pola wymaganego
 * @param {string} [options.description] Opis pola wyświetlany w dokumentacji/UI
 *
 * @example
 * // Utworzenie schematu dla wymaganego pola koloru z własnym komunikatem błędu
 * const colorSchema = color({
 *   required_error: 'Kolor jest wymagany',
 *   description: 'Wybierz kolor w formacie HEX'
 * });
 *
 * // Walidacja wartości
 * const result = colorSchema.safeParse('#ff0000'); // poprawna wartość
 * const invalid = colorSchema.safeParse('red');     // niepoprawna wartość
 */
export const color = (options?: {
  required_error?: string;
  description?: string;
}) =>
  z
    .string({
      description: options?.description,
      required_error: options?.required_error,
    })
    .regex(/^#[0-9a-f]{6}$/i)
    .superRefine(
      fieldConfig({
        fieldType: 'color',
      }),
    );
