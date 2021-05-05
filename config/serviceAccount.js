require("dotenv").config();

const serviceAccount = {
  type: process.env.ADMIN_TYPE,
  project_id: process.env.ADMIN_PROJECT_ID,
  private_key_id: process.env.ADMIN_PRIVATE_ID_KEY,
  private_key: process.env.ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.ADMIN_CLIENT_EMAIL,
  client_id: process.env.ADMIN_CLIENT_ID,
  auth_uri: process.env.ADMIN_AUTH_URI,
  token_uri: process.env.ADMIN_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.ADMIN_auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.ADMIN_client_x509_cert_url,
};

module.exports = serviceAccount;
