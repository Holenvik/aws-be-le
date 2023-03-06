import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import cars from "../../mocks/cars.json";

const getProductList = async () => {
  try {
    return formatJSONResponse({
      cars,
    });
  } catch (e) {
    return formatJSONResponse({}, 500);
  }
};

export const main = middyfy(getProductList);
