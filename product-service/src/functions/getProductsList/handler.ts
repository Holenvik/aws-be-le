import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import { ddbDocumentClient } from "@libs/ddbDocumnentClient";
import { Product } from "src/model/product";
import { Stock } from "src/model/stock";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const getProductsData = async (): Promise<Product[]> => {
  const { Items } = await ddbDocumentClient
    .scan({
      TableName: process.env.TABLE_NAME_PRODUCTS,
    })
    .promise();

  return Items as unknown as Product[];
};

const getStockData = async (): Promise<Stock[]> => {
  const { Items } = await ddbDocumentClient
    .scan({
      TableName: process.env.TABLE_NAME_STOCKS,
    })
    .promise();

  return Items as unknown as Stock[];
};

const getProductList = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("getProductsList: ", event);

    const products = await getProductsData();
    const stocks = await getStockData();

    if (!stocks) {
      return formatJSONResponse(
        {
          message: "Stocks not found",
          event,
        },
        404
      );
    }

    if (!products) {
      return formatJSONResponse(
        {
          message: "Products not found",
          event,
        },
        404
      );
    }

    const data = products.map((product) => {
      const { count } =
        stocks.find((stock) => stock.product_id === product.id) || {};
      return { ...product, count: count || 0 };
    });

    return formatJSONResponse({ data });
  } catch (error) {
    return formatJSONResponse({ error, event }, 500);
  }
};

export const main = middyfy(getProductList);
