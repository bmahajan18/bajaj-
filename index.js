const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const OFFICIAL_EMAIL = process.env.OFFICIAL_EMAIL || 'bhavya1152.be23@chitkarauniversity.edu.in';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    is_success: true,
    official_email: OFFICIAL_EMAIL
  });
});

function generateFibonacci(n) {
  if (n <= 0) return [];
  if (n === 1) return [0];
  const fib = [0, 1];
  for (let i = 2; i < n; i++) {
    fib.push(fib[i-1] + fib[i-2]);
  }
  return fib;
}

function isPrime(num) {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
}

function gcd(a, b) {
  while (b) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return Math.abs(a);
}

function lcm(a, b) {
  return Math.abs(a * b) / gcd(a, b);
}

function calculateLCM(arr) {
  let result = arr[0];
  for (let i = 1; i < arr.length; i++) {
    result = lcm(result, arr[i]);
  }
  return result;
}

function calculateHCF(arr) {
  let result = arr[0];
  for (let i = 1; i < arr.length; i++) {
    result = gcd(result, arr[i]);
  }
  return Math.abs(result);
}

async function getGeminiResponse(prompt) {
  try {
    const modelsToTry = [
      "gemini-1.5-flash",
      "gemini-1.5-pro"
    ];

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return text.trim().split(/\s+/)[0];
      } catch (err) {
        console.log(`${modelName} failed:`, err.message);
      }
    }

    return "API_UNAVAILABLE";
  } catch (error) {
    console.error("Gemini Error:", error.message);
    return "API_UNAVAILABLE";
  }
}



app.post('/bfhl', async (req, res) => {
  const { fibonacci, prime, lcm, hcf, AI } = req.body;
  
  if (!fibonacci && !prime && !lcm && !hcf && !AI) {
    return res.status(400).json({
      is_success: false,
      error: 'Request must contain exactly one of: fibonacci, prime, lcm, hcf, AI'
    });
  }

  const operations = [fibonacci, prime, lcm, hcf, AI];
  const defined = operations.filter(op => op !== undefined);
  if (defined.length !== 1) {
    return res.status(400).json({
      is_success: false,
      error: 'Request must contain exactly one of: fibonacci, prime, lcm, hcf, AI'
    });
  }

  try {
    let result;

    if (fibonacci !== undefined) {
      if (!Number.isInteger(fibonacci) || fibonacci < 0) {
        return res.status(400).json({
          is_success: false,
          error: 'fibonacci must be a non-negative integer'
        });
      }
      result = generateFibonacci(fibonacci);
    } else if (prime !== undefined) {
      if (!Array.isArray(prime)) {
        return res.status(400).json({
          is_success: false,
          error: 'prime must be an array'
        });
      }
      result = prime.filter(isPrime);
    } else if (lcm !== undefined) {
      if (!Array.isArray(lcm) || lcm.length < 2) {
        return res.status(400).json({
          is_success: false,
          error: 'lcm must be an array with at least 2 numbers'
        });
      }
      result = calculateLCM(lcm);
    } else if (hcf !== undefined) {
      if (!Array.isArray(hcf) || hcf.length < 2) {
        return res.status(400).json({
          is_success: false,
          error: 'hcf must be an array with at least 2 numbers'
        });
      }
      result = calculateHCF(hcf);
    } else if (AI !== undefined) {
      result = await getGeminiResponse(AI);
    }

    res.json({
      is_success: true,
      official_email: OFFICIAL_EMAIL,
      data: result
    });
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({
      is_success: false,
      error: 'Internal server error'
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    is_success: false,
    error: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
