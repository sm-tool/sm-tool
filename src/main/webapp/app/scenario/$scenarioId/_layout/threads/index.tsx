import '@xyflow/react/dist/style.css';
import { createFileRoute } from '@tanstack/react-router';
import { routeWithAuth } from '@/lib/routing/route-decorator.ts';
import ScenarioFlow from '@/lib/react-flow';

export const Route = createFileRoute('/scenario/$scenarioId/_layout/threads/')({
  component: ScenarioFlow,
  ...routeWithAuth(),
});
