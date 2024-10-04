// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be
// overwritten.
/* eslint-disable -- libka */
import type {
  BaseTranslation as BaseTranslationType,
  LocalizedString,
  RequiredParams,
} from 'typesafe-i18n';

export type BaseTranslation = BaseTranslationType;
export type BaseLocale = 'en';

export type Locales = 'en' | 'pl';

export type Translation = RootTranslation;

export type Translations = RootTranslation;

type RootTranslation = {
  /**
   * t​e​ ​w​e​ ​d​o​d​a​j​ ​t​u​ ​c​o​ś​ ​=​>​ ​{​c​h​o​d​z​i​_​o​}
   * @param {string} chodzi_o
   */
  todo: RequiredParams<'chodzi_o'>;
  dtoErrors: {
    user: {
      email: {
        /**
         * E​m​a​i​l​ ​i​s​ ​r​e​q​u​i​r​e​d
         */
        required: string;
        /**
         * E​m​a​i​l​ ​i​s​ ​i​n​v​a​l​i​d
         */
        invalid: string;
      };
      password: {
        /**
         * P​a​s​s​w​o​r​d​ ​i​s​ ​r​e​q​u​i​r​e​d
         */
        required: string;
        /**
         * P​a​s​s​w​o​r​d​ ​i​s​ ​t​o​o​ ​s​h​o​r​t​,​ ​i​t​ ​h​a​s​ ​t​o​
         * ​b​e​ ​a​t​ ​l​e​a​s​t​ ​2​ ​c​h​a​r​a​c​t​e​r​s
         */
        tooShort: string;
        /**
         * P​a​s​s​w​o​r​d​ ​i​s​ ​t​o​o​ ​l​o​n​g​,​ ​i​t​ ​h​a​s​ ​t​o​ ​b​e​
         * ​a​t​ ​m​o​s​t​ ​3​2​ ​c​h​a​r​a​c​t​e​r​s
         */
        tooLong: string;
        /**
         * P​a​s​s​w​o​r​d​ ​i​s​ ​i​n​v​a​l​i​d
         */
        invalid: string;
      };
      firstName: {
        /**
         * F​i​r​s​t​ ​n​a​m​e​ ​i​s​ ​r​e​q​u​i​r​e​d
         */
        required: string;
        /**
         * F​i​r​s​t​ ​n​a​m​e​ ​i​s​ ​i​n​v​a​l​i​d
         */
        invalid: string;
        /**
         * F​i​r​s​t​ ​n​a​m​e​ ​i​s​ ​t​o​o​ ​s​h​o​r​t​,​ ​i​t​ ​h​a​s​ ​t​o​
         * ​b​e​ ​a​t​ ​l​e​a​s​t​ ​2​ ​c​h​a​r​a​c​t​e​r​s
         */
        tooShort: string;
        /**
         * F​i​r​s​t​ ​n​a​m​e​ ​i​s​ ​t​o​o​ ​l​o​n​g​,​ ​i​t​ ​h​a​s​ ​t​o​
         * ​b​e​ ​a​t​ ​m​o​s​t​ ​3​2​ ​c​h​a​r​a​c​t​e​r​s
         */
        tooLong: string;
      };
      lastName: {
        /**
         * L​a​s​t​ ​n​a​m​e​ ​i​s​ ​r​e​q​u​i​r​e​d
         */
        required: string;
        /**
         * L​a​s​t​ ​n​a​m​e​ ​i​s​ ​i​n​v​a​l​i​d
         */
        invalid: string;
        /**
         * L​a​s​t​ ​n​a​m​e​ ​i​t​ ​t​o​o​ ​s​h​o​r​t​,​ ​i​t​ ​h​a​s​ ​t​o​
         * ​b​e​ ​a​t​ ​l​e​a​s​t​ ​2​ ​c​h​a​r​a​c​t​e​r​s
         */
        tooShort: string;
        /**
         * L​a​s​t​ ​n​a​m​e​ ​i​s​ ​t​o​o​ ​l​o​n​g​,​ ​i​t​ ​h​a​s​ ​t​o​
         * ​b​e​ ​a​t​ ​m​o​s​t​ ​3​2​ ​c​h​a​r​a​c​t​e​r​s
         */
        tooLong: string;
      };
      confirmPassword: {
        /**
         * C​o​n​f​i​r​m​ ​p​a​s​s​w​o​r​d​ ​i​s​ ​r​e​q​u​i​r​e​d
         */
        required: string;
        /**
         * C​o​n​f​i​r​m​ ​p​a​s​s​w​o​r​d​ ​i​s​ ​i​n​v​a​l​i​d
         */
        invalid: string;
        /**
         * C​o​n​f​i​r​m​ ​p​a​s​s​w​o​r​d​ ​d​o​e​s​ ​n​o​t​ ​m​a​t​c​h​
         * ​p​a​s​s​w​o​r​d
         */
        mismatch: string;
      };
      passwordStrength: {
        /**
         * P​a​s​s​w​o​r​d​ ​i​s​ ​t​o​o​ ​w​e​a​k
         */
        tooWeak: string;
      };
    };
    association: {
      description: {
        /**
         * A​s​s​o​c​i​a​t​i​o​n​ ​d​e​s​c​r​i​p​t​i​o​n​ ​i​s​ ​r​e​q​u​i​r​e​d
         */
        required: string;
        /**
         * A​s​s​o​c​i​a​t​i​o​n​ ​d​e​s​c​r​i​p​t​i​o​n​ ​i​s​ ​i​n​v​a​l​i​d
         */
        invalid: string;
        /**
         * A​s​s​o​c​i​a​t​i​o​n​ ​d​e​s​c​r​i​p​t​i​o​n​ ​i​s​ ​t​o​o​
         * ​l​o​n​g​,​ ​i​t​ ​h​a​s​ ​t​o​ ​b​e​ ​a​t​ ​m​o​s​t​ ​3​2​
         * ​c​h​a​r​a​c​t​e​r​s
         */
        tooLong: string;
      };
      objects: {
        /**
         * A​s​s​o​c​i​a​c​i​o​n​ ​o​b​j​e​c​t​s​ ​m​u​s​t​ ​d​i​f​f​e​r
         */
        mustDiffer: string;
      };
    };
    attribute: {
      name: {
        /**
         * A​t​t​r​i​b​u​t​e​ ​n​a​m​e​ ​i​s​ ​r​e​q​u​i​r​e​d
         */
        required: string;
        /**
         * A​t​t​r​i​b​u​t​e​ ​n​a​m​e​ ​i​s​ ​i​n​v​a​l​i​d
         */
        invalid: string;
        /**
         * A​t​t​r​i​b​u​t​e​ ​n​a​m​e​ ​i​s​ ​t​o​o​ ​l​o​n​g​,​ ​i​t​ ​h​a​s​
         * ​t​o​ ​b​e​ ​a​t​ ​m​o​s​t​ ​3​2​ ​c​h​a​r​a​c​t​e​r​s
         */
        tooLong: string;
      };
      value: {
        /**
         * A​t​t​r​i​b​u​t​e​ ​v​a​l​u​e​ ​i​s​ ​i​n​v​a​l​i​d
         */
        invalid: string;
        /**
         * A​t​t​r​i​b​u​t​e​ ​v​a​l​u​e​ ​i​s​ ​t​o​o​ ​l​o​n​g​,​ ​i​t​
         * ​h​a​s​ ​t​o​ ​b​e​ ​a​t​ ​m​o​s​t​ ​3​2​ ​c​h​a​r​a​c​t​e​r​s
         */
        tooLong: string;
      };
    };
    objectVariants: {
      template: {
        title: {
          /**
           * T​i​t​l​e​ ​i​s​ ​r​e​q​u​i​r​e​d
           */
          required: string;
          /**
           * T​i​t​l​e​ ​i​s​ ​i​n​v​a​l​i​d
           */
          invalid: string;
          /**
           * T​i​t​l​e​ ​i​s​ ​t​o​o​ ​l​o​n​g​,​ ​i​t​ ​h​a​s​ ​t​o​ ​b​e​
           * ​a​t​ ​m​o​s​t​ ​3​2​ ​c​h​a​r​a​c​t​e​r​s
           */
          tooLong: string;
        };
        attributeName: {
          /**
           * O​n​e​ ​o​f​ ​a​t​t​r​i​b​u​t​e​'​s​ ​n​a​m​e​ ​i​s​ ​i​n​v​a​l​i​d
           */
          invalid: string;
          /**
           * O​n​e​ ​o​f​ ​a​t​t​r​i​b​u​t​e​'​s​ ​n​a​m​e​ ​i​s​ ​t​o​o​
           * ​l​o​n​g​,​ ​i​t​ ​h​a​s​ ​t​o​ ​b​e​ ​a​t​ ​m​o​s​t​ ​3​2​
           * ​c​h​a​r​a​c​t​e​r​s
           */
          tooLong: string;
        };
      };
      type: {
        title: {
          /**
           * T​i​t​l​e​ ​i​s​ ​r​e​q​u​i​r​e​d
           */
          required: string;
          /**
           * T​i​t​l​e​ ​i​s​ ​i​n​v​a​l​i​d
           */
          invalid: string;
          /**
           * T​i​t​l​e​ ​i​s​ ​t​o​o​ ​l​o​n​g​,​ ​i​t​ ​h​a​s​ ​t​o​ ​b​e​
           * ​a​t​ ​m​o​s​t​ ​3​2​ ​c​h​a​r​a​c​t​e​r​s
           */
          tooLong: string;
        };
        color: {
          /**
           * C​o​l​o​r​ ​i​s​ ​r​e​q​u​i​r​e​d
           */
          required: string;
          /**
           * C​o​l​o​r​ ​i​s​ ​i​n​v​a​l​i​d
           */
          invalid: string;
        };
      };
      object: {
        name: {
          /**
           * N​a​m​e​ ​i​s​ ​r​e​q​u​i​r​e​d
           */
          required: string;
          /**
           * N​a​m​e​ ​i​s​ ​i​n​v​a​l​i​d
           */
          invalid: string;
          /**
           * N​a​m​e​ ​i​s​ ​t​o​o​ ​l​o​n​g​,​ ​i​t​ ​h​a​s​ ​t​o​ ​b​e​ ​a​t​
           * ​m​o​s​t​ ​3​2​ ​c​h​a​r​a​c​t​e​r​s
           */
          tooLong: string;
        };
      };
    };
    event: {
      deltaTime: {
        /**
         * E​v​e​n​t​ ​h​a​p​p​e​n​i​n​g​ ​t​i​m​e​ ​i​s​ ​r​e​q​u​i​r​e​d
         */
        required: string;
        /**
         * E​v​e​n​t​ ​h​a​p​p​e​n​i​n​g​ ​t​i​m​e​ ​i​s​ ​i​v​a​l​i​d
         */
        invalid: string;
        /**
         * E​v​e​n​t​ ​h​a​p​p​e​n​i​n​g​ ​t​i​m​e​ ​m​u​s​t​ ​b​e​
         * ​p​o​s​i​t​i​v​e
         */
        positive: string;
      };
      title: {
        /**
         * T​i​t​l​e​ ​i​s​ ​r​e​q​u​i​r​e​d
         */
        required: string;
        /**
         * T​i​t​l​e​ ​i​s​ ​i​n​v​a​l​i​d
         */
        invalid: string;
        /**
         * T​i​t​l​e​ ​i​s​ ​t​o​o​ ​l​o​n​g​,​ ​i​t​ ​h​a​s​ ​t​o​ ​b​e​ ​a​t​
         * ​m​o​s​t​ ​3​2​ ​c​h​a​r​a​c​t​e​r​s
         */
        tooLong: string;
      };
      description: {
        /**
         * D​e​s​c​r​i​p​t​i​o​n​ ​i​s​ ​i​n​v​a​l​i​d
         */
        invalid: string;
        /**
         * D​e​s​c​r​i​p​t​i​o​n​ ​i​s​ ​t​o​o​ ​l​o​n​g​,​ ​u​t​ ​h​a​s​ ​t​o​
         * ​b​e​ ​a​t​ ​m​o​s​t​ ​2​5​6​ ​c​h​a​r​a​c​t​e​r​s
         */
        tooLong: string;
      };
    };
    observer: {
      name: {
        /**
         * N​a​m​e​ ​i​s​ ​r​e​q​u​i​r​e​d
         */
        required: string;
        /**
         * N​a​m​e​ ​i​s​ ​i​n​v​a​l​i​d
         */
        invalid: string;
        /**
         * N​a​m​e​ ​i​s​ ​t​o​o​ ​l​o​n​g​,​ ​i​t​ ​h​a​s​ ​t​o​ ​b​e​ ​a​t​
         * ​m​o​s​t​ ​3​2​ ​c​h​a​r​a​c​t​e​r​s
         */
        tooLong: string;
      };
    };
    entity: {
      title: {
        /**
         * T​i​t​l​e​ ​i​s​ ​r​e​q​u​i​r​e​d
         */
        required: string;
        /**
         * T​i​t​l​e​ ​i​s​ ​i​n​v​a​l​i​d
         */
        invalid: string;
        /**
         * T​i​t​l​e​ ​i​s​ ​t​o​o​ ​l​o​n​g​,​ ​i​t​ ​h​a​s​ ​t​o​ ​b​e​ ​a​t​
         * ​m​o​s​t​ ​3​2​ ​c​h​a​r​a​c​t​e​r​s
         */
        tooLong: string;
      };
      description: {
        /**
         * D​e​s​c​r​i​p​t​i​o​n​ ​i​s​ ​i​n​v​a​l​i​d
         */
        invalid: string;
        /**
         * D​e​s​c​r​i​p​t​i​o​n​ ​i​s​ ​t​o​o​ ​l​o​n​g​,​ ​u​t​ ​h​a​s​ ​t​o​
         * ​b​e​ ​a​t​ ​m​o​s​t​ ​3​2​ ​c​h​a​r​a​c​t​e​r​s
         */
        tooLong: string;
      };
      startTime: {
        /**
         * S​t​a​r​t​i​n​g​ ​t​i​m​e​ ​i​s​ ​r​e​q​u​i​r​e​d
         */
        required: string;
        /**
         * S​t​a​r​t​i​n​g​ ​t​i​m​e​ ​i​s​ ​i​n​v​a​l​i​d
         */
        invalid: string;
      };
      endTime: {
        /**
         * S​t​a​r​t​i​n​g​ ​t​i​m​e​ ​i​s​ ​r​e​q​u​i​r​e​d
         */
        required: string;
        /**
         * S​t​a​r​t​i​n​g​ ​t​i​m​e​ ​i​s​ ​i​n​v​a​l​i​d
         */
        invalid: string;
      };
      /**
       * S​t​a​r​t​i​n​g​ ​t​i​m​e​,​ ​c​a​n​n​o​t​ ​h​a​p​p​e​n​ ​a​f​t​e​r​
       * ​e​n​d​i​n​g​ ​t​i​m​e
       */
      startGraterThanEnd: string;
    };
    scenario: {
      scenarioInformation: {
        name: {
          /**
           * N​a​m​e​ ​i​s​ ​r​e​q​u​i​r​e​d
           */
          required: string;
          /**
           * N​a​m​e​ ​i​s​ ​i​n​v​a​l​i​d
           */
          invalid: string;
          /**
           * N​a​m​e​ ​i​s​ ​t​o​o​ ​l​o​n​g​,​ ​i​t​ ​h​a​s​ ​t​o​ ​b​e​ ​a​t​
           * ​m​o​s​t​ ​3​2​ ​c​h​a​r​a​c​t​e​r​s
           */
          tooLong: string;
        };
        description: {
          /**
           * D​e​s​c​r​i​p​t​i​o​n​ ​i​s​ ​i​n​v​a​l​i​d
           */
          invalid: string;
          /**
           * D​e​s​c​r​i​p​t​i​o​n​ ​i​s​ ​t​o​o​ ​l​o​n​g​,​ ​u​t​ ​h​a​s​
           * ​t​o​ ​b​e​ ​a​t​ ​m​o​s​t​ ​2​5​6​ ​c​h​a​r​a​c​t​e​r​s
           */
          tooLong: string;
        };
        context: {
          /**
           * C​o​n​t​e​x​t​ ​i​s​ ​i​n​v​a​l​i​d
           */
          invalid: string;
          /**
           * C​o​n​t​e​x​t​ ​i​s​ ​t​o​o​ ​l​o​n​g​,​ ​u​t​ ​h​a​s​ ​t​o​ ​b​e​
           * ​a​t​ ​m​o​s​t​ ​6​4​ ​c​h​a​r​a​c​t​e​r​s
           */
          tooLong: string;
        };
      };
    };
  };
  forms: {
    /**
     * S​u​b​m​i​t
     */
    submit: string;
    /**
     * S​u​b​m​i​t​t​i​n​g
     */
    submitLoading: string;
    components: {};
    errors: {
      /**
       * O​o​p​s​!​ ​S​o​m​e​t​h​i​n​g​ ​w​e​n​t​ ​w​r​o​n​g​.
       */
      oops: string;
      /**
       * B​a​d​ ​R​e​q​u​e​s​t
       */
      badRequest: string;
      /**
       * U​n​a​u​t​h​o​r​i​z​e​d
       */
      unauthorized: string;
      /**
       * F​o​r​b​i​d​d​e​n
       */
      forbidden: string;
      /**
       * P​a​g​e​ ​N​o​t​ ​F​o​u​n​d
       */
      notFound: string;
      /**
       * M​e​t​h​o​d​ ​N​o​t​ ​A​l​l​o​w​e​d
       */
      methodNotAllowed: string;
      /**
       * R​e​q​u​e​s​t​ ​T​i​m​e​o​u​t
       */
      requestTimeout: string;
      /**
       * S​e​r​v​e​r​ ​E​r​r​o​r
       */
      serverError: string;
      /**
       * N​o​t​ ​I​m​p​l​e​m​e​n​t​e​d
       */
      notImplemented: string;
      /**
       * B​a​d​ ​G​a​t​e​w​a​y
       */
      badGateway: string;
      /**
       * S​e​r​v​i​c​e​ ​U​n​a​v​a​i​l​a​b​l​e
       */
      serviceUnavailable: string;
      /**
       * G​a​t​e​w​a​y​ ​T​i​m​e​o​u​t
       */
      gatewayTimeout: string;
      /**
       * U​n​k​n​o​w​n​ ​E​r​r​o​r
       */
      unknown: string;
      /**
       * B​a​c​k​ ​t​o​ ​H​o​m​e​ ​P​a​g​e
       */
      backToHome: string;
    };
  };
};

