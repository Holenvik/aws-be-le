import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from "@libs/api-gateway";
import { ddbDocumentClient } from "@libs/ddbDocumnentClient";
import { middyfy } from "@libs/lambda";
import { v4 as uuid } from "uuid";
import schema from "./schema";

const createProductItem: ValidatedEventAPIGatewayProxyEvent<
  typeof schema
> = async (event) => {
  console.log("createProductItem: ", event);

  const { ...product } = event.body;

  try {
    if (
      product.title &&
      product.description &&
      product.price &&
      product.count
    ) {
      const id = uuid() as string;

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

      return formatJSONResponse({
        data: {
          product: productResponse,
          stock: stockResponse,
        },
      });
    }

    return formatJSONResponse({ message: "Bad Request", event }, 400);
  } catch (e) {
    return formatJSONResponse({}, 500);
  }
};

export const main = middyfy(createProductItem);
