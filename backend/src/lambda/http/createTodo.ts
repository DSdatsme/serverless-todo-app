import 'source-map-support/register'

import * as AWS from 'aws-sdk'

import * as uuid from 'uuid'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'

import { getUserId } from '../utils'

const dbClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item

  const todoId = uuid.v4()
  const userId = getUserId(event);
  // structure data
  const newItem = {
    userId: userId,
    todoId: todoId,
    ...newTodo,
  }

  // insert to dyanamo
  await dbClient.put({
    TableName: todosTable,
    Item: newItem
  }).promise()
  
  return {
    statusCode: 201,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newItem
    })
  }
}
