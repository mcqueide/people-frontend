import type { KeycloakConfig } from 'keycloak-js';
import { environment } from '../../environments/environment';

export const keycloakConfig: KeycloakConfig = {
  url: environment.keycloak.url,
  realm: environment.keycloak.realm,
  clientId: environment.keycloak.clientId
};

export const keycloakInitOptions = {
  onLoad: 'login-required' as const, // Change to 'check-sso' if you want to use silent SSO check.
  // silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
  checkLoginIframe: false,
  pkceMethod: 'S256' as const, // Disabled: Requires HTTPS or localhost (Web Crypto API)
  redirectUri: `${window.location.origin}/callback`
};