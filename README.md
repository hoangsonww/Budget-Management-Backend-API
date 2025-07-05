# **Budget Management Backend API**

**Welcome to the Budget Management API**, a robust backend platform for managing budgets, expenses, users, orders, and notifications. Built with **Node.js**, **Express**, and **TypeScript**, it supports advanced features like **GraphQL**, **gRPC**, **WebSockets**, and **REST APIs**. The API integrates with **PostgreSQL**, **MongoDB**, **MySQL**, **Redis**, **RabbitMQ**, **Kafka**, and **Elasticsearch**, and is containerized with **Docker** and orchestrated using **Kubernetes**. It also includes a developer-friendly **CLI** tool and interactive **Swagger/OpenAPI** documentation for exploring and testing endpoints.

<p align="center">
  <a href="https://budget-manage-app.vercel.app" target="_blank">
    <img src="images/logo.png" alt="Budget Management API Logo" style="border-radius: 8px;" width="35%">
  </a>
</p>

Below is a _very_ comprehensive guide to setting up, running, and utilizing this API.

## **Table of Contents**

1. [Overview](#overview)
2. [Live Deployment](#live-deployment)
3. [Technologies Used](#technologies-used)
4. [Project Structure](#project-structure)
5. [Setup Instructions](#setup-instructions)
6. [Available Endpoints](#available-endpoints)
7. [Schemas](#schemas)
8. [Features and Integrations](#features-and-integrations)
9. [Environment Variables](#environment-variables)
10. [CLI Usage](#cli-usage)
11. [Demo Frontend UI](#demo-frontend-ui)
12. [Swagger Documentation](#swagger-documentation)
13. [GraphQL Integration](#graphql-integration)
14. [NGINX Configuration](#nginx-configuration)
15. [gRPC Integration](#grpc-integration)
16. [Dockerization](#dockerization)
17. [Kubernetes Deployment](#kubernetes-deployment)
18. [Spring Boot Backends with Gradle & Maven](#spring-boot-backends-with-maven-and-gradle)
19. [Dotnet Backends with C#](#dotnet-backend-with-c-sharp)
20. [Continuous Integration and Deployment with Jenkins](#continuous-integration-and-deployment-with-jenkins)
21. [Testing](#testing)
22. [Contributing](#contributing)
23. [Author](#author)

## **Overview**

The Budget Management API is designed to handle complex budget management requirements, including:

- Budget and expense tracking.
- User management and authentication.
- Real-time notifications via WebSockets.
- Asynchronous task handling using RabbitMQ and Kafka.
- Advanced search capabilities with Elasticsearch.
- CLI operations for direct interaction with the system.
- Compatibility with modern cloud environments like Docker and Kubernetes.
- Support for both REST and GraphQL APIs for flexible data access.
- Sample `dotnet` and `spring-boot` backends to demonstrate integration with other technologies.
- ...and so much more!

The purpose of this API is to demonstrate the capabilities of modern backend technologies and provide a foundation for building scalable, real-time applications. It can be used as a reference for developers looking to implement similar features in their projects. Simply clone the repository, set up the environment, and start building the frontend or additional functionality on top of the existing API! 

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Java](https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=openjdk&logoColor=white)
![C#](https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=csharp&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Kafka](https://img.shields.io/badge/Kafka-231F20?style=for-the-badge&logo=apachekafka&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Elasticsearch](https://img.shields.io/badge/Elasticsearch-005571?style=for-the-badge&logo=elasticsearch&logoColor=white)
![REST](https://img.shields.io/badge/REST%20API-FF6F00?style=for-the-badge&logo=apachespark&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)
![gRPC](https://img.shields.io/badge/gRPC-4285F4?style=for-the-badge&logo=grpc&logoColor=white)
![WebSockets](https://img.shields.io/badge/WebSockets-006699?style=for-the-badge&logo=websocket&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![OpenAPI](https://img.shields.io/badge/OpenAPI-6BA539?style=for-the-badge&logo=openapiinitiative&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)
![Jenkins](https://img.shields.io/badge/Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)
![NGINX](https://img.shields.io/badge/NGINX-009639?style=for-the-badge&logo=nginx&logoColor=white)
![PM2](https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=pm2&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white)
![Grafana](https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white)
![Maven](https://img.shields.io/badge/Maven-C71A36?style=for-the-badge&logo=apachemaven&logoColor=white)
![Gradle](https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Node CLI](https://img.shields.io/badge/Node%20CLI-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Mocha](https://img.shields.io/badge/Mocha-8D6748?style=for-the-badge&logo=mocha&logoColor=white)
![Chai](https://img.shields.io/badge/Chai-A30701?style=for-the-badge&logo=chai&logoColor=white)

## **Live Deployment**

The Budget Management API is deployed live at **[https://budget-management-backend-api.onrender.com](https://budget-management-backend-api.onrender.com).**

Additionally, a mock frontend UI is also available, hosted at **[https://budget-manage-app.vercel.app](https://budget-manage-app.vercel.app).**

You can access the API and test the endpoints directly from the browser. Feel free to use the API for your own projects or applications. Simply add some attribution to the original repository and the creator. Also, be sure that you use your own credentials and tokens, otherwise your data may clash with mine and other users' data!

> [!IMPORTANT]
> Be mindful of the rate limits and usage policies when testing the live API. Additionally, because the API is hosted on the free plan of Render, it may take a while (1-2 minutes) to wake up if it has been inactive for some time. Kindly be patient during this process!

> [!NOTE]
> Backup Frontend: https://budget-management-system.netlify.app.

### Deployment and Technology Status

[![API Status](https://img.shields.io/website?label=API%20Status&url=https%3A%2F%2Fbudget-management-backend-api.onrender.com)](https://budget-management-backend-api.onrender.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Connected-brightgreen?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Redis](https://img.shields.io/badge/Redis-Connected-red?logo=redis&logoColor=white)](https://redis.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Connected-blue?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-Connected-orange?logo=rabbitmq&logoColor=white)](https://www.rabbitmq.com/)
[![Kafka](https://img.shields.io/badge/Kafka-Connected-black?logo=apachekafka&logoColor=white)](https://kafka.apache.org/)
[![Elasticsearch](https://img.shields.io/badge/Elasticsearch-Connected-yellow?logo=elasticsearch&logoColor=white)](https://www.elastic.co/elasticsearch/)
[![gRPC](https://img.shields.io/badge/gRPC-Operational-purple?logo=grpc&logoColor=white)](https://grpc.io/)
[![GraphQL](https://img.shields.io/badge/GraphQL-Operational-pink?logo=graphql&logoColor=white)](https://graphql.org/)
[![Swagger Docs](https://img.shields.io/badge/Swagger%20Docs-Available-brightgreen?logo=swagger&logoColor=white)](https://budget-management-backend-api.onrender.com/docs)
[![Docker](https://img.shields.io/badge/Docker-Configured-blue?logo=docker&logoColor=white)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-blue?logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![WebSockets](https://img.shields.io/badge/WebSockets-Connected-brightgreen?logo=websocket&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
[![Nginx](https://img.shields.io/badge/Nginx-Configured-green?logo=nginx&logoColor=white)](https://www.nginx.com/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-Active-green?logo=openapiinitiative&logoColor=white)](https://www.openapis.org/)
[![Jenkins CI/CD](https://img.shields.io/badge/Jenkins%20CI%2FCD-Configured-blue?logo=jenkins&logoColor=white)](https://www.jenkins.io/)
[![Prometheus](https://img.shields.io/badge/Prometheus-Configured-blue?logo=prometheus&logoColor=white)](https://prometheus.io/)
[![Grafana](https://img.shields.io/badge/Grafana-Configured-blue?logo=grafana&logoColor=white)](https://grafana.com/)
[![Maven Package](https://img.shields.io/badge/Maven%20Package-Available-orange?logo=apachemaven&logoColor=white)](https://maven.apache.org/)
[![Gradle Package](https://img.shields.io/badge/Gradle%20Package-Available-orange?logo=gradle&logoColor=white)](https://gradle.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-Configured-green?logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![Dotnet](https://img.shields.io/badge/.NET-Configured-blue?logo=.net&logoColor=white)](https://dotnet.microsoft.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-green?logo=vercel&logoColor=white)](https://budget-manage-app.vercel.app)
[![Render](https://img.shields.io/badge/Render-Deployed-green?logo=render&logoColor=white)](https://budget-management-backend-api.onrender.com)
[![Netlify](https://img.shields.io/badge/Netlify-Deployed-green?logo=netlify&logoColor=white)](https://budget-management-system.netlify.app)

## **Technologies Used**

| **Technology**      | **Purpose**                                               |
|---------------------|-----------------------------------------------------------|
| **Node.js**         | Core application framework.                               |
| **Express.js**      | Web application framework for building APIs.              |
| **MongoDB**         | Primary NoSQL database for managing budgets and expenses. |
| **PostgreSQL**      | Relational database for transaction logs.                 |
| **MySQL**           | Optional relational database support.                     |
| **Redis**           | In-memory database for caching.                           |
| **RabbitMQ**        | Message broker for task queuing.                          |
| **Kafka**           | Distributed event streaming platform.                     |
| **Elasticsearch**   | Advanced search engine for querying data.                 |
| **gRPC**            | High-performance remote procedure call framework.         |
| **GraphQL**         | Query language for fetching and manipulating data.        |
| **WebSocket**       | Real-time communication for notifications.                |
| **Swagger/OpenAPI** | API documentation and testing.                            |
| **Docker**          | Containerization for easy deployment.                     |
| **Kubernetes**      | Orchestrating containerized applications at scale.        |
| **Nginx**           | Reverse proxy and load balancer.                          |
| **Prometheus**      | Monitoring and alerting toolkit.                          |
| **Grafana**         | Observability and visualization platform.                 |
| **Jenkins**         | CI/CD pipeline for automated testing and deployment.      |

## **Project Structure**

```plaintext
Budget-Management-Backend-API/
├── .env                           # Environment variables configuration
├── .env.example                   # Example environment configuration file
├── .gitignore                     # Git ignore file
├── .prettierrc                    # Prettier configuration for code formatting
├── LICENSE                        # License information
├── README.md                      # Documentation for the project
├── __tests__/app.test.js          # Main test file for application
├── cli.js                         # CLI tool for interacting with the backend
├── docker-compose.yml             # Docker Compose configuration
├── Dockerfile                     # Dockerfile for containerizing the application
├── grpcServer.js                  # gRPC server implementation
├── index.js                       # Main entry point for the application
├── nodemon.json                   # Nodemon configuration file
├── openapi.yaml                   # OpenAPI specification for the API
├── package.json                   # NPM package configuration file
├── start.sh                       # Script to start the application
├── prometheus.yml                 # Prometheus configuration for monitoring
├── redis-mongo-flow/              # Directory for Redis-Mongo integration flow
│   ├── app.js                     # Express app for Redis-Mongo flow
│   ├── config.js                  # Configuration for Redis-Mongo flow
│   ├── package.json               # NPM configuration for this module
│   ├── README.md                  # Documentation specific to Redis-Mongo flow
│   ├── seed.js                    # Data seeder for Redis-Mongo flow
│   ├── test.js                    # Test file for Redis-Mongo flow
├── round-robin/                   # Directory for round-robin load balancer
│   ├── config.js                  # Configuration for round-robin implementation
│   ├── index.js                   # Main entry point for round-robin logic
│   ├── README.md                  # Documentation for round-robin functionality
├── proto/                         # Protocol Buffers directory
│   ├── budget.proto               # gRPC proto file for budgets
├── nginx/                         # NGINX configuration directory
│   ├── docker-compose.yml         # Docker Compose for NGINX
│   ├── Dockerfile                 # Dockerfile for NGINX
│   ├── nginx.conf                 # NGINX configuration file
│   ├── start_nginx.sh             # Script to start NGINX
│   ├── README.md                  # Documentation for NGINX
├── docs/                          # Documentation directory
│   ├── swaggerConfig.js           # Swagger configuration for API docs
├── graphql/                       # GraphQL-related files
│   ├── schema.js                  # GraphQL schema definition
├── services/                      # Services and utilities
│   ├── dataSeeder.js              # Seeder for MongoDB
│   ├── elasticService.js          # Elasticsearch client and utility functions
│   ├── jwtService.js              # JSON Web Token (JWT) utilities
│   ├── postgresService.js         # PostgreSQL client and utilities
│   ├── rabbitMQService.js         # RabbitMQ client and utilities
│   ├── redisService.js            # Redis client and utilities
│   ├── websocketService.js        # WebSocket server and utilities
├── controllers/                   # Route controllers for the API
│   ├── authController.js          # Authentication-related endpoints
│   ├── budgetController.js        # Budget management endpoints
│   ├── customerController.js      # Customer management endpoints
│   ├── expenseController.js       # Expense management endpoints
│   ├── notificationController.js  # Notification management endpoints
│   ├── orderController.js         # Order management endpoints
│   ├── searchController.js        # Search-related endpoints
│   ├── taskController.js          # Task management endpoints
│   ├── transactionController.js   # Transaction log endpoints
│   ├── userController.js          # User profile management endpoints
├── middleware/                    # Middleware utilities
│   ├── authMiddleware.js          # JWT authentication middleware
├── models/                        # Mongoose schemas
│   ├── budget.js                  # Schema for budgets
│   ├── customer.js                # Schema for customers
│   ├── expense.js                 # Schema for expenses
│   ├── order.js                   # Schema for orders
│   ├── task.js                    # Schema for tasks
│   ├── user.js                    # Schema for users
├── routes/                        # Express router files
│   ├── authRoutes.js              # Routes for authentication
│   ├── budgetRoutes.js            # Routes for budgets
│   ├── customerRoutes.js          # Routes for customers
│   ├── expenseRoutes.js           # Routes for expenses
│   ├── graphqlRoutes.js           # Routes for GraphQL
│   ├── index.js                   # Main router entry point
│   ├── notificationRoutes.js      # Routes for notifications
│   ├── orderRoutes.js             # Routes for orders
│   ├── searchRoutes.js            # Routes for Elasticsearch
│   ├── taskRoutes.js              # Routes for tasks
│   ├── transactionRoutes.js       # Routes for transactions
│   ├── userRoutes.js              # Routes for user profiles
├── views/                         # Static assets and templates
│   ├── android-chrome-192x192.png # Android Chrome app icon
│   ├── android-chrome-512x512.png # Android Chrome high-res icon
│   ├── apple-touch-icon.png       # Apple Touch icon
│   ├── favicon.ico                # Favicon
│   ├── favicon-16x16.png          # 16x16 favicon
│   ├── favicon-32x32.png          # 32x32 favicon
│   ├── home.html                  # HTML template for homepage
│   ├── manifest.json              # Web app manifest
```

## **Setup Instructions**

### Prerequisites

- Node.js (>= 16)
- Docker and Docker Compose (if using containerized setup)
- MongoDB, PostgreSQL, MySQL, RabbitMQ, Redis, and Elasticsearch services.

### Local Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/hoangsonww/Budget-Management-Backend-API.git
   cd Budget-Management-Backend-API
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
  - Create a `.env` file in the root directory:
    ```env
    MONGO_DB_URI=mongodb://localhost:27017/budget_manager
    POSTGRES_URI=postgres://user:password@localhost:5432/budget_manager
    REDIS_URL=redis://localhost:6379
    RABBITMQ_URL=amqp://localhost
    KAFKA_BROKER=localhost:9092
    JWT_SECRET=your_secret_key
    ```
  - Replace placeholders with your actual configuration.

4. Start the application:
   ```bash
   npm start
   ```

5. Access the application:
  - API: `http://localhost:3000`
  - Swagger: `http://localhost:3000/docs`

## **Available Endpoints**

| **Endpoint**               | **Method** | **Description**                          |
|----------------------------|------------|------------------------------------------|
| `/api/auth/register`       | POST       | Register a new user.                     |
| `/api/auth/login`          | POST       | Login and receive a JWT token.           |
| `/api/auth/logout`         | POST       | Logout and invalidate the token.         |
| `/api/auth/verify-email`   | POST       | Verify the user's email address.         |
| `/api/auth/reset-password` | POST       | Reset the user's password.               |
| `/api/users/profile`       | GET        | Get the authenticated user's profile.    |
| `/api/budgets`             | GET        | Get all budgets.                         |
| `/api/budgets`             | POST       | Create a new budget.                     |
| `/api/budgets/:id`         | GET        | Get a specific budget.                   |
| `/api/budgets/:id`         | PUT        | Update a budget.                         |
| `/api/budgets/:id`         | DELETE     | Delete a budget.                         |
| `/api/customers`           | GET        | Get all customers.                       |
| `/api/customers`           | POST       | Create a new customer.                   |
| `/api/customers/:id`       | GET        | Get a specific customer.                 |
| `/api/customers/:id`       | PUT        | Update a customer.                       |
| `/api/customers/:id`       | DELETE     | Delete a customer.                       |
| `/api/expenses`            | GET        | Get all expenses.                        |
| `/api/expenses`            | POST       | Add a new expense.                       |
| `/api/expenses/:budgetId`  | GET        | Get all expenses for a budget.           |
| `/api/expenses/:id`        | PUT        | Update an expense.                       |
| `/api/expenses/:id`        | DELETE     | Delete an expense.                       |
| `/api/orders`              | GET        | Get all orders.                          |
| `/api/orders`              | POST       | Create a new order.                      |
| `/api/orders/:id`          | GET        | Get a specific order.                    |
| `/api/orders/:id`          | PUT        | Update an order.                         |
| `/api/orders/:id`          | DELETE     | Delete an order.                         |
| `/api/transactions`        | GET        | Get all transactions.                    |
| `/api/transactions`        | POST       | Add a new transaction.                   |
| `/api/transactions/:id`    | GET        | Get a specific transaction.              |
| `/api/transactions/:id`    | PUT        | Update a transaction.                    |
| `/api/transactions/:id`    | DELETE     | Delete a transaction.                    |
| `/api/tasks`               | GET        | Get all tasks.                           |
| `/api/tasks`               | POST       | Add a new task.                          |
| `/api/tasks/:id`           | GET        | Get a specific task.                     |
| `/api/tasks/:id`           | PUT        | Update a task.                           |
| `/api/tasks/:id`           | DELETE     | Delete a task.                           |
| `/api/graphql`             | POST       | Perform a GraphQL query.                 |
| `/api/notifications`       | POST       | Send a real-time notification.           |
| `/api/search`              | POST       | Search for expenses using Elasticsearch. |

Additionally, the root `/` endpoint provides a welcome message and information about the API.

<p align="center">
  <img src="images/home.png" alt="Available Endpoints" style="border-radius: 8px;">
</p>

More endpoints and features are available in the API. Refer to the [Swagger documentation](https://budget-management-backend-api.onrender.com/docs) for detailed information.

## **Schemas**

### **User**
| **Field**   | **Type** | **Description**             |
|-------------|----------|-----------------------------|
| `username`  | String   | Unique username.            |
| `email`     | String   | Unique email address.       |
| `password`  | String   | Hashed password.            |
| `createdAt` | Date     | User creation date.         |

### **Budget**
| **Field**   | **Type** | **Description**             |
|-------------|----------|-----------------------------|
| `name`      | String   | Budget name.                |
| `limit`     | Number   | Budget limit.               |
| `createdAt` | Date     | Budget creation date.       |

### **Expense**
| **Field**     | **Type** | **Description**              |
|---------------|----------|------------------------------|
| `budgetId`    | String   | ID of the associated budget. |
| `description` | String   | Expense description.         |
| `amount`      | Number   | Expense amount.              |
| `createdAt`   | Date     | Expense creation date.       |

### **Order**
| **Field**    | **Type** | **Description**                |
|--------------|----------|--------------------------------|
| `customerId` | String   | ID of the associated customer. |
| `amount`     | Number   | Order amount.                  |
| `status`     | String   | Order status.                  |
| `createdAt`  | Date     | Order creation date.           |

### **Customer**
| **Field**   | **Type** | **Description**              |
|-------------|----------|------------------------------|
| `name`      | String   | Customer name.               |
| `email`     | String   | Customer email address.      |
| `phone`     | String   | Customer phone number.       |

### **Task**

| **Field**     | **Type** | **Description**              |
|---------------|----------|------------------------------|
| `description` | String   | Task description.            |
| `status`      | String   | Task status.                 |
| `createdAt`   | Date     | Task creation date.          |

## **Features and Integrations**

### **gRPC**
- High-performance RPC framework.
- Start the gRPC server using:
  ```bash
  npm start
  ```

### **GraphQL**
- Flexible data queries and mutations.
- Access the GraphQL endpoint at `http://localhost:3000/graphql`.

### **WebSocket**
- Real-time notifications for clients.
- Notifications can be sent using the `/api/notifications` endpoint or CLI.

### **Docker**
- Build and run the app with Docker:
  ```bash
  docker-compose up --build
  ```

### **Elasticsearch**
- Advanced search for expenses.
- Search endpoint: `/api/search/expenses`.

### **RabbitMQ**
- Asynchronous task handling.
- Use the `budget-manager` CLI to add tasks.
- Tasks are processed in the background.

### **Kafka**
- Distributed event streaming platform.
- Kafka broker URL: `localhost:9092`.
- Kafka producer and consumer are integrated.

### **Redis**
- In-memory caching for improved performance.
- Redis URL: `redis://localhost:6379`.
- Caching is used for user sessions and other data.

### **PostgreSQL**
- Relational database for transaction logs.
- PostgreSQL URL: `postgres://user:password@localhost:5432/budget_manager`.
- Used for storing transaction logs and other relational data.
- MySQL is also supported as an alternative.

### **MongoDB**
- Primary NoSQL database for managing budgets and expenses.
- MongoDB URL: `mongodb://localhost:27017/budget_manager`.
- Used for storing budgets, expenses, and user data.

### **Nginx**
- Reverse proxy and load balancer.
- Nginx configuration is included in the `nginx` directory.
- Load balancing can be configured for multiple instances.
- SSL termination and caching can be added.

### **Kubernetes**
- Deployment manifests are available in the `kubernetes` directory.
- Deploy the application to a Kubernetes cluster using:
  ```bash
  kubectl apply -f kubernetes/
  ```
  
### **Prometheus and Grafana**
- Monitoring and observability tools.
- Prometheus configuration is available in `prometheus.yml`.
- Grafana can be used for visualization and monitoring.
- Metrics and dashboards can be configured.
- Monitor the health and performance of the API.

## **Services Interaction**

The Budget Management API interacts with various services and databases to provide a comprehensive backend solution. The architecture includes a frontend UI, a CLI tool, an API gateway, a gRPC server, and multiple external services. Here is a high-level overview of the service interaction:

```plaintext
          +--------------------+               +------------------+
          |    Frontend UI     |               |                  |
          |    (not impl.)     |               |  CLI Tool / gRPC |
          +--------------------+               +------------------+
                    |                               |
                    | HTTP/GraphQL Requests         | CLI Commands / gRPC Calls
                    |                               |
          +--------------------+                 +------------------+
          |   API Gateway /    |<--------------->|    gRPC Server   |
          |    Express.js      |                 +------------------+
          +--------------------+
                    |
                    | RESTful API / WebSocket / GraphQL Responses
                    |
          +--------------------+
          |  Application Core  |
          |--------------------|
          |  Controllers /     |
          |  Services          |
          +--------------------+
            |        |         |
     +------+        |         +-------------+
     |               |                       |
+----------+   +-----------+           +----------------+
| MongoDB  |   | PostgreSQL |          | Elasticsearch  |
| NoSQL DB |   | Relational |          | Search Engine  |
+----------+   +-----------+           +----------------+
     |               |                       |
     |               |                       |
+----------+    +-------------+      +----------------+
|   Redis  |    | RabbitMQ /  |      | Kafka (Event   |
|   Cache  |    | Kafka Queue |      |   Streaming)   |
+----------+    +-------------+      +----------------+
     |              |                        |
     +--------------|-(Asynchronous Tasks)---+
                    |
          +----------------------+
          |   External Services  |
          |  (Email, SMS, etc.)  |
          +----------------------+
```

## **Environment Variables**

Ensure your `.env` file looks like this before getting started:

```env
# Server Configuration
PORT=

# MongoDB Configuration
MONGO_DB_URI=
MONGO_DB_USERNAME=
MONGO_DB_PASSWORD=

# Redis Configuration
REDIS_HOST=
REDIS_PORT=
REDIS_URL=

# RabbitMQ Configuration
RABBIT_MQ_HOST=
RABBITMQ_URL=

# Kafka Configuration
KAFKA_BROKER=

# JWT Secret Key
JWT_SECRET=

# Elasticsearch Configuration
ELASTIC_SEARCH_URL=

# PostgreSQL Configuration
POSTGRES_URL=
```

## **CLI Usage**

The `budget-manager` CLI provides a convenient way to interact with the application from the command line.

Follow these steps to use the CLI:

1. Install globally:
   ```bash
   npm link
   ```

2. Use commands:
   ```bash
   budget-manager seed
   budget-manager notify "Hello!"
   budget-manager add-task "Task description"
   ```
   
3. View available commands:
   ```bash
    budget-manager --help
    ```
   
  This will display a list of available commands and options:
  ```plaintext
  budget-manager --help
  Usage: budget-manager [options] [command]
  
  A CLI for managing budgets, tasks, orders, and more.
  
  Options:
    -V, --version                        output the version number
    -h, --help                           display help for command
  
  Commands:
    seed                                 Seed the MongoDB database with initial data
    notify <message>                     Send a real-time notification to WebSocket clients
    list-budgets                         List all budgets in the database
    add-task <description>               Add a new task to the task queue
    list-orders                          List all orders in the database
    add-order <customerId> <amount>      Add a new order
    list-customers                       List all customers in the database
    add-customer <name> <email> [phone]  Add a new customer
    search-expenses <query>              Search for expenses using a query
    graphql-query <query>                Perform a GraphQL query
    help [command]                       display help for command
  
  Examples:
    $ budget-manager seed
    $ budget-manager notify "Hello World!"
    $ budget-manager list-budgets
    $ budget-manager add-task "New Task Description"
  ```
   
4. View version information:
   ```bash
   budget-manager --version
   ```
   
The CLI provides a simple way to interact with the backend API and perform various operations. It can be used for testing, debugging, and managing the application without a frontend interface or using the Swagger documentation.

## **Demo Frontend UI**

The Budget Management API includes a demo frontend UI for interacting with the backend.

It gives developers an idea of how the API can be used in a real-world application. The frontend UI is built using React, Redux, and Material-UI components.

To run the frontend UI, follow these steps:

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
   
2. Install dependencies: (use `npm install --legacy-peer-deps` if you encounter peer dependency issues)
   ```bash
    npm install
    ```
   
3. Start the development server:
   ```bash
   npm start
   ```
   
4. Access the frontend UI at `http://localhost:3001` (or whichever port is specified in the console).

Alternatively, it is also deployed live at [https://budget-manage-app.vercel.app](https://budget-manage-app.vercel.app). Feel free to use the live version for testing and exploration.

For more information, refer to the [Frontend README](frontend/README.md) in the `frontend` directory to learn about the frontend UI components, features, and usage.

### **UI Images**

Here are some screenshots of the frontend UI:

**Home:**

<p align="center">
  <img src="images/home-ui.png" alt="Frontend UI" style="border-radius: 8px;">
</p>

**Dashboard:**

<p align="center">
  <img src="images/dashboard.png" alt="Frontend UI" style="border-radius: 8px;">
</p>

**Budgets:**

<p align="center">
  <img src="images/budgets.png" alt="Frontend UI" style="border-radius: 8px;">
</p>

**Expenses:**

<p align="center">
  <img src="images/expenses.png" alt="Frontend UI" style="border-radius: 8px;">
</p>

**Profile:**

<p align="center">
  <img src="images/profile.png" alt="Frontend UI" style="border-radius: 8px;">
</p>

**Login:**

<p align="center">
  <img src="images/login.png" alt="Frontend UI" style="border-radius: 8px;">
</p>

**Register:**

<p align="center">
  <img src="images/register.png" alt="Frontend UI" style="border-radius: 8px;">
</p>

**Forgot Password:**

<p align="center">
  <img src="images/forgot-password.png" alt="Frontend UI" style="border-radius: 8px;">
</p>

**Users:**

<p align="center">
  <img src="images/users.png" alt="Frontend UI" style="border-radius: 8px;">
</p>

## **Swagger Documentation**

- Comprehensive API documentation is available at `/docs`.
- Includes all endpoints, schemas, and examples.
- Use Swagger UI to test and interact with the API.
- The Swagger UI looks like this:

<p align="center">
  <img src="images/swagger.png" alt="Swagger UI" style="border-radius: 8px;">
</p>

## **GraphQL Integration**

- The Budget Management API supports GraphQL queries and mutations.
- Access the GraphQL endpoint at `http://localhost:3000/api/graphql`.
- Use the GraphiQL interface to interact with the API.
- The GraphiQL interface looks like this:

<p align="center">
  <img src="images/graphiql.png" alt="GraphiQL" style="border-radius: 8px;">
</p>

- Interact with the API using GraphQL queries and mutations. Examples include:

```graphql
query {
  budgets {
    id
    name
    limit
    createdAt
  }
}
```

Or:

```graphql
query {
  expenses(budgetId: "64c9f8f2a73c2f001b3c68f4") {
    id
    description
    amount
    budgetId
    createdAt
  }
}
```

When you run these queries, you will receive a response with the requested data. GraphQL provides a flexible and efficient way to fetch and manipulate data from the backend. Here is an example:

<p align="center">
  <img src="images/graphql.png" alt="GraphQL" style="border-radius: 8px;">
</p>

## **NGINX Configuration**

- The `nginx` directory contains an Nginx configuration for reverse proxy and load balancing.
- Use Nginx to route requests to multiple instances of the API.
- Configure SSL termination and caching for improved performance.
- The Nginx configuration looks like this:

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

- For more information, refer to the [Nginx documentation](https://nginx.org/en/docs/) and the [Nginx Directory](nginx/README.md).

## **gRPC Integration**

The Budget Management API includes support for **gRPC** to enable high-performance remote procedure calls.

### **Getting Started**

1. **Start the gRPC Server**:
   Run the following command:
   ```bash
   node grpcServer.js
   ```

2. **Use the gRPC Client**:
   Execute the client to interact with the server:
   ```bash
   node grpcClient.js
   ```

3. **Proto File**:
   The `.proto` file for defining gRPC services and messages is located in the `protos` directory.

That's it! Your gRPC server and client should now be operational. 🚀

## **Dockerization**

The Budget Management API can be run in a Docker container for easy deployment and scaling.

You can build and run the app using Docker Compose:

```bash
docker-compose up --build
```

## **Kubernetes Deployment**

1. Create Kubernetes manifests for the services.
2. Deploy to a cluster:
   ```bash
   kubectl apply -f kubernetes/
   ```
   
3. Access the application using the service URL.

## **Spring Boot Backends with Maven and Gradle**

There is also a Spring Boot Java version of the Budget Management API available in the `spring-boot` directory. It is built using Maven and Gradle.

To run the Spring Boot Maven application, follow these steps:

1. Navigate to the `spring-boot` directory:
   ```bash
   cd spring
   ```

2. Build the application using Maven:
   ```bash
    mvn clean install
    ```
   
3. Run the application:
    ```bash
    mvn spring-boot:run
    ```
   
4. Access the Spring Boot application at `http://localhost:8080`.

To run the Spring Boot Gradle application, follow these steps:

1. Navigate to the `spring-boot` directory:
   ```bash
   cd gradle
   ```
   
2. Build the application using Gradle:
   ```bash
    ./gradlew build
    ```
   
3. Run the application:
    ```bash
    ./gradlew bootRun
    ```
   
4. Access the Spring Boot application at `http://localhost:8080`.

## **Dotnet Backend with C Sharp**

There is also a Dotnet C# version of the Budget Management API available in the `dotnet` directory. It is built using ASP.NET Core.

To run the Dotnet C# application, follow these steps:

1. Navigate to the `dotnet` directory:
   ```bash
   cd dotnet
   ```
   
2. Build the application using the .NET CLI:
   ```bash
    dotnet build
    ```
   
3. Run the application:
    ```bash
    dotnet run
    ```
   
4. Access the Dotnet C# application at `http://localhost:5000`.

## **Continuous Integration and Deployment with Jenkins**

The Budget Management API includes a Jenkins pipeline for continuous integration and deployment.

1. **Pipeline Configuration:** The `Jenkinsfile` defines the CI/CD pipeline stages, including code checkout, dependency installation, testing, building, and deployment. Add it to the root of the project.

2. **Job Setup:** Create a pipeline job in Jenkins, point it to the repository, and configure it to use the `Jenkinsfile`.

3. **Automated Testing:** The pipeline runs `npm test` to ensure all tests pass before proceeding to the build or deployment stages.

4. **Environment Variables:** Use Jenkins environment variables to securely manage secrets like API keys and credentials for services such as MongoDB, Redis, or Render.

5. **Deployment:** The pipeline supports deploying the application using Render or directly to a server using SSH and PM2.

6. **Webhooks:** Integrate GitHub/GitLab webhooks to trigger builds automatically on code changes.

7. **Notifications:** Add Slack or email notifications in the pipeline to inform team members about build and deployment statuses.

## **Testing**

The Budget Management API includes unit tests for all endpoints and services.

To run the tests, use the following command:

```bash
npm test
```

The test results will be displayed in the console.

**Watch Mode:** To run tests in watch mode, which automatically re-runs tests on file changes, use:

```bash
npm test:watch
```

**Coverage Report:** To generate a code coverage report, use:

```bash
npm test:coverage
```

**Mocha and Chai tests:** In addition to the Jest tests, the project also includes Mocha and Chai tests for the application. These tests can be run using:

```bash
npm run test:mocha
```

## **Contributing**

Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make changes and commit them (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new pull request. We will review your changes and merge them if they look good.

## **Author**

- **Son Nguyen** - [hoangsonww](https://github.com/hoangsonww)
- **Website:** [https://sonnguyenhoang.com](https://sonnguyenhoang.com)
- **Email:** [hoangson091104@gmail.com](mailto:hoangson091104@gmail.com)
- **LinkedIn:** [https://www.linkedin.com/in/hoangsonw](https://www.linkedin.com/in/hoangsonw)
- Feel free to reach out if you have any questions or feedback! 🚀

---

Thank you for using the **Budget Management API**. For questions, feedback, or support, please open an issue or [contact me directly](mailto:hoangson091104@gmail.com).

Created with ❤️ by [Son Nguyen](https://sonnguyenhoang.com) in 2024. All rights reserved.

---

[⬆️ Back to Top](#budget-management-backend-api)
