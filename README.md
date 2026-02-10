# BFHL REST API

A production-ready REST API service with mathematical operations and AI capabilities, hosted on Render.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Request Examples](#request-examples)
- [Response Format](#response-format)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Testing](#testing)

## 🎯 Overview
This API provides five core functionalities:
- **Fibonacci Series**: Generate Fibonacci sequence up to n terms
- **Prime Filter**: Extract prime numbers from an array
- **LCM Calculator**: Find Least Common Multiple of numbers
- **HCF Calculator**: Find Highest Common Factor of numbers
- **AI Integration**: Get single-word answers using Google Gemini

## ✨ Features
- ✅ Strict API response structure
- ✅ Correct HTTP status codes
- ✅ Robust input validation
- ✅ Graceful error handling
- ✅ Security guardrails
- ✅ CORS enabled
- ✅ Production-ready deployment

## 🔗 API Endpoints

### GET /health
Health check endpoint to verify API status.

**Response:**
```json
{
  "is_success": true,
  "official_email": "bhavya1152.be23@chitkarauniversity.edu.in"
}
```

### POST /bfhl
Main functionality endpoint. Accepts exactly one operation parameter.

**Parameters (one required):**
| Parameter | Type | Description |
|-----------|------|-------------|
| fibonacci | Integer | Generate n terms of Fibonacci series |
| prime | Integer Array | Filter prime numbers from array |
| lcm | Integer Array (min 2) | Calculate LCM of numbers |
| hcf | Integer Array (min 2) | Calculate HCF of numbers |
| AI | String | Get single-word AI response |

## 📝 Request Examples

### Fibonacci
**Request:**
```json
{
  "fibonacci": 7
}
```

**Response:**
```json
{
  "is_success": true,
  "official_email": "bhavya1152.be23@chitkarauniversity.edu.in",
  "data": [0, 1, 1, 2, 3, 5, 8]
}
```

### Prime Filter
**Request:**
```json
{
  "prime": [2, 4, 7, 9, 11, 13, 20]
}
```

**Response:**
```json
{
  "is_success": true,
  "official_email": "bhavya1152.be23@chitkarauniversity.edu.in",
  "data": [2, 7, 11, 13]
}
```

### LCM Calculation
**Request:**
```json
{
  "lcm": [12, 18, 24]
}
```

**Response:**
```json
{
  "is_success": true,
  "official_email": "bhavya1152.be23@chitkarauniversity.edu.in",
  "data": 72
}
```

### HCF Calculation
**Request:**
```json
{
  "hcf": [24, 36, 60]
}
```

**Response:**
```json
{
  "is_success": true,
  "official_email": "bhavya1152.be23@chitkarauniversity.edu.in",
  "data": 12
}
```

### AI Integration
**Request:**
```json
{
  "AI": "What is the capital city of Maharashtra?"
}
```

**Response:**
```json
{
  "is_success": true,
  "official_email": "bhavya1152.be23@chitkarauniversity.edu.in",
  "data": "Mumbai"
}
```

## 📊 Response Format

### Success Response
```json
{
  "is_success": true,
  "official_email": "your.email@chitkarauniversity.edu.in",
  "data": <result>
}
```

### Error Response
```json
{
  "is_success": false,
  "error": "Error message description"
}
```

### HTTP Status Codes
| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request (validation error) |
| 404 | Endpoint not found |
| 500 | Internal server error |

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google Gemini API key

### Local Setup

1. **Clone the repository**
```bash
git clone https://github.com/your-username/bfhl-api.git
cd bfhl-api
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file:
```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key
OFFICIAL_EMAIL=your.email@chitkarauniversity.edu.in
```

4. **Start the server**
```bash
npm start
```

5. **Test the API**
```bash
# Health check
curl http://localhost:3000/health

# Test fibonacci
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"fibonacci": 7}'
```

## ☁️ Deployment

### Deploy to Render

1. **Push to GitHub**
   - Create a public repository
   - Push all files:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/bfhl-api.git
   git push -u origin main
   ```

2. **Deploy on Render**
   - Sign in to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" and select "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: bfhl-api
     - **Build Command**: npm install
     - **Start Command**: node index.js
   - Add Environment Variables:
     - `GEMINI_API_KEY`: your_gemini_api_key
     - `OFFICIAL_EMAIL`: your.email@chitkarauniversity.edu.in
   - Click "Create Web Service"

3. **Test Deployed API**
   ```
   https://your-service-name.onrender.com/health
   https://your-service-name.onrender.com/bfhl
   ```

## 🧪 Testing

### Using curl

```bash
# 1. Health Check
curl https://your-api-url.onrender.com/health

# 2. Fibonacci
curl -X POST https://your-api-url.onrender.com/bfhl \
  -H "Content-Type: application/json" \
  -d '{"fibonacci": 10}'

# 3. Prime Filter
curl -X POST https://your-api-url.onrender.com/bfhl \
  -H "Content-Type: application/json" \
  -d '{"prime": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}'

# 4. LCM Calculation
curl -X POST https://your-api-url.onrender.com/bfhl \
  -H "Content-Type: application/json" \
  -d '{"lcm": [4, 6, 8]}'

# 5. HCF Calculation
curl -X POST https://your-api-url.onrender.com/bfhl \
  -H "Content-Type: application/json" \
  -d '{"hcf": [48, 64, 96]}'

# 6. AI Integration
curl -X POST https://your-api-url.onrender.com/bfhl \
  -H "Content-Type: application/json" \
  -d '{"AI": "What is the capital of France?"}'
```

### Using Postman/Insomnia
1. Create a new POST request
2. Set URL: `https://your-api-url.onrender.com/bfhl`
3. Set Headers: `Content-Type: application/json`
4. Set Body (raw JSON):
   ```json
   {
     "fibonacci": 5
   }
   ```

## 🔒 Security Features
- Input validation for all endpoints
- Type checking for all parameters
- Array bounds checking
- Error message sanitization
- CORS enabled for cross-origin requests
- No sensitive data exposure in error messages

## 📁 Project Structure
```
bfhl-api/
├── .env                 # Environment variables
├── .gitignore          # Git ignore rules
├── Procfile           # Render deployment config
├── README.md          # Documentation
├── index.js           # Main application file
├── package.json       # Dependencies and scripts
└── TODO.md            # Development tasks
```

## 🛠️ Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **HTTP Client**: Axios
- **AI Integration**: Google Gemini API
- **Deployment**: Render

## 📄 License
MIT License - feel free to use and modify!

## 👨‍💻 Author
**Bhavya Mahajan**
- Chitkara University Email: bhavya1152.be23@chitkarauniversity.edu.in
- GitHub: [Your GitHub Username]

## 🙏 Acknowledgments
- Google Gemini API for AI capabilities
- Render for free web hosting
- Express.js community

