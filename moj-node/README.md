# Digital Hub Frontend

The frontend for the Digital Hub service using Node

## Getting started

### Prerequisites

    Node >= v10.15.3

### Install dependencies

    npm install

### Running the application

Create a `.env` file using the provided template

    cp .env-template .env

The `.env` can then be configured to point to local or remote backend services as required and toggle application features

### Running tests

Mocha and Chai are used for unit and integration tests

    npm run test

Cypress is used for E2E testing

    npm run test:e2e:dev
