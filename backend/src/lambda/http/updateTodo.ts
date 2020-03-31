import 'source-map-support/register'

import * as AWS from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'

const dbClient = new AWS.DynamoDB.DocumentClient()
const todosTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object

  let queryResult = await dbClient.update({
    TableName: todosTable,
    Key: { "todoId": todoId },
    UpdateExpression: "set name = :name, done = :state, dueDate = :date",
    ExpressionAttributeValues:{
      ":name": updatedTodo['name'],
      ":state": updatedTodo.done,
      ":date": updatedTodo.dueDate
    },
    ReturnValues:"UPDATED_NEW"
  }).promise()

  return {
    statusCode: 201,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body:JSON.stringify({
      queryResult
    })
  }
}
