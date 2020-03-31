import 'source-map-support/register'

import * as AWS from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { getUserId } from '../utils'

const dbClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE
const tableIndex = process.env.IMAGE_ID_INDEX

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user

  let userId = getUserId(event);
  
  // query dynamo
  const queryResult = await dbClient.query({
    TableName : todosTable,
    IndexName: tableIndex,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
        ':userId': userId
    },
    ScanIndexForward: false
  }).promise()

  const items = queryResult.Items
  
  return {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body:JSON.stringify({
      items
    })
  } 
}
