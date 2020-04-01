import 'source-map-support/register'

import * as uuid from 'uuid';

import * as AWS  from 'aws-sdk'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const s3Bucket = process.env.S3_BUCKET
const objectExpiration = process.env.SIGNED_URL_EXPIRATION
const todosTable = process.env.TODOS_TABLE

const dbClient: AWS.DynamoDB.DocumentClient = XAWS.DynamoDB.DocumentClient()

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const imageId = uuid.v4();
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id

  const imagePath = `https://${s3Bucket}.s3.amazonaws.com/${imageId}`
  // generate sign url
  const signUrl = s3.getSignedUrl('putObject',{
    Bucket: s3Bucket,
    Key: imageId,
    Expires: objectExpiration
  })

  await dbClient.update({
    TableName: todosTable,
    Key: { "todoId": todoId },
    UpdateExpression: "set attachmentUrl = :url",
    ExpressionAttributeValues:{
      ":url": imagePath
    },
    ReturnValues:"UPDATED_NEW"
  }).promise()

  return {
    statusCode: 201,
    headers: {
        'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
        todoId: todoId,
        iamgeUrl: imagePath,
        uploadUrl: signUrl
    })
  }
}
