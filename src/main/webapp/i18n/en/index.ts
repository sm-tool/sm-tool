import type { BaseTranslation } from '../i18n-types.js';

const en = {
  todo: 'te we dodaj tu coś => {chodzi_o:string}',
  dtoErrors: {
    user: {
      email: {
        required: 'Email is required',
        invalid: 'Email is invalid',
      },
      password: {
        required: 'Password is required',
        tooShort: 'Password is too short, it has to be at least 2 characters',
        tooLong: 'Password is too long, it has to be at most 32 characters',
        invalid: 'Password is invalid',
      },
      firstName: {
        required: 'First name is required',
        invalid: 'First name is invalid',
        tooShort: 'First name is too short, it has to be at least 2 characters',
        tooLong: 'First name is too long, it has to be at most 32 characters',
      },
      lastName: {
        required: 'Last name is required',
        invalid: 'Last name is invalid',
        tooShort:
          'Last name it too short, it has to be at least 2' + ' characters',
        tooLong: 'Last name is too long, it has to be at most 32 characters',
      },
      confirmPassword: {
        required: 'Confirm password is required',
        invalid: 'Confirm password is invalid',
        mismatch: 'Confirm password does not match password',
      },
      passwordStrength: {
        tooWeak: 'Password is too weak',
      },
    },
    association: {
      description: {
        required: 'Association description is required',
        invalid: 'Association description is invalid',
        tooLong:
          'Association description is too long, it has to be at most 32 characters',
      },
      objects: {
        mustDiffer: 'Associacion objects must differ',
      },
    },
    attribute: {
      name: {
        required: 'Attribute name is required',
        invalid: 'Attribute name is invalid',
        tooLong:
          'Attribute name is too long, it has to be at most 32 characters',
      },
      value: {
        invalid: 'Attribute value is invalid',
        tooLong:
          'Attribute value is too long, it has to be at most 32 characters',
      },
    },
    objectVariants: {
      template: {
        title: {
          required: 'Title is required',
          invalid: 'Title is invalid',
          tooLong: 'Title is too long, it has to be at most 32 characters',
        },
        attributeName: {
          invalid: "One of attribute's name is invalid",
          tooLong:
            "One of attribute's name is too long, it has to be at most 32" +
            ' characters',
        },
      },
      type: {
        title: {
          required: 'Title is required',
          invalid: 'Title is invalid',
          tooLong: 'Title is too long, it has to be at most 32 characters',
        },
        color: {
          required: 'Color is required',
          invalid: 'Color is invalid',
        },
      },
      object: {
        name: {
          required: 'Name is required',
          invalid: 'Name is invalid',
          tooLong: 'Name is too long, it has to be at most 32 characters',
        },
      },
    },
    event: {
      deltaTime: {
        required: 'Event happening time is required',
        invalid: 'Event happening time is ivalid',
        positive: 'Event happening time must be positive',
      },
      title: {
        required: 'Title is required',
        invalid: 'Title is invalid',
        tooLong: 'Title is too long, it has to be at most 32 characters',
      },
      description: {
        invalid: 'Description is invalid',
        tooLong: 'Description is too long, ut has to be at most 256 characters',
      },
    },
    observer: {
      name: {
        required: 'Name is required',
        invalid: 'Name is invalid',
        tooLong: 'Name is too long, it has to be at most 32 characters',
      },
    },
    entity: {
      title: {
        required: 'Title is required',
        invalid: 'Title is invalid',
        tooLong: 'Title is too long, it has to be at most 32 characters',
      },
      description: {
        invalid: 'Description is invalid',
        tooLong: 'Description is too long, ut has to be at most 32 characters',
      },
      startTime: {
        required: 'Starting time is required',
        invalid: 'Starting time is invalid',
      },
      endTime: {
        required: 'Starting time is required',
        invalid: 'Starting time is invalid',
      },
      startGraterThanEnd: 'Starting time, cannot happen after ending time',
    },
    scenario: {
      scenarioInformation: {
        name: {
          required: 'Name is required',
          invalid: 'Name is invalid',
          tooLong: 'Name is too long, it has to be at most 32 characters',
        },
        description: {
          invalid: 'Description is invalid',
          tooLong:
            'Description is too long, ut has to be at most 256 characters',
        },
        context: {
          invalid: 'Context is invalid',
          tooLong: 'Context is too long, ut has to be at most 64 characters',
        },
      },
    },
  },
  forms: {
    submit: 'Submit',
    submitLoading: 'Submitting',
    components: {},
    errors: {
      oops: 'Oops! Something went wrong.',
      badRequest: 'Bad Request',
      unauthorized: 'Unauthorized',
      forbidden: 'Forbidden',
      notFound: 'Page Not Found',
      methodNotAllowed: 'Method Not Allowed',
      requestTimeout: 'Request Timeout',
      serverError: 'Server Error',
      notImplemented: 'Not Implemented',
      badGateway: 'Bad Gateway',
      serviceUnavailable: 'Service Unavailable',
      gatewayTimeout: 'Gateway Timeout',
      unknown: 'Unknown Error',
      backToHome: 'Back to Home Page',
    },
  },
} satisfies BaseTranslation;

export default en;
