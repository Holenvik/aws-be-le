import { formatJSONResponse } from "@libs/api-gateway";
import { middyfy } from "@libs/lambda";
import cars from "../../mocks/cars.json";

const getProductList = async (event) => {
  try {
    const { id } = event.pathParameters;
    const car = id ? cars.find((catoToFind) => catoToFind.id === id) : null;

    return formatJSONResponse(
      {
        car,
      },
      car ? 200 : 404
    );
  } catch (e) {
    return formatJSONResponse({}, 500);
  }
};

export const main = middyfy(getProductList);
