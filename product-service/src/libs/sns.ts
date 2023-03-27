import { PublishCommand } from "@aws-sdk/client-sns";
import { snsClient } from "@libs/snsClient.js";

export const sendSNSNotification = async (msg): Promise<void> => {
  try {
    console.log("[sendSNSNotification] msg: ", msg);
    console.log("[sendSNSNotification] msg: ", JSON.parse(msg.body).price);
    const snsPublishData = await snsClient.send(
      new PublishCommand({
        Subject: "Product added to DB",
        Message: JSON.stringify(`
              MessageId: ${msg.messageId},
              Body: ${msg.body}
            `),
        TopicArn: process.env.SNS_ARN,
        MessageAttributes: {
          price: {
            DataType: "Number",
            StringValue: JSON.parse(msg.body).price,
          },
        },
      })
    );
    console.log("snsService Success: ", snsPublishData);
  } catch (error) {
    console.error("snsService Error: ", error);
  }
};
