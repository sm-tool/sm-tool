import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from '@/lib/zod-types/hiden-field.types.ts';
import { routeWithAuth } from '@/lib/routing/route-decorator.ts';

const searchParametersSchema = z.object({
  left: z
    .union([
      z.literal('description'),
      z.string().regex(/^catalogue:(types|templates|associations)(:\d+)?$/),
      z.literal('objects'),
      z.string().regex(/^objects:\d+$/),
    ])
    .default('description'),
});

export const Route = createFileRoute('/scenario/$scenarioId/')({
  validateSearch: searchParametersSchema,
  loader: ({ params }) => {
    throw redirect({
      to: `/scenario/$scenarioId/threads`,
      params: { scenarioId: params.scenarioId },
    });
  },

  ...routeWithAuth(),
});
