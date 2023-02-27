import type { AWS } from "@serverless/typescript";

import getProductsList from "@functions/getProductsList";
import getProductItem from "@functions/getProductItem";

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
    },
  },
  functions: { getProductsList, getProductItem },
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
      swaggerPath: "swagger",
      host: "q11j9jr031.execute-api.us-east-1.amazonaws.com/dev",
      typefiles: ["./src/model/Car.ts"],
      apiType: "http",
    },
  },
};

module.exports = serverlessConfiguration;
