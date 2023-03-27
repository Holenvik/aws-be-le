import { ddbDocumentClient } from "@libs/ddbDocumnentClient";
import { middyfy } from "@libs/lambda";
import { v4 as uuid } from "uuid";

import { SQSEvent } from "aws-lambda";
import { Product } from "src/model/product";

const catalogBatchProcess = async (event: SQSEvent) => {
  console.log("[catalogBatchProcess] event: ", event);
  try {
    for (const record of event.Records) {
      const i = event.Records.indexOf(record);
      console.info(`catalogBatchProcess record ${i}: `, record);

      const product: Product = JSON.parse(record.body);

      const id = uuid();

      const item = {
        id,
        ...product,
      };

      const productResponse = await ddbDocumentClient
        .put({
          Item: item,
          TableName: process.env.TABLE_NAME_PRODUCTS,
        })
        .promise();

      const stockResponse = await ddbDocumentClient
        .put({
          Item: {
            product_id: id,
            count: product.count,
          },
          TableName: process.env.TABLE_NAME_STOCKS,
        })
        .promise();

      if (productResponse && stockResponse) {
        console.log("SNS Notification: " + record);
      }
    }
  } catch (error) {
    console.error(`[catalogBatchProcess] error: `, error);
  }
};

export const main = middyfy(catalogBatchProcess);
