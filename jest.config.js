module.exports = {
  testEnvironment: "node",
};

process.env = Object.assign(process.env, {
  ENVIRONMENT: "local",
  REGION: "us-east-1",
  AP_QUEUE_URL:
    "http://host.docker.internal:4566/000000000000/harkenorc-local-ApQueue-045ae387",
});
