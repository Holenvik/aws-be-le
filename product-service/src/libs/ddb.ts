import AWS from "aws-sdk";

AWS.config.update({ region: process.env.REGION });

const ddb = new AWS.DynamoDB();

export { ddb };
