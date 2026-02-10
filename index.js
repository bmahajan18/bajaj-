const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const OFFICIAL_EMAIL = process.env.OFFICIAL_EMAIL || 'bhavya1152.be23@chitkarauniversity.edu.in';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    is_success: true,
    official_email: OFFICIAL_EMAIL
  });
});

// Mathematical helper functions
function generateFibonacci(n) {
  const fibSeries = [0, 1];
  if (n <= 0) return [];
  if (n === 1) return [0];
  
  for (let i = 2; i < n; i++) {
    fibSeries.push(fibSeries[i-1] + fibSeries[i-2]);
  }
  return fibSeries;
}

function isPrime(num) {
  if (num < 2) return false;
  if (num === 2) return true;
  if (num % 2 === 0) return false;
  
  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) return false;
  }
  return true;
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function calculateLCM(arr) {
  if (arr.length === 0) return 0;
  if (arr.length === 1) return arr[0];
  
  let result = arr[0];
  for (let i = 1; i < arr.length; i++) {
    result = lcm(result, arr[i]);
  }
  return result;
}

function calculateHCF(arr) {
  if (arr.length === 0) return 0;
  if (arr.length === 1) return Math.abs(arr[0]);
  
  let result = arr[0];
  for (let i = 1; i < arr.length; i++) {
    result = gcd(result, arr[i]);
  }
  return Math.abs(result);
}

async function getAIResponse(question) {
  try {
    // Try multiple model endpoints
    const models = [
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
    ];
    
    let lastError = null;
    
    for (const url of models) {
      try {
        const response = await axios.post(url, {
          contents: [{
            parts: [{
              text: `Answer this question with only a single word: ${question}`
            }]
          }]
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000
        });

        if (response.data.candidates && 
            response.data.candidates[0] && 
            response.data.candidates[0].content &&
            response.data.candidates[0].content.parts &&
            response.data.candidates[0].content.parts[0]) {
          
          let answer = response.data.candidates[0].content.parts[0].text.trim();
          // Extract only the first word if response has multiple words
          answer = answer.split(/\s+/)[0];
          return answer.replace(/[^a-zA-Z]/g, '');
        }
      } catch (modelError) {
        lastError = modelError;
        continue;
      }
    }
    
    throw lastError || new Error('No available AI model');
  } catch (error) {
    console.error('AI API Error:', error.response?.data || error.message);
    throw new Error('AI processing failed');
  }
}

// Input validation middleware
function validateBFHLRequest(req, res, next) {
  const { fibonacci, prime, lcm, hcf, AI } = req.body;
  
  // Check if exactly one operation is provided
  const operations = [fibonacci, prime, lcm, hcf, AI];
  const definedOperations = operations.filter(op => op !== undefined);
  
  if (definedOperations.length !== 1) {
    return res.status(400).json({
      is_success: false,
      error: 'Request must contain exactly one of: fibonacci, prime, lcm, hcf, AI'
    });
  }
  
  // Validate fibonacci
  if (fibonacci !== undefined) {
    if (!Number.isInteger(fibonacci) || fibonacci < 0) {
      return res.status(400).json({
        is_success: false,
        error: 'fibonacci must be a non-negative integer'
      });
    }
  }
  
  // Validate prime
  if (prime !== undefined) {
    if (!Array.isArray(prime)) {
      return res.status(400).json({
        is_success: false,
        error: 'prime must be an array of numbers'
      });
    }
    if (!prime.every(num => typeof num === 'number' && !isNaN(num))) {
      return res.status(400).json({
        is_success: false,
        error: 'prime array must contain only numbers'
      });
    }
  }
  
  // Validate lcm
  if (lcm !== undefined) {
    if (!Array.isArray(lcm)) {
      return res.status(400).json({
        is_success: false,
        error: 'lcm must be an array of numbers'
      });
    }
    if (lcm.length < 2) {
      return res.status(400).json({
        is_success: false,
        error: 'lcm array must contain at least 2 numbers'
      });
    }
    if (!lcm.every(num => typeof num === 'number' && !isNaN(num))) {
      return res.status(400).json({
        is_success: false,
        error: 'lcm array must contain only numbers'
      });
    }
    if (lcm.some(num => num === 0)) {
      return res.status(400).json({
        is_success: false,
        error: 'lcm array cannot contain zero'
      });
    }
  }
  
  // Validate hcf
  if (hcf !== undefined) {
    if (!Array.isArray(hcf)) {
      return res.status(400).json({
        is_success: false,
        error: 'hcf must be an array of numbers'
      });
    }
    if (hcf.length < 2) {
      return res.status(400).json({
        is_success: false,
        error: 'hcf array must contain at least 2 numbers'
      });
    }
    if (!hcf.every(num => typeof num === 'number' && !isNaN(num))) {
      return res.status(400).json({
        is_success: false,
        error: 'hcf array must contain only numbers'
      });
    }
  }
  
  // Validate AI
  if (AI !== undefined) {
    if (typeof AI !== 'string' || AI.trim() === '') {
      return res.status(400).json({
        is_success: false,
        error: 'AI must be a non-empty string'
      });
    }
  }
  
  next();
}

// Main BFHL endpoint
app.post('/bfhl', validateBFHLRequest, async (req, res) => {
  try {
    const { fibonacci, prime, lcm, hcf, AI } = req.body;
    let result;

    if (fibonacci !== undefined) {
      result = generateFibonacci(fibonacci);
    } else if (prime !== undefined) {
      result = prime.filter(num => isPrime(num));
    } else if (lcm !== undefined) {
      result = calculateLCM(lcm);
    } else if (hcf !== undefined) {
      result = calculateHCF(hcf);
    } else if (AI !== undefined) {
      result = await getAIResponse(AI);
    }

    res.json({
      is_success: true,
      official_email: OFFICIAL_EMAIL,
      data: result
    });
  } catch (error) {
    console.error('Error in /bfhl:', error);
    res.status(500).json({
      is_success: false,
      error: 'Internal server error'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    is_success: false,
    error: 'Endpoint not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    is_success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`BFHL API: http://localhost:${PORT}/bfhl`);
});

module.exports = app;

