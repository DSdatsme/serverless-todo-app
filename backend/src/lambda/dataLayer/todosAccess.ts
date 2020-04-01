import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { TodoItem } from '../../models/TodoItem'
import { TodoUpdate } from "../../models/TodoUpdate";

export class TodoAccess {

    constructor(
        private readonly docClient: AWS.DynamoDB.DocumentClient = new AWSXRay.captureAWS(AWS).DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly tableIndex = process.env.IMAGE_ID_INDEX) {
    }
  
    async getAllTodos(userId): Promise<TodoItem[]> {
      const queryResult = await this.docClient.query({
        TableName : this.todosTable,
        IndexName: this.tableIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        },
        ScanIndexForward: false
      }).promise()
    
      const items = queryResult.Items
      return items as TodoItem[]
    }
  
    async createTodo(item: TodoItem): Promise<TodoItem> {
      await this.docClient.put({
        TableName: this.todosTable,
        Item: item
      }).promise()
  
      return item as TodoItem;
    }

    async deleteTodoById(todoId: string): Promise<string>{

      await this.docClient.delete({
            TableName: this.todosTable,
            Key:{
                "todoId":todoId
            }
        }).promise();

      return "deleted" as string
    }

    async updateTodo(todoId: string, updatedTodo: TodoUpdate): Promise<TodoItem> {
      
      const item = await this.docClient.update({
        TableName: this.todosTable,
        Key: { "todoId": todoId },
        UpdateExpression: "set name = :name, done = :state, dueDate = :date",
        ExpressionAttributeValues:{
          ":name": updatedTodo.name,
          ":state": updatedTodo.done,
          ":date": updatedTodo.dueDate
        },
        ReturnValues:"UPDATED_NEW"
      }).promise()
  
      return item.Attributes as TodoItem;
    }
  }
