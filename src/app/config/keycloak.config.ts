import type { KeycloakConfig } from 'keycloak-js';

export const keycloakConfig: KeycloakConfig = {
  url: 'http://keycloak:8080/auth',
  realm: 'people-realm',
  clientId: 'people-frontend'
};

export const keycloakInitOptions = {
  onLoad: 'login-required' as const, // Change to 'check-sso' if you want to use silent SSO check.
  // silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
  checkLoginIframe: false,
  pkceMethod: 'S256' as const,
  redirectUri: `${window.location.origin}/callback`
};