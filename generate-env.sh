#!/bin/sh
# Generate env.js from environment variables

cat > /usr/src/app/dist/people-app/browser/env.js <<EOF
window.__env = window.__env || {};
window.__env.KEYCLOAK_URL = '${KEYCLOAK_URL:-http://keycloak:8080/auth}';
window.__env.KEYCLOAK_REALM = '${KEYCLOAK_REALM:-people-realm}';
window.__env.KEYCLOAK_CLIENT_ID = '${KEYCLOAK_CLIENT_ID:-people-frontend}';
EOF

echo "Environment configuration generated:"
cat /usr/src/app/dist/people-app/browser/env.js