export type TranslationFunctions = {
  /**
   * te we dodaj tu coś => {chodzi_o}
   */
  todo: (arg: { chodzi_o: string }) => LocalizedString;
  dtoErrors: {
    user: {
      email: {
        /**
         * Email is required
         */
        required: () => LocalizedString;
        /**
         * Email is invalid
         */
        invalid: () => LocalizedString;
      };
      password: {
        /**
         * Password is required
         */
        required: () => LocalizedString;
        /**
         * Password is too short, it has to be at least 2 characters
         */
        tooShort: () => LocalizedString;
        /**
         * Password is too long, it has to be at most 32 characters
         */
        tooLong: () => LocalizedString;
        /**
         * Password is invalid
         */
        invalid: () => LocalizedString;
      };
      firstName: {
        /**
         * First name is required
         */
        required: () => LocalizedString;
        /**
         * First name is invalid
         */
        invalid: () => LocalizedString;
        /**
         * First name is too short, it has to be at least 2 characters
         */
        tooShort: () => LocalizedString;
        /**
         * First name is too long, it has to be at most 32 characters
         */
        tooLong: () => LocalizedString;
      };
      lastName: {
        /**
         * Last name is required
         */
        required: () => LocalizedString;
        /**
         * Last name is invalid
         */
        invalid: () => LocalizedString;
        /**
         * Last name it too short, it has to be at least 2 characters
         */
        tooShort: () => LocalizedString;
        /**
         * Last name is too long, it has to be at most 32 characters
         */
        tooLong: () => LocalizedString;
      };
      confirmPassword: {
        /**
         * Confirm password is required
         */
        required: () => LocalizedString;
        /**
         * Confirm password is invalid
         */
        invalid: () => LocalizedString;
        /**
         * Confirm password does not match password
         */
        mismatch: () => LocalizedString;
      };
      passwordStrength: {
        /**
         * Password is too weak
         */
        tooWeak: () => LocalizedString;
      };
    };
    association: {
      description: {
        /**
         * Association description is required
         */
        required: () => LocalizedString;
        /**
         * Association description is invalid
         */
        invalid: () => LocalizedString;
        /**
         * Association description is too long, it has to be at most 32
         * characters
         */
        tooLong: () => LocalizedString;
      };
      objects: {
        /**
         * Associacion objects must differ
         */
        mustDiffer: () => LocalizedString;
      };
    };
    attribute: {
      name: {
        /**
         * Attribute name is required
         */
        required: () => LocalizedString;
        /**
         * Attribute name is invalid
         */
        invalid: () => LocalizedString;
        /**
         * Attribute name is too long, it has to be at most 32 characters
         */
        tooLong: () => LocalizedString;
      };
      value: {
        /**
         * Attribute value is invalid
         */
        invalid: () => LocalizedString;
        /**
         * Attribute value is too long, it has to be at most 32 characters
         */
        tooLong: () => LocalizedString;
      };
    };
    objectVariants: {
      template: {
        title: {
          /**
           * Title is required
           */
          required: () => LocalizedString;
          /**
           * Title is invalid
           */
          invalid: () => LocalizedString;
          /**
           * Title is too long, it has to be at most 32 characters
           */
          tooLong: () => LocalizedString;
        };
        attributeName: {
          /**
           * One of attribute's name is invalid
           */
          invalid: () => LocalizedString;
          /**
           * One of attribute's name is too long, it has to be at most 32
           * characters
           */
          tooLong: () => LocalizedString;
        };
      };
      type: {
        title: {
          /**
           * Title is required
           */
          required: () => LocalizedString;
          /**
           * Title is invalid
           */
          invalid: () => LocalizedString;
          /**
           * Title is too long, it has to be at most 32 characters
           */
          tooLong: () => LocalizedString;
        };
        color: {
          /**
           * Color is required
           */
          required: () => LocalizedString;
          /**
           * Color is invalid
           */
          invalid: () => LocalizedString;
        };
      };
      object: {
        name: {
          /**
           * Name is required
           */
          required: () => LocalizedString;
          /**
           * Name is invalid
           */
          invalid: () => LocalizedString;
          /**
           * Name is too long, it has to be at most 32 characters
           */
          tooLong: () => LocalizedString;
        };
      };
    };
    event: {
      deltaTime: {
        /**
         * Event happening time is required
         */
        required: () => LocalizedString;
        /**
         * Event happening time is ivalid
         */
        invalid: () => LocalizedString;
        /**
         * Event happening time must be positive
         */
        positive: () => LocalizedString;
      };
      title: {
        /**
         * Title is required
         */
        required: () => LocalizedString;
        /**
         * Title is invalid
         */
        invalid: () => LocalizedString;
        /**
         * Title is too long, it has to be at most 32 characters
         */
        tooLong: () => LocalizedString;
      };
      description: {
        /**
         * Description is invalid
         */
        invalid: () => LocalizedString;
        /**
         * Description is too long, ut has to be at most 256 characters
         */
        tooLong: () => LocalizedString;
      };
    };
    observer: {
      name: {
        /**
         * Name is required
         */
        required: () => LocalizedString;
        /**
         * Name is invalid
         */
        invalid: () => LocalizedString;
        /**
         * Name is too long, it has to be at most 32 characters
         */
        tooLong: () => LocalizedString;
      };
    };
    entity: {
      title: {
        /**
         * Title is required
         */
        required: () => LocalizedString;
        /**
         * Title is invalid
         */
        invalid: () => LocalizedString;
        /**
         * Title is too long, it has to be at most 32 characters
         */
        tooLong: () => LocalizedString;
      };
      description: {
        /**
         * Description is invalid
         */
        invalid: () => LocalizedString;
        /**
         * Description is too long, ut has to be at most 32 characters
         */
        tooLong: () => LocalizedString;
      };
      startTime: {
        /**
         * Starting time is required
         */
        required: () => LocalizedString;
        /**
         * Starting time is invalid
         */
        invalid: () => LocalizedString;
      };
      endTime: {
        /**
         * Starting time is required
         */
        required: () => LocalizedString;
        /**
         * Starting time is invalid
         */
        invalid: () => LocalizedString;
      };
      /**
       * Starting time, cannot happen after ending time
       */
      startGraterThanEnd: () => LocalizedString;
    };
    scenario: {
      scenarioInformation: {
        name: {
          /**
           * Name is required
           */
          required: () => LocalizedString;
          /**
           * Name is invalid
           */
          invalid: () => LocalizedString;
          /**
           * Name is too long, it has to be at most 32 characters
           */
          tooLong: () => LocalizedString;
        };
        description: {
          /**
           * Description is invalid
           */
          invalid: () => LocalizedString;
          /**
           * Description is too long, ut has to be at most 256 characters
           */
          tooLong: () => LocalizedString;
        };
        context: {
          /**
           * Context is invalid
           */
          invalid: () => LocalizedString;
          /**
           * Context is too long, ut has to be at most 64 characters
           */
          tooLong: () => LocalizedString;
        };
      };
    };
  };
  forms: {
    /**
     * Submit
     */
    submit: () => LocalizedString;
    /**
     * Submitting
     */
    submitLoading: () => LocalizedString;
    components: {};
    errors: {
      /**
       * Oops! Something went wrong.
       */
      oops: () => LocalizedString;
      /**
       * Bad Request
       */
      badRequest: () => LocalizedString;
      /**
       * Unauthorized
       */
      unauthorized: () => LocalizedString;
      /**
       * Forbidden
       */
      forbidden: () => LocalizedString;
      /**
       * Page Not Found
       */
      notFound: () => LocalizedString;
      /**
       * Method Not Allowed
       */
      methodNotAllowed: () => LocalizedString;
      /**
       * Request Timeout
       */
      requestTimeout: () => LocalizedString;
      /**
       * Server Error
       */
      serverError: () => LocalizedString;
      /**
       * Not Implemented
       */
      notImplemented: () => LocalizedString;
      /**
       * Bad Gateway
       */
      badGateway: () => LocalizedString;
      /**
       * Service Unavailable
       */
      serviceUnavailable: () => LocalizedString;
      /**
       * Gateway Timeout
       */
      gatewayTimeout: () => LocalizedString;
      /**
       * Unknown Error
       */
      unknown: () => LocalizedString;
      /**
       * Back to Home Page
       */
      backToHome: () => LocalizedString;
    };
  };
};

export type Formatters = {};
