const axios = require('axios');

async function testEndpoint() {
  try {
    console.log('Testing POST /bfhl with AI query...');
    
    const response = await axios.post('http://localhost:3000/bfhl', {
      AI: "What is the capital city of Maharashtra?"
    });
    
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testEndpoint();

