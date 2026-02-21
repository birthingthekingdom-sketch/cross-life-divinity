const express = require('express');
const serverless = require('serverless-http');

// Import your main Express app
// Adjust this path to where your main app file is located
const app = require('../../dist/public/index.js');

// Create a serverless handler
exports.handler = serverless(app); 
