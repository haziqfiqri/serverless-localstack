## Project Pre-Requisite

There are some pre-requisite tools needed to run this project.

- NodeJs **v18.13.0**
  For installation guide you can use this as a reference:
  https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/ (Windows/MacOs/Linux)
  If you're using nvm (node version manager) you can run below command to get the exact version.
  ```
   nvm install 18.13.0
   nvm use 18.13.0
  ```
- Docker (with **docker-compose**)
  For installation guide you can use this as a reference:  
   https://docs.docker.com/desktop/install/windows-install/ (Windows)
  https://docs.docker.com/desktop/install/mac-install/ (MacOs)

- AWS CLI (recommended **v2**)
  For installation guide you can use this as a reference:
  https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html (Windows/MacOs/Linux)
  &nbsp;

---

## Project Setup

Follow these steps of command to get it up and running on your local computer.

##### 1. Setup container and install dependencies

This command will setup localstack docker container and install node dependencies.

```
make -f sls-localstack-makefile docker-up
```

##### 2. Deploy lambda function using Serverless

This command will install serverless globally using npm and deploy using Serverless.

```
make -f sls-localstack-makefile sls-deploy-local
```

##### 3. Shut down container and remove Serverless resources

This command will shut down localstack container and remove deployed Serverless resources.

```
make -f sls-localstack-makefile docker-down
```

&nbsp;

---

## Project Testing

This section covers how you can test the deployed lambda from the previous steps.

##### 1. Test deployed lambda locally using Postman

After running `step 2` in project setup section you will be given a unique URL for the lambda deployed

**Example lambda URL:**

`http://localhost:4566/restapis/d8nih0lkvm/local/_user_request_`

**Example payload:**

```
{
    "eventType": "ORDER_CALLBACK",
    "data": {
        "name": "John Doe",
        "message": "Postman"
    }
}
```

**Example response:**

```
{
    "message": "Success sending message to SQS."
}
```

##### 2. Test deployed lambda locally using Jest

This command will run test file in `tests` folder and test it against resource created using Serverless.

```
make -f sls-localstack-makefile sls-test-local
```

**Example terminal output:**

```
 PASS  tests/handler.test.js (20.053 s)
  ✓ should successfully send message to SQS (164 ms)
  ✓ should fail when event type is missing (1 ms)
  ✓ should fail when event type does not correspond to queue URL (1 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        21.125 s, estimated 24 s
Ran all test suites.
```
