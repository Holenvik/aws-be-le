import type { AWS } from "@serverless/typescript";

import getProductsList from "@functions/getProductsList";
import getProductItem from "@functions/getProductItem";
import createProductItem from "@functions/createProductItem";
import catalogBatchProcess from "@functions/catalogBatchProcess";

const serverlessConfiguration: AWS = {
  service: "product",
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-offline",
    "serverless-auto-swagger",
  ],
  provider: {
    name: "aws",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      TABLE_NAME_PRODUCTS: "products",
      TABLE_NAME_STOCKS: "stocks",
      REGION: "us-east-1",
      SNS_ARN: {
        Ref: "SNSTopic",
      },
      SQS_ARN: {
        Ref: "SQSQueue",
      },
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "dynamodb:*",
        Resource: ["*"],
      },
      {
        Effect: "Allow",
        Action: ["sqs: *"],
        Resource: [{ "Fn::GetAtt": ["SQSQueue", "Arn"] }],
      },
      {
        Effect: "Allow",
        Action: ["sns: *", "sns:Publish"],
        Resource: { Ref: "SNSTopic" },
      },
    ],
  },
  resources: {
    Resources: {
      SQSQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "catalogItemsQueue",
        },
      },
      SNSTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "createProductTopic",
        },
      },
      SNSSubscriptionPriceUnder20: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "kfiadosau@corelogic.com",
          Protocol: "email",
          TopicArn: {
            Ref: "SNSTopic",
          },
          FilterPolicy: {
            price: [{ numeric: ["<", 20] }],
          },
        },
      },
      SNSSubscriptionPriceOver20: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "mandarinkajok@gmail.com",
          Protocol: "email",
          TopicArn: {
            Ref: "SNSTopic",
          },
          FilterPolicy: {
            price: [{ numeric: [">=", 20] }],
          },
        },
      },
    },
  },
  functions: {
    getProductsList,
    getProductItem,
    createProductItem,
    catalogBatchProcess,
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },

    autoswagger: {
      basePath: "/dev",
      typefiles: ["./src/model/product.ts", "./src/model/stock.ts"],
      apiType: "http",
    },
  },
};

module.exports = serverlessConfiguration;
