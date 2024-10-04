import { useI18nContext } from '@/i18n/i18n-react';
import { z } from 'zod';

export const createScenarioInformation = () => {
  const { LL } = useI18nContext();

  return z.object({
    name: z
      .string({
        required_error:
          LL.dtoErrors.scenario.scenarioInformation.name.required(),
        invalid_type_error:
          LL.dtoErrors.scenario.scenarioInformation.name.invalid(),
      })
      .max(32, LL.dtoErrors.scenario.scenarioInformation.name.tooLong()),
    description: z
      .string({
        invalid_type_error:
          LL.dtoErrors.scenario.scenarioInformation.description.invalid(),
      })
      .max(
        256,
        LL.dtoErrors.scenario.scenarioInformation.description.tooLong(),
      ),
    context: z
      .string({
        invalid_type_error:
          LL.dtoErrors.scenario.scenarioInformation.description.invalid(),
      })
      .max(64, LL.dtoErrors.scenario.scenarioInformation.description.tooLong()),
  });
};
