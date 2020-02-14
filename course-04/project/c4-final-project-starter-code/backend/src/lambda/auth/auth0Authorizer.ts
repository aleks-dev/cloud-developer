import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

//import { jwt, verify, decode } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger'
import { JwtToken } from '../../auth/JwtToken'
import { verify } from 'jsonwebtoken'
//import expressJwtSecret from '../../auth/expressJwtSecret'

//const jwt = require('jsonwebtoken')
const logger = createLogger('auth')

// ISDONE: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
//const jwksUrl = 'https://aleks-dev.eu.auth0.com/.well-known/jwks.json'

const cert = `-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----`

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  
  logger.info('Authorizing a user' + event.authorizationToken)
  
  try {
    const decodedToken = verifyToken(event.authorizationToken)
    //const jwtToken = await verifyToken(event.authorizationToken)
    logger.info('User was authorized' + JSON.stringify(decodedToken))

    return {
      //principalId: jwtToken.sub,
      principalId: decodedToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (err) {
    logger.error('User not authorized', { error: err.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}


function verifyToken(authHeader: string): JwtToken {
  if (!authHeader)
  {
      logger.error('No authentication header')
      throw new Error('No authentication header')
  }

  if (!authHeader.toLowerCase().startsWith('bearer '))
  {
      logger.error('Invalid authentication header')
      throw new Error('Invalid authentication header')
  }

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}