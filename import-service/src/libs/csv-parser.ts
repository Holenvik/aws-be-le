import csv from "csv-parser";
import { sendSQSMessage } from "./sqs";

export const parseCsvStream = async (
  stream: NodeJS.ReadableStream
): Promise<void> => {
  const parseResult = [];
  await new Promise((resolve, reject) => {
    stream
      .pipe(csv({}))
      .on("data", async (data) => {
        parseResult.push(data);
        await sendSQSMessage(parseResult);
      })
      .on("end", () => {
        console.log("parseCsvStream onEnd: ", parseResult);
        resolve(parseResult.length);
      })
      .on("error", (error) => {
        console.log("parseCsvStream: ", error);
        reject(error);
      });
  });
};
