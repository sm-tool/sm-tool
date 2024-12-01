import HomeLayout from '@/components/layout/home-layout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/home/_layout')({
  component: HomeLayout,
});
