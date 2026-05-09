# Recipe Catalog (Mobile)

Version 0.1.0

A mobile application for browsing recipes

Currently a work in progress.

## Backend

This application requires a REST API. The repository containing the API application can be found [here](https://github.com/zglossip/food-history-api)

It also requires an `.env` file containing a `VITE_BACKEND_BASE` property. This property should be the URL to the backend.

For local dev without the backend, run the mock API with `npm run mock:api` (json-server) and keep `VITE_BACKEND_BASE=http://localhost:3001` (see `.env.development`).

## Instructions

### Simple Setup

#### Live Development

To run the application:

- Ensure you have Node 21 installed
- Run `npm ci`
- Run `npm run dev`
- Application will be hosted at `http://localhost:8081`

#### Storybook

To run Storybook:

- Follow the first two steps above
- Run `npm run storybook`
- Storybook will be hosted at `http://localhost:6006`

#### Live Tests

To run the vitest tests:

- Follow the first two steps above
- Run `npm run test:unit`

## Release History

### 0.1.0

This is the initial release of the application. This contains basic browse and create functionality. Meant as a starting point for the application
