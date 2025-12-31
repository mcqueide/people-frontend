declare global {
  interface Window {
    __env?: {
      KEYCLOAK_URL?: string;
      KEYCLOAK_REALM?: string;
      KEYCLOAK_CLIENT_ID?: string;
    };
  }
}

export const environment = {
  production: false,
  keycloak: {
    url: window.__env?.KEYCLOAK_URL || 'http://keycloak:8080/auth',
    realm: window.__env?.KEYCLOAK_REALM || 'people-realm',
    clientId: window.__env?.KEYCLOAK_CLIENT_ID || 'people-frontend'
  }
};
