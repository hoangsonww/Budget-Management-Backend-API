# Testing the Redis-MongoDB Flow

The Redis-Mongo Flow:

1. First, the user sends a request to find the data associated with a specific key.
2. The system will first check if the data is available in the Redis cache.
3. If yes, the system will return the data from the cache. 
4. If no, the system will query the MongoDB database to get the data.
5. The system will then also store the data in the Redis cache for future use and return the data to the user.
6. If the key is non-existent also in MongoDB, the system will return a message to the user that the data is not available.

Steps to run the test:

1. First, start the Redis and MongoDB services.

    ```bash
    brew services start mongodb-community
    ```
    
    ```bash
    redis-server
    ```

2. Populate the MongoDB database with the data.

    ```bash
    node seed.js
    ```
   
3. Establish connection to Redis and MongoDB.

    ```bash
    node app.js
    ```
    
    The `app.js` file will establish a simple Express.js server with connections to Redis and MongoDB. 
    
    It also defines API endpoints to read, write, and delete cache entries:
    - `GET /data/:key` fetches a key (with optional `?refresh=true` to bypass cache).
    - `POST /data` upserts a payload into MongoDB and updates Redis.
    - `DELETE /data/:key` removes a key from MongoDB and Redis.
    - `GET /stats` shows cache hits/misses.
    
    It also implements the core logic of the Redis-MongoDB flow mentioned above.

4. Test the flow

    ```bash
    node test.js
    ```

### **Run With Docker Compose**

```bash
docker compose -f docker/docker-compose.yml up --build
```
   
    Expected output:
    ```
    Fetching user123...
    Response (should be from MongoDB): {
    source: 'redis',
    data: {
    _id: '666bdfa1cc0a9919daaafd33',
    key: 'user123',
    value: { name: 'Alice', age: 30 }
    }
    }
    
    Fetching user123 again...
    Response (should be from Redis): {
    source: 'redis',
    data: {
    _id: '666bdfa1cc0a9919daaafd33',
    key: 'user123',
    value: { name: 'Alice', age: 30 }
    }
    }
    
    Fetching non-existent key...
    Error: { message: 'Data not found' }
   ```
   
---
   
