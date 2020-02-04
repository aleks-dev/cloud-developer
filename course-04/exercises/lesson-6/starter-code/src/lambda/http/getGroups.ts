//import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { getAllGroups } from '../../businessLogic/groups';
import * as express from 'express'
import * as awsServerlessExpress from 'aws-serverless-express'

const app = express()

app.get('/groups', async (_req, res) => {
  
  const groups = await getAllGroups()

  // Return a list of groups
  res.statusCode = 200

  res.setHeader('Access-Control-Allow-Origin', '*')
  
  res.json({
    items: groups
  })
})

// Create Express server
const server = awsServerlessExpress.createServer(app)

// Pass API Gateway events to the Express server
exports.handler = (event, context) => { awsServerlessExpress.proxy(server, event, context) }


//TONOTICE: OLD LAMBDA-ORIGINAL CODE, NOW REPLACED WITH SERVERJS-ADAPTED ONE.
// export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//   console.log('Processing event: ', event)

//   const groups = await getAllGroups()

//   return {
//     statusCode: 200,
//     headers: {
//       'Access-Control-Allow-Origin': '*'
//     },
//     body: JSON.stringify({
//       items: groups
//     })
//   }
// }