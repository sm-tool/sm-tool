import { z } from 'zod';
import useInterfaceStore from '@/stores/interface';

type QueryParameters<T> = {
  endpoint: string;
  schema: z.ZodType<T>;
  id?: number;
};

const genericQuery = async <T>({
  id,
  endpoint,
  schema,
}: QueryParameters<T>): Promise<T> => {
  const scenarioId = useInterfaceStore.getState().scenarioId;

  if (!scenarioId) {
    throw new Error(`Scenario has not been loaded properly`);
  }

  try {
    const headers = new Headers({
      'Content-Type': 'application/json',
      scenarioId: scenarioId.toString(),
    });

    const response = await globalThis.fetch(
      `${endpoint}${id ? `/${id}` : ''}`,
      {
        headers: headers,
        method: 'GET',
      },
    );
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.status}`);
    }
    return schema.parse(await response.json());
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new TypeError(`Data validation error: ${error.message}`);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Unknown error occurred');
  }
};

export default genericQuery;
