import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: process.env.REACT_APP_KEYCLOAK_URL || 'http://localhost:30082',
  realm: 'movie-realm',
  clientId: 'movie-app'
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
