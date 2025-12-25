import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import Keycloak from 'keycloak-js';
import { keycloakConfig, keycloakInitOptions } from '../config/keycloak.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private keycloak: Keycloak;
  
  readonly isAuthenticated = signal(false);
  readonly userProfile = signal<Keycloak.KeycloakProfile | null>(null);
  readonly userName = signal<string>('');

  constructor() {
    this.keycloak = new Keycloak(keycloakConfig);
  }

  async init(): Promise<boolean> {
    try {
      const authenticated = await this.keycloak.init(keycloakInitOptions);
      
      this.isAuthenticated.set(authenticated);
      
      if (authenticated) {
        await this.loadUserProfile();
        this.setupTokenRefresh();

        // Redirect to intended page after callback
        if (window.location.pathname === '/callback') {
          const redirectUrl = sessionStorage.getItem('redirectUrl') || '/people';
          sessionStorage.removeItem('redirectUrl');
          this.router.navigate([redirectUrl]);
        }
      }
      
      return authenticated;
    } catch (error) {
      console.error('Keycloak initialization failed', error);
      return false;
    }
  }

  login(redirectUrl?: string): void {
    if (redirectUrl) {
      sessionStorage.setItem('redirectUrl', redirectUrl);
    }

    this.keycloak.login({
      redirectUri: `${window.location.origin}/callback`
    });
  }

  logout(): void {
    this.keycloak.logout({
      redirectUri: window.location.origin
    });
    this.isAuthenticated.set(false);
    this.userProfile.set(null);
    this.userName.set('');
  }

  getToken(): string | undefined {
    return this.keycloak.token;
  }

  isTokenExpired(): boolean {
    return this.keycloak.isTokenExpired();
  }

  async updateToken(minValidity = 5): Promise<boolean> {
    try {
      const refreshed = await this.keycloak.updateToken(minValidity);
      return refreshed;
    } catch (error) {
      console.error('Failed to refresh token', error);
      this.logout();
      return false;
    }
  }

  private async loadUserProfile(): Promise<void> {
    try {
      const profile = await this.keycloak.loadUserProfile();
      this.userProfile.set(profile);
      this.userName.set(profile.username || profile.email || 'User');
    } catch (error) {
      console.error('Failed to load user profile', error);
    }
  }

  private setupTokenRefresh(): void {
    // Refresh token every 60 seconds if it expires in less than 70 seconds
    setInterval(() => {
      this.updateToken(70).catch(() => {
        console.error('Token refresh failed');
      });
    }, 60000);
  }

  getRoles(): string[] {
    return this.keycloak.realmAccess?.roles || [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }
}