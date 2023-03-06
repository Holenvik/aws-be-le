import { main as getProductsById } from "./handler";
import cars from "../../mocks/cars.json";

jest.mock("@libs/lambda", () => {
  return {
    middyfy: (e) => e,
  };
});

describe("getProductItem", () => {
  it("should return product by Id", async () => {
    const expected = {
      body: JSON.stringify({ car: cars[0] }),
      statusCode: 200,
    };

    const actual = await getProductsById(
      {
        pathParameters: {
          id: "1",
        },
      } as any,
      {} as any
    );

    expect(actual).toEqual(expect.objectContaining(expected));
  });

  it("should return 404 status code", async () => {
    const expected = {
      statusCode: 404,
    };
    const actual = await getProductsById(
      {
        pathParameters: {
          id: "756",
        },
      } as any,
      {} as any,
      {} as any
    );

    expect(actual).toEqual(expect.objectContaining(expected));
  });
});
