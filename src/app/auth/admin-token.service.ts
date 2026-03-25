import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AdminTokenService {

  private accessKey = 'admin_access_token';
  private refreshKey = 'admin_refresh_token';

  setAccessToken(token: string) {
    localStorage.setItem(this.accessKey, token);
  }

  setRefreshToken(token: string) {
    localStorage.setItem(this.refreshKey, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshKey);
  }

  clearTokens() {
    localStorage.removeItem(this.accessKey);
    localStorage.removeItem(this.refreshKey);
  }
}