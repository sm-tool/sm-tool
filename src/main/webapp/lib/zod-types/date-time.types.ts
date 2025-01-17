import { z } from '@/lib/zod-types/hiden-field.types.ts';
import { fieldConfig } from '@autoform/zod';
/**
 * Tworzy schemat walidacji Zod dla pola daty i czasu.
 *
 * @param {Object} [options] Opcjonalne parametry konfiguracyjne
 * @param {string} [options.required_error] Własna wiadomość błędu dla pola wymaganego
 * @param {string} [options.description] Opis pola wyświetlany w dokumentacji/UI
 *
 * @example
 * // Utworzenie schematu dla wymaganego pola daty i czasu
 * const dateTimeSchema = dateTime({
 *   required_error: 'Data i czas są wymagane',
 *   description: 'Wybierz datę i godzinę wydarzenia'
 * });
 *
 * // Walidacja wartości
 * const result = dateTimeSchema.safeParse('2024-01-14T15:30:00'); // poprawna wartość
 * const invalid = dateTimeSchema.safeParse('2024-01-14');         // niepoprawna wartość (brak czasu)
 */
export const dateTime = (options?: {
  required_error?: string;
  description?: string;
}) =>
  z
    .string({
      description: options?.description,
      required_error: options?.required_error,
    })
    .superRefine(
      fieldConfig({
        fieldType: 'dateTime',
      }),
    );
