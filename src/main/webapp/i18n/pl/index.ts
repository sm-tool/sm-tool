import type { BaseTranslation } from '../i18n-types.js';

const pl = {
  todo: 'te we dodaj tu coś => {chodzi_o:string}',
  dtoErrors: {
    user: {
      email: {
        required: 'Email jest wymagany',
        invalid: 'Email musi być poprawnym adresem email',
      },
      password: {
        required: 'Hasło jest wymagane',
        invalid: 'Hasło jest niepoprawne',
        tooShort: 'Hasło jest zbyt krótkie, wymagane są minimum 8 znaki',
        tooLong: 'Hasło jest zbyt długie, wymagane są maksimum 64 znaki',
      },
      firstName: {
        required: 'Imię jest wymagane',
        invalid: 'Imię jest niepoprawne',
        tooShort: 'Imię jest zbyt krótkie, wymagane są minimum 2 znaki',
        tooLong: 'Imię jest zbyt długie, wymagane są maksimum 32 znaki',
      },
      lastName: {
        required: 'Nazwisko jest wymagane',
        invalid: 'Nazwisko jest niepoprawne',
        tooShort: 'Nazwisko jest zbyt krótkie, wymagane są minimum 2 znaki',
        tooLong: 'Nazwisko jest zbyt długie, wymagane są maksimum 32 znaki',
      },
      confirmPassword: {
        required: 'Potwierdzenie hasła jest wymagane',
        invalid: 'Hasła nie są takie same',
      },
      passwordStrength: {
        tooWeak: 'Hasło jest za słabe',
      },
    },
    association: {
      description: {
        required: 'Wymagana jest opis asocjacji',
        invalid: 'Opis asocjacji musi być prawidłowy',
        tooLong:
          'Opis asocjacji jest zbyt długi, musi mieć maksymalnie 32 znaki',
      },
    },
  },
} satisfies BaseTranslation;

export default pl;
