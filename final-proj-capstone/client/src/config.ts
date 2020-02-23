// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'awg0uolt23'
export const apiEndpoint = `https://${apiId}.execute-api.eu-west-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'aleks-dev.eu.auth0.com',              // Auth0 domain
  clientId: 'Fqfo562WEyuhqXa9jVhnyKxZAqdbufS3',  // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
