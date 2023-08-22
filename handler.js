const AWS = require("aws-sdk");

const config = {
  region: "us-east-1",
  endpoint: "http://host.docker.internal:4566",
};

const sqs = new AWS.SQS(config);

module.exports.orderCallback = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const eventType = body.eventType;

    if (!eventType) {
      throw new Error("Event type is missing from the payload.");
    }

    const eventQueueMapping = {
      ORDER_CALLBACK: process.env.AP_QUEUE_URL,
    };

    const queueUrl = eventQueueMapping[eventType];

    if (!queueUrl) {
      throw new Error("Event type does not correspond to queue URL.");
    }

    const updateQueueUrl = queueUrl.replace(
      "localhost",
      "host.docker.internal"
    );

    const result = await sqs
      .sendMessage({
        MessageBody: JSON.stringify(body.data),
        QueueUrl: updateQueueUrl,
      })
      .promise();

    console.log("Message sent:", result.MessageId);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Success sending message to SQS.",
      }),
    };
  } catch (err) {
    console.error("Failed sending message to SQS.", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed sending message to SQS.",
        error: err.message,
      }),
    };
  }
};
