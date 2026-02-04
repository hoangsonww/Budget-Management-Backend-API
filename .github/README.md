# **Budget Management API - A Comprehensive, Microservices-Based API for Managing Budgets, Expenses, Users, and More! 💰**

**Welcome to the Budget Management API**, a robust, **microservices** backend platform for managing budgets, expenses, users, orders, and notifications. Built with **Node.js**, **Express**, and **TypeScript**, it supports advanced features like **GraphQL**, **gRPC**, **WebSockets**, and **REST APIs**. 

The API also integrates with **PostgreSQL**, **MongoDB**, **MySQL**, **Redis**, **RabbitMQ**, **Kafka**, and **Elasticsearch**, and is containerized with **Docker** and orchestrated using **Kubernetes** that fully supports _zero-downtime deployment_ **(**blue/green & canary deployment**)**. It also includes a developer-friendly **CLI** tool and interactive **Swagger/OpenAPI** documentation for exploring and testing endpoints.

<p align="center">
  <a href="https://hoangsonww.github.io/Budget-Management-Backend-API" target="_blank">
    <img src="../images/logo.png" alt="Budget Management API Logo" style="border-radius: 8px;" width="35%">
  </a>
</p>

Below is a _very_ _comprehensive_ guide to setting up, running, and utilizing this API. 💸🚀

## **Table of Contents**

