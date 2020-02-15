import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { createLogger } from '../../utils/logger'
import { JwtToken } from '../../auth/JwtToken'
import { verify } from 'jsonwebtoken'

const logger = createLogger('auth')

// ISDONE: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
//const jwksUrl = 'https://aleks-dev.eu.auth0.com/.well-known/jwks.json'

const cert = `-----BEGIN CERTIFICATE-----
MIIDBzCCAe+gAwIBAgIJQAqhEHIRuUU/MA0GCSqGSIb3DQEBCwUAMCExHzAdBgNV
BAMTFmFsZWtzLWRldi5ldS5hdXRoMC5jb20wHhcNMjAwMTI4MTA1MzMwWhcNMzMx
MDA2MTA1MzMwWjAhMR8wHQYDVQQDExZhbGVrcy1kZXYuZXUuYXV0aDAuY29tMIIB
IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAuTHGOuvQoTpHgR53keXmYxAv
LgjTeky9ESztksdY3PjtpCVctVqsZDnQQcVo92RORlXy0SsJX+PW5BAL8oMuujmD
tBWQD2gbZ11UoIjGzGw2uRq92GmStqlX33SVHcxKb1pJ86QY4ZsTE/QgLo73z8U6
kGM/61HQ+gUuukC53xkTvasZBnmhJpqxdhA7J2boPU1miGmeZM/yN5ejrWY5U/fE
74IGciy+7A4hrrl0I8CJ6D4a/ipHmeNE5C731EaDrOdo4dWd9E50mo4HGvckxAVj
ASdGHvvl9GaO4gNGvdewpor6SzqO8D1STTYTdHiRWD9JTb7SvzST8J9H/F9YAwID
AQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSEc2jSjvjl6d1lHojm
7eZIWrwahTAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAB2cuX85
opgh3y0rydRsHVu78D31DIiNRI6AnE8T5BncFeBLb7ZIss6yc16mDUchKq06R51i
pUZI/L1hUZXrDwj7wYpNXEmyrwX7ZqcwJybXrlLAhgW/+c1ogSXiNr995xza2uHv
bq1BV4BmTC+8RwQL7qI+ItoZOUFP9j0rO1SuN/y6y5qwvIdgY4TUgbzsbfSbEK9j
o39eS4pXCRcWz7u94EyPtP43KdiXFjfZV5FL1jUNRLS0euKiyjIWu4x21CIbCN1F
aqqeJiqOYa7+22B9isnP31e6YIo0RMlBYwbKfMEV8wYR2T0gmCuYD3i1jcQT8v4N
b5ZmMkATAE6KsJ0=
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