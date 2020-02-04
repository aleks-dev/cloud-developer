
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { JwtToken } from '../../auth/JwtToken'
import { verify } from 'jsonwebtoken'

const cert = `-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
    try {
        const decodedToken = verifyToken(event.authorizationToken)

        console.log('User was authorized', decodedToken)

        return {
            principalId: decodedToken.sub,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [{
                    Action: 'execute-api:Invoke',
                    Effect: 'Allow',
                    Resource: '*'
                }]
            }
        }
    } catch (e) {
        console.log('User was not authorized', e.message)

        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }]
            }
        }
    }
}

function verifyToken(authHeader: string): JwtToken {
    if (!authHeader)
        throw new Error('No authentication header')

    if (!authHeader.toLowerCase().startsWith('bearer '))
        throw new Error('Invalid authentication header')

    const split = authHeader.split(' ')
    const token = split[1]

    return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}