1. [Overview](#overview)
2. [Live Deployment](#live-deployment)
3. [Technologies Used](#technologies-used)
   - [Microservices Architecture](#microservices-architecture)
   - [Microservices Diagram](#microservices-diagram)
   - [Full Architecture Diagram](#full-architecture-diagram)
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
    - [GitHub Actions](#github-actions)
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
![GitHub Actions](https://img.shields.io/badge/GitHub%20Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Node CLI](https://img.shields.io/badge/Node%20CLI-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![Mocha](https://img.shields.io/badge/Mocha-8D6748?style=for-the-badge&logo=mocha&logoColor=white)
![Chai](https://img.shields.io/badge/Chai-A30701?style=for-the-badge&logo=chai&logoColor=white)
![Microservices](https://img.shields.io/badge/Microservices-00BFFF?style=for-the-badge&logo=farcaster&logoColor=white)

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

### Microservices Architecture

The Budget Management API is designed with a microservices architecture, allowing for modular development and deployment. Each service can be developed, deployed, and scaled independently, providing flexibility and resilience.

1. **Authentication/User Service**: Handles user registration, login, and JWT token management (+ profile management as well).
2. **Budget Service**: Manages budgets, including creation, updates, and retrieval.
3. **Expense Service**: Manages expenses associated with budgets, including CRUD operations.
4. **Customer Service**: Manages customer data, including creation and updates.
5. **Search Service**: Provides advanced search capabilities using Elasticsearch.
6. **Order Service**: Manages orders, including creation and updates.
7. **Transaction Service**: Logs transactions for budgets and expenses.
8. **Notification Service**: Sends real-time notifications to users via WebSockets.
9. **Task Management Service**: Handles asynchronous tasks using RabbitMQ and Kafka.

This architecture allows for easy integration of additional services, such as order management, task management, and notification services, without affecting the core functionality of the API.

#### Communication Between Services

Each service communicates with others using RabbitMQ for asynchronous messaging, gRPC for high-performance remote procedure calls, and REST APIs for standard HTTP communication. This ensures that services can operate independently while still being able to interact with each other as needed.

Also, the API is designed to be modular, allowing for easy addition of new services or features without disrupting existing functionality. This modularity is achieved through the use of separate directories for each service, with shared utilities and configurations in a common structure.

> [!TIP]
> Each service does not live in its own directory, but rather is organized within the main project structure. This allows for easier management and deployment of the entire application as a single unit, while still maintaining the modularity of the microservices architecture.

### Microservices Diagram

<p align="center">
  <a href="https://www.mermaidchart.com/app/projects/ab86aba4-5205-4ad5-bdfc-85dfba04f62f/diagrams/0ecda876-0581-4897-bac3-b6800daa2a14/version/v0.1/edit" target="_blank">
   <img src="../images/microservices-diagram.png" alt="Microservices Architecture Diagram" style="border-radius: 8px;" width="100%">
  </a>
</p>

> [!NOTE]
> This diagram illustrates the microservices architecture of the Budget Management API, showing how different services interact with each other and external clients. Each service can be independently developed and deployed, allowing for scalability and maintainability.

### Full Architecture Diagram

<p align="center">
  <a href="https://www.mermaidchart.com/app/projects/ab86aba4-5205-4ad5-bdfc-85dfba04f62f/diagrams/b164e25e-68b3-417e-8753-5b718e23d996/version/v0.1/edit" target="_blank">
   <img src="../images/architecture-diagram.png" alt="Architecture Diagram" style="border-radius: 8px;" width="100%">
  </a>
</p>

> [!NOTE]
> This architecture diagram illustrates the modular nature of the Budget Management API, showcasing how different services interact with each other and external clients. It also highlights the use of various technologies such as Docker, Kubernetes, and Nginx for deployment and scaling.

## **Project Structure**

```mermaid
%%{init: {'theme':'base', 'themeVariables': { 'primaryColor':'#4CAF50','primaryTextColor':'#fff','primaryBorderColor':'#2E7D32','lineColor':'#1976D2','secondaryColor':'#2196F3','tertiaryColor':'#FFC107','fontSize':'14px','fontFamily':'Arial'}}}%%
mindmap
  root((Budget Management API))
    Root Files
      .env[.env — Environment variables]
      .env.example[.env.example — Sample config]
      .gitignore[.gitignore — Git ignore]
      .prettierrc[.prettierrc — Code formatter]
      LICENSE[LICENSE — License]
      README[README.md — Documentation]
      cli.js[cli.js — CLI tool]
      docker-compose.yml[docker-compose.yml — Docker config]
      Dockerfile[Dockerfile — Container image]
      grpcServer.js[grpcServer.js — gRPC server]
      index.js[index.js — App entry point]
      nodemon.json[nodemon.json — Dev config]
      openapi.yaml[openapi.yaml — API spec]
      package.json[package.json — NPM config]
      prometheus.yml[prometheus.yml — Monitoring]
      start.sh[start.sh — Startup script]
    Tests
      __tests__[__tests__/app.test.js — Main tests]
    Docs
      swaggerConfig[docs/swaggerConfig.js — Swagger]
    GraphQL
      schema[graphql/schema.js — Schema]
    Proto
      budget[proto/budget.proto — gRPC proto]
    NGINX
      docker-compose[nginx/docker-compose.yml]
      Dockerfile[nginx/Dockerfile]
      nginx.conf[nginx/nginx.conf — Reverse proxy]
      start_nginx[nginx/start_nginx.sh]
      README[nginx/README.md]
    Redis-Mongo Flow
      app[redis-mongo-flow/app.js]
      config[redis-mongo-flow/config.js]
      package[redis-mongo-flow/package.json]
      README[redis-mongo-flow/README.md]
      seed[redis-mongo-flow/seed.js]
      test[redis-mongo-flow/test.js]
    Round Robin
      config[round-robin/config.js]
      index[round-robin/index.js]
      README[round-robin/README.md]
    Services
      dataSeeder[dataSeeder.js — MongoDB seeder]
      elastic[elasticService.js — Elasticsearch]
      jwt[jwtService.js — JWT helpers]
      postgres[postgresService.js — PostgreSQL]
      rabbitMQ[rabbitMQService.js — RabbitMQ]
      redis[redisService.js — Redis]
      websocket[websocketService.js — WebSocket]
    Controllers
      auth[authController.js — Auth]
      budget[budgetController.js — Budget]
      customer[customerController.js — Customer]
      expense[expenseController.js — Expense]
      notification[notificationController.js — Notifications]
      order[orderController.js — Order]
      search[searchController.js — Search]
      task[taskController.js — Task]
      transaction[transactionController.js — Transaction]
      user[userController.js — User]
    Middleware
      authMiddleware[authMiddleware.js — JWT auth]
    Models
      budget[budget.js — Budget schema]
      customer[customer.js — Customer schema]
      expense[expense.js — Expense schema]
      order[order.js — Order schema]
      task[task.js — Task schema]
      user[user.js — User schema]
    Routes
      auth[authRoutes.js — Auth]
      budget[budgetRoutes.js — Budget]
      customer[customerRoutes.js — Customer]
      expense[expenseRoutes.js — Expense]
      graphql[graphqlRoutes.js — GraphQL]
      index[index.js — Router entry]
      notification[notificationRoutes.js — Notifications]
      order[orderRoutes.js — Order]
      search[searchRoutes.js — Search]
      task[taskRoutes.js — Task]
      transaction[transactionRoutes.js — Transaction]
      user[userRoutes.js — User]
    Views
      icons[android/apple/favicon icons]
      home[home.html — Homepage]
      manifest[manifest.json — Web manifest]
    Other
      more[Additional files and directories]
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
  <img src="../images/home.png" alt="Available Endpoints" style="border-radius: 8px;">
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

```mermaid
flowchart LR
    FE[Frontend UI<br/>]
    CLI[CLI Tool / gRPC Clients]
    APIGW[API Gateway / Express.js]
    GRPC[gRPC Server]
    CORE[Application Core<br/>Controllers & Services]
    Mongo[MongoDB]
    Postgres[PostgreSQL]
    Elastic[Elasticsearch]
    Redis[Redis Cache]
    Queue[RabbitMQ / Kafka Queue]
    Stream[Kafka Event Streaming]
    External[External Services<br/>Email, SMS, etc.]

    FE -->|HTTP / GraphQL requests| APIGW
    CLI -->|CLI commands / gRPC calls| GRPC
    APIGW <--> GRPC
    APIGW -->|REST / WebSocket / GraphQL| CORE
    GRPC --> CORE

    CORE --> Mongo
    CORE --> Postgres
    CORE --> Elastic
    CORE --> Redis
    CORE --> Queue
    CORE --> Stream
    Queue -->|Asynchronous tasks| External
    Stream -->|Event-driven actions| External
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

> [!TIP]
> Info site: [`https://hoangsonww.github.io/Budget-Management-Backend-API/`](https://hoangsonww.github.io/Budget-Management-Backend-API/)

### **UI Images**

Here are some screenshots of the frontend UI:

**Home:**

<p align="center">
  <img src="../images/home-ui.png" alt="Frontend UI" style="border-radius: 8px;">
</p>

**Dashboard:**

<p align="center">
  <img src="../images/dashboard.png" alt="Frontend UI" style="border-radius: 8px;">
</p>

**Budgets:**

<p align="center">
  <img src="../images/budgets.png" alt="Frontend UI" style="border-radius: 8px;">
</p>

**Expenses:**

<p align="center">
  <img src="../images/expenses.png" alt="Frontend UI" style="border-radius: 8px;">
</p>

**Profile:**

<p align="center">
  <img src="../images/profile.png" alt="Frontend UI" style="border-radius: 8px;">
</p>

**Login:**

<p align="center">
  <img src="../images/login.png" alt="Frontend UI" style="border-radius: 8px;">
</p>

**Register:**

<p align="center">
  <img src="../images/register.png" alt="Frontend UI" style="border-radius: 8px;">
</p>

**Users:**

<p align="center">
  <img src="../images/users.png" alt="Frontend UI" style="border-radius: 8px;">
</p>

## **Swagger Documentation**

- Comprehensive API documentation is available at `/docs`.
- Includes all endpoints, schemas, and examples.
- Use Swagger UI to test and interact with the API.
- The Swagger UI looks like this:

<p align="center">
  <img src="../images/swagger.png" alt="Swagger UI" style="border-radius: 8px;">
</p>

## **GraphQL Integration**

- The Budget Management API supports GraphQL queries and mutations.
- Access the GraphQL endpoint at `http://localhost:3000/api/graphql`.
- Use the GraphiQL interface to interact with the API.
- The GraphiQL interface looks like this:

<p align="center">
  <img src="../images/graphiql.png" alt="GraphiQL" style="border-radius: 8px;">
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
  <img src="../images/graphql.png" alt="GraphQL" style="border-radius: 8px;">
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

The Budget Management API now supports advanced deployment strategies for production-grade deployments:

### **Deployment Strategies**

1. **Blue-Green Deployment**: Zero-downtime deployments with instant rollback capability
2. **Canary Deployment**: Gradual traffic shifting for risk mitigation
3. **Rolling Deployment**: Standard Kubernetes rolling updates

### **Quick Start**

#### Blue-Green Deployment
```bash
# Deploy blue and green environments
kubectl apply -f kubernetes/backend-deployment-blue.yaml
kubectl apply -f kubernetes/backend-deployment-green.yaml
kubectl apply -f kubernetes/frontend-deployment-blue.yaml
kubectl apply -f kubernetes/frontend-deployment-green.yaml

# Deploy services
kubectl apply -f kubernetes/backend-service-blue-green.yaml
kubectl apply -f kubernetes/frontend-service-blue-green.yaml

# Apply production-ready configurations
kubectl apply -f kubernetes/hpa.yaml
kubectl apply -f kubernetes/pdb.yaml
kubectl apply -f kubernetes/network-policy.yaml
kubectl apply -f kubernetes/ingress.yaml
kubectl apply -f kubernetes/servicemonitor.yaml

# Switch traffic (after validation)
kubectl patch service backend-service -p '{"spec":{"selector":{"version":"green"}}}'
```

#### Canary Deployment
```bash
# Deploy stable version (90% traffic)
kubectl apply -f kubernetes/backend-deployment-canary-stable.yaml
kubectl apply -f kubernetes/frontend-deployment-canary-stable.yaml

# Deploy canary version (10% traffic)
kubectl apply -f kubernetes/backend-deployment-canary.yaml
kubectl apply -f kubernetes/frontend-deployment-canary.yaml

# Deploy services
kubectl apply -f kubernetes/backend-service-canary.yaml
kubectl apply -f kubernetes/frontend-service-canary.yaml

# Apply production-ready configurations
kubectl apply -f kubernetes/hpa.yaml
kubectl apply -f kubernetes/pdb.yaml
kubectl apply -f kubernetes/network-policy.yaml
```

### **Production-Ready Features**

- **Health Checks**: Liveness, readiness, and startup probes
- **Auto-scaling**: Horizontal Pod Autoscaler (HPA) based on CPU/Memory
- **High Availability**: Pod anti-affinity and disruption budgets
- **Security**: Network policies, non-root containers, dropped capabilities
- **Monitoring**: Prometheus ServiceMonitor integration
- **Resource Management**: CPU/Memory requests and limits
- **Ingress**: SSL/TLS termination, rate limiting, timeouts

### **Documentation**

For detailed deployment procedures and best practices, see:
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) - Comprehensive deployment strategies
- [Kubernetes Overview](docs/KUBERNETES_OVERVIEW.md) - Architecture and components
- [Quick Start Guide](docs/DEPLOYMENT_QUICK_START.md) - Step-by-step deployment

### **Monitoring**

Access metrics at:
- Backend: `http://backend-service:3000/metrics`
- Frontend: `http://frontend-service:3001/metrics`

View health endpoints:
- Backend Health: `http://backend-service:3000/health`
- Backend Readiness: `http://backend-service:3000/ready`

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

The Budget Management API includes an advanced Jenkins pipeline with support for multiple deployment strategies and production-ready features.

### **Pipeline Features**

1. **Multiple Deployment Strategies**:
   - **Rolling**: Standard rolling updates with zero-downtime
   - **Blue-Green**: Instant traffic switching with zero-downtime
   - **Canary**: Gradual traffic shifting with configurable percentage

2. **Comprehensive Testing**:
   - Unit tests with coverage reporting
   - Integration tests
   - Smoke tests post-deployment
   - Performance tests
   - Security audits

3. **Code Quality Checks**:
   - ESLint for code linting
   - npm audit for security vulnerabilities
   - Dependency checking for outdated packages

4. **Docker Integration**:
   - Automated Docker image building
   - Multi-stage builds for optimization
   - Push to Docker registry with versioning
   - Image tagging based on Git commit SHA

5. **Kubernetes Deployment**:
   - Automated deployment to Kubernetes clusters
   - Health checks and validation
   - Automatic rollback on failure
   - Traffic switching for blue-green deployments
   - Canary analysis and promotion

6. **Monitoring and Notifications**:
   - Slack notifications for build status
   - Deployment success/failure alerts
   - Real-time progress updates
   - Git tag creation for successful deployments

### **Pipeline Parameters**

Configure the pipeline with these parameters:

- **DEPLOYMENT_STRATEGY**: Choose from `rolling`, `blue-green`, or `canary`
- **ENVIRONMENT**: Select `staging` or `production`
- **CANARY_PERCENTAGE**: Set traffic percentage for canary deployments (1-100)
- **RUN_SMOKE_TESTS**: Enable/disable smoke tests after deployment
- **AUTO_ROLLBACK**: Enable automatic rollback on deployment failure

### **Pipeline Stages**

1. **Checkout**: Clone repository and extract commit information
2. **Environment Setup**: Configure Node.js environment
3. **Install Dependencies**: Install npm packages for backend and frontend
4. **Code Quality & Security Checks**: Run linting, security audit, and dependency checks in parallel
5. **Run Tests**: Execute unit and integration tests in parallel
6. **Build**: Build backend and frontend applications in parallel
7. **Build Docker Images**: Create and push Docker images to registry
8. **Deploy**: Execute chosen deployment strategy (rolling, blue-green, or canary)
9. **Smoke Tests**: Validate deployment with smoke tests
10. **Health Check**: Verify application health with automatic rollback on failure
11. **Performance Tests**: Run performance validation

### **Example Usage**

#### Blue-Green Deployment to Production
```groovy
DEPLOYMENT_STRATEGY: blue-green
ENVIRONMENT: production
RUN_SMOKE_TESTS: true
AUTO_ROLLBACK: true
```

#### Canary Deployment with 10% Traffic
```groovy
DEPLOYMENT_STRATEGY: canary
ENVIRONMENT: production
CANARY_PERCENTAGE: 10
RUN_SMOKE_TESTS: true
AUTO_ROLLBACK: true
```

#### Rolling Deployment to Staging
```groovy
DEPLOYMENT_STRATEGY: rolling
ENVIRONMENT: staging
RUN_SMOKE_TESTS: true
AUTO_ROLLBACK: true
```

### **Setup Instructions**

1. **Configure Credentials in Jenkins**:
   - `docker-registry-credentials`: Docker registry username/password
   - `kubeconfig-credentials`: Kubernetes configuration file
   - `slack-webhook`: Slack webhook URL for notifications

2. **Create Pipeline Job**:
   - New Item → Pipeline
   - Configure parameters as described above
   - Pipeline script from SCM: Point to repository Jenkinsfile

3. **Configure Webhooks**:
   - Add GitHub/GitLab webhook to trigger builds on push
   - Webhook URL: `http://jenkins-server/github-webhook/`

### **Advanced Features**

- **Automatic Rollback**: Triggers on health check failures or test failures
- **Git Tagging**: Successful deployments are tagged with `deploy-{commit-sha}`
- **Parallel Execution**: Tests and builds run in parallel for faster execution
- **Coverage Reports**: HTML coverage reports published after tests
- **Artifact Archiving**: Test results archived for historical tracking
- **Clean Workspace**: Automatic cleanup after pipeline completion

### **Deployment Functions**

The Jenkinsfile includes sophisticated deployment functions:

- `deployRolling()`: Executes rolling deployment strategy
- `deployBlueGreen()`: Manages blue-green deployment with traffic switching
- `deployCanary()`: Handles canary deployment with gradual rollout
- `validateDeployment()`: Validates new deployment health
- `validateCanaryHealth()`: Checks canary deployment health
- `performRollback()`: Automatic rollback to previous version
- `sendNotification()`: Sends Slack notifications for pipeline events

For detailed deployment procedures, see [Deployment Guide](docs/DEPLOYMENT_GUIDE.md).

### **GitHub Actions**

The Budget Management API also includes a GitHub Actions workflow for continuous integration and deployment.

1. **Workflow Configuration:** The `.github/workflows/ci.yml` file defines the CI/CD workflow, including steps for checking out code, installing dependencies, running tests, and building the application.
2. **Job Setup:** The workflow is triggered on push and pull request events to the `main` branch.
3. **Automated Testing:** The workflow runs `npm test` to ensure all tests pass before proceeding to the build or deployment stages.
4. **Deployment:** The workflow can be configured to deploy the application to Render or other hosting services using GitHub Actions deployment steps.
5. **Environment Variables:** Use GitHub Secrets to securely manage sensitive information like API keys and database credentials.
6. **Notifications:** Configure GitHub Actions to send notifications to Slack or email on build and deployment statuses.

This setup allows for automated testing and deployment, ensuring that the application is always in a deployable state.

<p align="center">
  <img src="../images/github-actions.png" alt="GitHub Actions" style="border-radius: 8px;">
</p>

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

This project is built with ❤️ by:

- **Son Nguyen** - [hoangsonww](https://github.com/hoangsonww)

For more information about me, you can visit my personal website or connect with me on LinkedIn:

- **Website:** [https://sonnguyenhoang.com](https://sonnguyenhoang.com)
- **Email:** [hoangson091104@gmail.com](mailto:hoangson091104@gmail.com)
- **LinkedIn:** [https://www.linkedin.com/in/hoangsonw](https://www.linkedin.com/in/hoangsonw)
- **GitHub:** [@hoangsonww](https://github.com/hoangsonww)

Feel free to reach out if you have any questions or feedback! 🚀

---

Thank you for using the **Budget Management API**. For questions, feedback, or support, please open an issue or [contact me directly](mailto:hoangson091104@gmail.com).

Created with ❤️ by [Son Nguyen](https://sonnguyenhoang.com) in 2024. All rights reserved.

---

[⬆️ Back to Top](#budget-management-api---a-comprehensive-microservices-based-api-for-managing-budgets-expenses-users-and-more-)
