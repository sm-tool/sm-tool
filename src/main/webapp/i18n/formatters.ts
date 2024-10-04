import type { FormattersInitializer } from 'typesafe-i18n';
import type { Formatters, Locales } from './i18n-types.js';
import { date } from 'typesafe-i18n/formatters';

export const initFormatters: FormattersInitializer<Locales, Formatters> = (
  locale: Locales,
) => {
  const formatters: Formatters = {
    weekday: date(locale, { weekday: 'long' }),
  };

  return formatters;
};
