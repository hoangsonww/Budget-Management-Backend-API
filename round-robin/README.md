# **Round-Robin Load Balancer Demo**

This project demonstrates a **Round-Robin Load Balancer** using **Node.js** and **Express.js**. It features multiple backend servers and a load balancer to evenly distribute incoming requests across the servers. Additionally, it uses **MongoDB** and **Redis** for database and caching support.

## **Table of Contents**

1. [Overview](#overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)
4. [Project Structure](#project-structure)
5. [Setup Instructions](#setup-instructions)
6. [How It Works](#how-it-works)
7. [Testing](#testing)
8. [Improvements](#improvements)

## **Overview**

This demo consists of:
1. **Backend Servers**:
  - Three backend servers (`http://localhost:5001`, `http://localhost:5002`, `http://localhost:5003`) serve incoming requests.
  - Each server responds with its port to indicate which server handled the request.
2. **Load Balancer**:
  - Routes incoming requests to the backend servers using a **Round-Robin Algorithm**.
  - Ensures requests are distributed evenly among servers.

---

## **Features**

- **Round-Robin Load Balancing**:
  - Routes requests sequentially across multiple backend servers.
- **Dynamic Routing**:
  - Middleware to dynamically choose the next backend server.
- **MongoDB Integration**:
  - Demonstrates MongoDB connection and readiness for real-world applications.
- **Redis Integration**:
  - Demonstrates Redis connection and readiness for caching.

## **Technologies Used**

| **Technology** | **Purpose**                                          |
|----------------|------------------------------------------------------|
| **Node.js**    | JavaScript runtime for building the application.     |
| **Express.js** | Web framework for backend servers and load balancer. |
| **MongoDB**    | Database connection demonstration.                   |
| **Redis**      | In-memory data store for caching.                    |
| **http-proxy** | Proxy server library for request forwarding.         |

## **Project Structure**

```mermaid
flowchart TD
    RR[round-robin/]
    RR --> ConfigDir[config/]
    ConfigDir --> ConfigJS[config.js — MongoDB/Redis configuration]
    RR --> Docker[docker/]
    RR --> Index[index.js — Round-robin load balancer]
    RR --> Package[package.json — Dependencies and scripts]
    RR --> Docs[README.md — Project documentation]
```

## **Setup Instructions**

### **Prerequisites**

- Node.js (>= 14.x)
- MongoDB (local or cloud instance)
- Redis (local or cloud instance)

### **Installation**

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/round-robin-demo.git
   cd round-robin-demo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
  - Create a file `config/config.js`:
    ```javascript
    module.exports = {
      mongoURI: 'mongodb://localhost:27017/demoDB',
      redisHost: '127.0.0.1',
      redisPort: 6379,
    };
    ```

4. Start the application:
   ```bash
   node server.js
   ```

## **How It Works**

1. **Backend Servers**:
  - Each backend server runs on a different port (`5001`, `5002`, `5003`).
  - Responds to incoming requests with a message indicating its port.

2. **Round-Robin Load Balancer**:
  - Listens on port `3000` (default) and distributes incoming requests to backend servers using a round-robin algorithm.
  - Routes requests to backend servers sequentially to balance the load evenly.

3. **Health Checks**:
  - Periodically sends test requests to backend servers to ensure they are responsive.

## **Testing**

### **Access the Load Balancer**

1. Start the application:
   ```bash
   node server.js
   ```

2. Send a request to the load balancer:
   ```bash
   curl http://localhost:3000
   ```
  - The response will show which backend server handled the request (e.g., `Hello from backend server running on port 5001`).

3. Repeat the request to see round-robin distribution:
   ```bash
   curl http://localhost:3000
   curl http://localhost:3000
   ```
  - Responses will alternate between ports `5001`, `5002`, and `5003`.

### **Periodic Health Checks**

The application sends a test request to backend servers every 5 seconds and logs the responses:
```bash
Sending test request to: http://localhost:5001
Response from http://localhost:5001: Hello from backend server running on port 5001
```

## **Improvements**

1. **Dynamic Server Pool**:
  - Allow the load balancer to dynamically add or remove backend servers.

2. **Health Check Failover**:
  - Exclude unresponsive servers from the round-robin rotation.

3. **Caching with Redis**:
  - Cache frequent responses in Redis for faster access.

4. **Containerization**:
  - Use Docker to containerize the load balancer and backend servers.

5. **Scaling**:
  - Deploy with Kubernetes to scale the application and manage server instances.

---

This demo provides a simple, extensible starting point for learning load balancing and distributed systems. Let me know if you need assistance implementing additional features! 🚀
