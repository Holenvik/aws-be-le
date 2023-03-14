import AWS from "aws-sdk";

const ddbDocumentClient = new AWS.DynamoDB.DocumentClient();

export { ddbDocumentClient };
