import AWS from "aws-sdk";

AWS.config.update({ region: "us-east-1" });

const ddb = new AWS.DynamoDB();

export { ddb };
