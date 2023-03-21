import { sqsClient } from "@libs/sqsClient.js";
import { SendMessageCommand } from "@aws-sdk/client-sqs";

export const sendSQSMessage = async (msg): Promise<void> => {
  try {
    const sendResponse = await sqsClient.send(
      new SendMessageCommand({
        QueueUrl: process.env.SQS,
        MessageBody: JSON.stringify(msg),
      })
    );
    console.log("sendSQSMessage was sent: ", sendResponse);
  } catch (error) {
    console.error("sendSQSMessage error: ", error);
  }
};
