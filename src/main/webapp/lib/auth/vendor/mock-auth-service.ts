import { AuthenticationTokenData, IAuthService } from '@/lib/auth/types.ts';

export class MockAuthService implements IAuthService {
  async initialize() {
    return await Promise.resolve(true);
  }

  async login(_redirectUri?: string) {
    return await Promise.resolve();
  }

  async logout(_redirectUri?: string) {
    return await Promise.resolve();
  }

  async register(_redirectUri?: string) {
    return await Promise.resolve();
  }

  getToken() {
    return 'test';
  }

  refreshAndAuthenticate = async () => {
    return await Promise.resolve(true);
  };

  isAuthenticated = () => true;

  getTokenData(): AuthenticationTokenData | undefined {
    return {
      clientId: '1',
      email: 'test@test.pl',
      given_name: 'to jest',
      family_name: 'test',
      roles: [],
    };
  }

  async refreshToken(): Promise<void> {
    return await Promise.resolve();
  }

  updateProfile = async () => {
    return await Promise.resolve();
  };

  updatePassword = async () => {
    return await Promise.resolve();
  };

  deleteAccount = async () => {
    return await Promise.resolve();
  };
}
