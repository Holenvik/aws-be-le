import {
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerResult,
  PolicyDocument,
} from "aws-lambda";
import * as process from "process";

enum Effect {
  Allow = "Allow",
  Deny = "Deny",
}

const generateResponse = (
  principalId: string,
  effect: Effect,
  resourse: string
): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: generatePolicyDocument(effect, resourse),
  };
};

const generatePolicyDocument = (
  effect: Effect,
  resourse: string
): PolicyDocument => {
  return {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "execute-api:Invoke",
        Effect: effect,
        Resource: resourse,
      },
    ],
  };
};
const basicAuthorizer = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  console.log("auth event: ", event);
  try {
    const { authorizationToken, methodArn } = event;

    const encodedCreds = authorizationToken.split(" ")[1];
    const buff = Buffer.from(encodedCreds, "base64");
    const plainCreds = buff.toString("utf-8").split(":");
    const expectedData = process.env.userData.split(":");
    const [userName, password] = plainCreds;

    const [_, expectedPassword] = expectedData;

    console.log("auth plainCreds: ", plainCreds);
    console.log("auth expectedData: ", expectedData);

    const effect =
      expectedPassword && expectedPassword === password
        ? Effect.Allow
        : Effect.Deny;

    const response = generateResponse(userName, effect, methodArn);
    console.info("auth response: ", JSON.stringify(response));
    return response;
  } catch (error) {
    console.error("auth error: ", error);
  }
};

export const main = basicAuthorizer;
