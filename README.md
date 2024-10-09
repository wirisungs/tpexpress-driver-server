# TPExpress Driver Server

TPExpress Driver Server is a Node.js application for managing logistics operations, including order creation by customers and order acceptance by drivers.

## Prerequisites

- Node.js (v12.x or higher)
- npm (v6.x or higher)
- MongoDB

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/tpexpress-driver-server.git
   cd tpexpress-driver-server
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory and add your MongoDB URI:
   ```sh
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
   ```

## Running the Project

1. Start the server:
   ```sh
   npm run dev
   ```
2. The server will be running on `localhost:3000`.

## Middleware

- **Body Parser**: Parses JSON request bodies.
- **Logging Middleware**: Logs the HTTP method and URL of each request.
- **Error Handling Middleware**: Catches and handles errors, returning a 500 status code with a generic error message.

## API Endpoints

- **POST /orders**: Create a new order.
- **GET /orders**: Retrieve all orders.
- **GET /orders/:id**: Retrieve a specific order by ID.
- **PUT /orders/:id**: Update a specific order by ID.
- **DELETE /orders/:id**: Delete a specific order by ID.
- **POST /drivers**: Register a new driver.
- **GET /drivers**: Retrieve all drivers.
- **GET /drivers/:id**: Retrieve a specific driver by ID.
- **PUT /drivers/:id**: Update a specific driver by ID.
- **DELETE /drivers/:id**: Delete a specific driver by ID.
