import { createFileRoute } from '@tanstack/react-router';
import CatalogLayout from '@/components/layout/catalog-layout';
import { routeWithAuth } from '@/lib/routing/route-decorator.ts';

export const Route = createFileRoute('/home/_layout/catalog/_layout')({
  component: CatalogLayout,
  ...routeWithAuth(),
});
