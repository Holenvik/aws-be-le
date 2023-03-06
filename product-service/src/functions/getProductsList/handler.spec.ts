import { Context } from "aws-lambda";
import { main as getProductsList } from "./handler";
import cars from "../../mocks/cars.json";

jest.mock("@libs/lambda", () => {
  return {
    middyfy: (e) => e,
  };
});

describe("getProductList", () => {
  it("verifies successful response", async () => {
    const result = await getProductsList(null, {} as Context);

    expect(result.statusCode).toEqual(200);
    expect(result.body).toEqual(JSON.stringify({ cars }));
  });
});
