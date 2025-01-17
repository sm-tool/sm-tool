import { isAxiosError } from 'axios';
import { apiError, ApiError } from '@/lib/api/types/errors/error.types.ts';
import {
  errorCodes,
  errorGroups,
} from '@/lib/api/types/errors/error.constants.ts';

export const parseApiError = (error: unknown): ApiError | undefined => {
  if (!isAxiosError(error)) return;

  const result = apiError.safeParse(error.response?.data);
  if (!result.success) return;

  return result.data;
};

type ErrorCode = (typeof errorCodes)[number];
type ErrorGroup = (typeof errorGroups)[number];
type ErrorMessageFunction = (values?: string[], group?: ErrorGroup) => string;

export const getApiErrorMessage = (error: ApiError): string => {
  const groupName = getErrorGroupLabel(error.errorGroup);

  const errorMessages: Record<ErrorCode, ErrorMessageFunction> = {
    ELEMENT_IN_USE: () =>
      `${groupName} is currently in use and cannot be deleted`,
    EVENT_NOT_MODIFIABLE: () => 'This event cannot be modified',
    THREAD_ALREADY_BRANCHED: () => 'This thread has already been branched',
    TRIED_TO_CREATE_OBJECT_ON_THREAD_WITHOUT_START_EVENT: () =>
      'Cannot create object in thread without a START event',
    WRONG_VALUE_FORMAT: () => `Invalid ${groupName} format`,
    DUPLICATED_OBJECTS_IN_TRANSFER: () =>
      'Duplicate objects detected in transfer',
    NOT_ALL_OBJECTS_WERE_TRANSFERRED: () =>
      'Not all objects were successfully transferred',
    TRIED_TO_ADD_GLOBAL_TYPE_TO_NOT_GLOBAL_OBJECT: () =>
      'Cannot add global type to a non-global object',
    INCOMPATIBLE_TYPES: () => 'The types are incompatible',
    EXIST_CHILD_OBJECT_TYPE: () => 'Child object type exists',
    CANNOT_DELETE_BASIC_OBJECT_TYPE: () => 'Cannot delete basic object type',
    WRONG_ASSOCIATIONS: () => 'Invalid associations',
    PHASE_OVERLAP: () => 'Phase overlap detected',
    DOES_NOT_EXIST: () => `${groupName} does not exist`,
    NULL_VALUE: () => `${groupName} value cannot be null`,
    MANY_OBJECT_CHANGES_AT_THE_SAME_TIME: () =>
      'Multiple object changes detected at the same time',
    CANNOT_USE_OBJECTS_IN_THREAD: () => 'Objects cannot be used in this thread',
    CANNOT_USE_ATTRIBUTES_IN_THREAD: () =>
      'Attributes cannot be used in this thread',
    MULTIPLE_SAME_ASSOCIATION_CHANGE_DEFINITIONS: () =>
      'Multiple definitions of the same association change detected',
    CANNOT_ADD_SUCH_OBJECT_IN_SCENARIO: () =>
      'This type of object cannot be added in this scenario',
    WRONG_HIERARCHY: () => 'Invalid hierarchy structure',
    END_BEFORE_START: () => 'End time cannot be before start time',
    OBJECT_CANNOT_BE_USER: () => 'Object cannot be assigned as a user',
    CONFLICT_BETWEEN_SCENARIOS_IN_HEADER_AND_ENTITY: () =>
      'Conflict detected between scenarios in header and entity',
    NO_SCENARIO_ID_IN_HEADER: () => 'No scenario ID found in header',
    LACK_OF_PERMISSIONS: () => 'Insufficient permissions',
    WRONG_BRANCHING_TYPE: () => 'Invalid branching type',
    TOO_LITTLE_THREADS: () => 'Insufficient number of threads',
    NEGATIVE_TIME: () => 'Time value cannot be negative',
    CANNOT_DELETE_OR_ADD_CHANGE_TO_START_EVENT: () =>
      'Cannot delete or add changes in the start event',
    CANNOT_MOVE_EVENTS: () => 'Events cannot be moved',
    EXIST_EVENT_IN_TIME: () => 'An event already exists at this time',
    DUPLICATED_THREAD_IDS: () => 'Duplicate thread IDs detected',
    CANNOT_INSERT_JOIN: () => 'Cannot insert join at this position',
    CANNOT_CREATE_ASSOCIATION_BETWEEN_GLOBAL_OBJECTS_IN_NOT_GLOBAL_THREAD: () =>
      'Cannot create association between global objects in a non-global thread',
    TRIED_TO_BRANCH_GLOBAL_THREAD: () => 'Cannot branch a global thread',
  };

  return errorMessages[error.errorCode](error.values, error.errorGroup);
};

export const getErrorGroupLabel = (group: ErrorGroup): string => {
  const groupLabels: Record<ErrorGroup, string> = {
    OBJECT_TRANSFER: 'object transfer',
    ASSOCIATION: 'association',
    ASSOCIATION_CHANGE: 'association change',
    ASSOCIATION_TYPE: 'association type',
    ATTRIBUTE: 'attribute',
    ATTRIBUTE_CHANGE: 'attribute change',
    ATTRIBUTE_TEMPLATE: 'attribute template',
    BRANCHING: 'branching',
    CONFIGURATION: 'configuration',
    EVENT: 'event',
    OBJECT: 'object',
    OBJECT_TEMPLATE: 'object template',
    OBJECT_TYPE: 'object type',
    PERMISSION: 'permission',
    SCENARIO: 'scenario',
    SCENARIO_PHASE: 'scenario phase',
    SCENARIO_TO_OBJECT_TEMPLATE: 'scenario to object template',
    SCENARIO_TO_OBJECT_TYPE: 'scenario to object type',
    THREAD: 'thread',
    THREAD_TO_OBJECT: 'thread to object',
    USER: 'user',
    USER_TO_OBJECT: 'user to object',
    SERVER: 'error code on a server (unknown error)',
  };

  return groupLabels[group];
};
