import { formatJSONResponse } from "@libs/api-gateway";
import { ddbDocumentClient } from "@libs/ddbDocumnentClient";
import { middyfy } from "@libs/lambda";
import { Product } from "src/model/product";
import { Stock } from "src/model/stock";

const getProductById = async (id: string): Promise<Product> => {
  const { Items } = await ddbDocumentClient
    .query({
      TableName: process.env.TABLE_NAME_PRODUCTS,
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: { ":id": id },
    })
    .promise();
  return Items[0] as Product;
};

const getStockCountById = async (productId: string): Promise<number> => {
  const { Items } = await ddbDocumentClient
    .query({
      TableName: process.env.TABLE_NAME_STOCKS,
      KeyConditionExpression: "product_id = :product_id",
      ExpressionAttributeValues: { ":product_id": productId },
    })
    .promise();
  return (Items[0] as Stock)?.count || 0;
};

const getProductItem = async (event) => {
  try {
    console.log("getProductItem: ", event);

    const { id } = event.pathParameters;

    if (!id) {
      return formatJSONResponse(
        {
          message: "ID is required field",
          event,
        },
        400
      );
    }

    const car = await getProductById(id);
    const count = await getStockCountById(id);

    if (!car) {
      return formatJSONResponse(
        {
          message: "Product not found",
          event,
        },
        404
      );
    }

    return formatJSONResponse({
      data: {
        ...car,
        count,
      },
    });
  } catch (e) {
    return formatJSONResponse({}, 500);
  }
};

export const main = middyfy(getProductItem);
