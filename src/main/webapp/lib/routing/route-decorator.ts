import { redirect } from '@tanstack/react-router';
import { IAuthService } from '@/lib/auth/types.ts';
import { core } from '@/lib/core.tsx';

export const routeWithAuth = () => ({
  beforeLoad: async ({ location }: { location: { pathname: string } }) => {
    const authService: IAuthService = core.authClient;
    if (globalThis.location.hash.includes('session_state')) {
      return;
    }
    try {
      if (!(await authService.refreshAndAuthenticate())) {
        await authService.login(location.pathname);
      }
    } catch {
      throw redirect({ to: '/errors/403' });
    }
  },
});
