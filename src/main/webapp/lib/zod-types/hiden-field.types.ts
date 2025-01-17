import { z } from '@/lib/zod-types/hiden-field.types.ts';
import { fieldConfig } from '@autoform/zod';

declare module 'zod' {
  interface ZodType {
    hiddenField(): this;
  }
}
/**
 * Rozszerza typ ZodType o metodę hiddenField(), która automatycznie ukrywa pole w Autoformie.
 * Dodaje obsługę ukrytych pól poprzez modyfikację prototypu ZodType.
 *
 * @example
 * // Utworzenie schematu z ukrytym polem ID
 * const schema = z.object({
 *   id: z.number().hiddenField(),
 *   name: z.string()
 * });
 *
 * // Można stosować do dowolnego typu Zod
 * const hiddenString = z.string().hiddenField();
 * const hiddenArray = z.array(z.string()).hiddenField();
 *
 * // Ukryte pole zachowuje wszystkie własności walidacji
 * const validatedHidden = z.number()
 *   .min(1)
 *   .max(100)
 *   .hiddenField();
 */
z.ZodType.prototype.hiddenField = function () {
  return this.superRefine(
    fieldConfig({
      fieldType: 'hidden',
      fieldWrapper: () => {},
    }),
  );
};

export * from 'zod';
export { z } from 'zod';
