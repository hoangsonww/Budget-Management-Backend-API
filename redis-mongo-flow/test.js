const axios = require('axios');

async function testFlow() {
  try {
    console.log('Creating cache entries via POST...');
    let response = await axios.post('http://localhost:3001/data', {
      key: 'session777',
      value: { user: 'jordan', role: 'admin' },
    });
    console.log('POST response:', response.data);

    // Test the case where user123 is not yet stored in Redis
    console.log('Fetching user123...');
    response = await axios.get('http://localhost:3001/data/user123');
    console.log('Response (should be from MongoDB):', response.data);

    // Now user123 should be stored in Redis
    console.log('\nFetching user123 again...');
    response = await axios.get('http://localhost:3001/data/user123');
    console.log('Response (should be from Redis):', response.data);

    // Additional tests
    console.log('\nFetching product456...');
    response = await axios.get('http://localhost:3001/data/product456');
    console.log('Response (should be from MongoDB):', response.data);

    console.log('\nFetching product456 again...');
    response = await axios.get('http://localhost:3001/data/product456');
    console.log('Response (should be from Redis):', response.data);

    console.log('\nRefreshing cache for product456...');
    response = await axios.get('http://localhost:3001/data/product456?refresh=true');
    console.log('Response (forced MongoDB read):', response.data);

    // Test the case where a key is non-existent in MongoDB (invalidKey -- expect an error)
    console.log('\nFetching non-existent key...');
    try {
      response = await axios.get('http://localhost:3001/data/invalidKey');
      console.log('Response (should be 404):', response.data);
    } catch (error) {
      console.log('Expected 404:', error.response ? error.response.data : error.message);
    }

    console.log('\nDeleting session777...');
    response = await axios.delete('http://localhost:3001/data/session777');
    console.log('Delete response:', response.data);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testFlow();
