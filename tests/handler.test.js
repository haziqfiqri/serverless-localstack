const { orderCallback } = require("../handler");

afterEach(() => {
  jest.restoreAllMocks();
});

test("should successfully send message to SQS", async () => {
  const event = {
    body: JSON.stringify({
      eventType: "ORDER_CALLBACK",
      data: { name: "John Doe", message: "Jest Unit Test" },
    }),
  };

  const result = await orderCallback(event);

  expect(result).toBeDefined();
  expect(result.statusCode).toBe(200);
  expect(result.body).toBe(
    JSON.stringify({
      message: "Success sending message to SQS.",
    })
  );
});

test("should fail when event type is missing", async () => {
  const event = {
    body: JSON.stringify({
      data: { name: "John Doe", message: "Jest Unit Test" },
    }),
  };

  const result = await orderCallback(event);

  expect(result.statusCode).toBe(500);
  expect(result.body).toBe(
    JSON.stringify({
      message: "Failed sending message to SQS.",
      error: "Event type is missing from the payload.",
    })
  );
});

test("should fail when event type does not correspond to queue URL", async () => {
  const event = {
    body: JSON.stringify({
      eventType: "INVALID_EVENT_TYPE",
      data: { name: "John Doe", message: "Jest Unit Test" },
    }),
  };

  const result = await orderCallback(event);

  expect(result.statusCode).toBe(500);
  expect(result.body).toBe(
    JSON.stringify({
      message: "Failed sending message to SQS.",
      error: "Event type does not correspond to queue URL.",
    })
  );
});
