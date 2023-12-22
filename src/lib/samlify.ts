import { readFileSync } from 'node:fs';
import { IdentityProvider, ServiceProvider, setSchemaValidator } from 'samlify';
import { env } from '@/env';
import 'server-only';

setSchemaValidator({
  validate: (_response: string) => {
    /* implement your own or always returns a resolved promise to skip */
    return Promise.resolve('skipped');
  },
});

export const sp = ServiceProvider({
  entityID: env.NEXT_PUBLIC_SITE_URL,
  nameIDFormat: ['urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress'],
  privateKey: env.SAML_ENABLED ? readFileSync(env.SAML_SP_PRIVATE_KEY_PATH) : '',
  privateKeyPass: env.SAML_SP_PRIVATE_KEY_PASS,
  signingCert: env.SAML_ENABLED ? readFileSync(env.SAML_SP_CERT_PATH) : '',
  encPrivateKey: env.SAML_ENABLED ? readFileSync(env.SAML_SP_PRIVATE_KEY_PATH) : '',
  encPrivateKeyPass: env.SAML_SP_PRIVATE_KEY_PASS,
  encryptCert: env.SAML_ENABLED ? readFileSync(env.SAML_SP_CERT_PATH) : '',
  authnRequestsSigned: true,
  wantAssertionsSigned: true,
  wantMessageSigned: true,
  wantLogoutRequestSigned: true,
  wantLogoutResponseSigned: true,
  isAssertionEncrypted: true,
  requestSignatureAlgorithm: 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256',
  assertionConsumerService: [
    {
      // isDefault: true,
      Location: `${env.NEXT_PUBLIC_SITE_URL}/api/auth/saml2/acs`,
      Binding: 'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST',
    },
  ],
  signatureConfig: {
    prefix: 'ds',
    location: {
      reference: '/samlp:Response/saml:Issuer',
      action: 'after',
    },
  },
});

export const idp = IdentityProvider({
  metadata: env.SAML_ENABLED ? readFileSync(env.SAML_IDP_METADATA_PATH) : '<xml></xml>',
});
