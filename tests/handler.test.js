const AWSMock = require("aws-sdk-mock");
const AWS = require("aws-sdk");
const { orderCallback } = require("../handler");

beforeEach(() => {
  process.env.AP_QUEUE_URL =
    "http://localhost:4566/000000000000/localstack-demo-local-ApQueue-41f25d45";
});

afterEach(() => {
  AWSMock.restore("SQS");
});

test("should successfully send message to SQS", async () => {
  AWSMock.mock("SQS", "sendMessage", (params, callback) => {
    callback(null, { MessageId: "12345" });
  });

  const event = {
    body: JSON.stringify({
      eventType: "ORDER_CALLBACK",
      data: { name: "John Doe", message: "Hello World" },
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

// test("should fail when event type is missing", async () => {
//   const event = {
//     body: JSON.stringify({
//       data: { name: "John Doe", message: "Hello World" },
//     }),
//   };

//   const result = await orderCallback(event);

//   expect(result.statusCode).toBe(500);
//   expect(result.body).toBe(
//     JSON.stringify({
//       message: "Failed sending message to SQS.",
//       error: "Event type is missing from the payload.",
//     })
//   );
// });

// test("should fail when event type does not correspond to queue URL", async () => {
//   const event = {
//     body: JSON.stringify({
//       eventType: "INVALID_EVENT_TYPE",
//       data: { name: "John Doe", message: "Hello World" },
//     }),
//   };

//   const result = await orderCallback(event);

//   expect(result.statusCode).toBe(500);
//   expect(result.body).toBe(
//     JSON.stringify({
//       message: "Failed sending message to SQS.",
//       error: "Event type does not correspond to queue URL.",
//     })
//   );
// });
