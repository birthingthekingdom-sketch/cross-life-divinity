const express = require('express');
const serverless = require('serverless-http');

// Import your main Express app
// This path should point to your compiled server file
const app = require('../../dist/public/index.js');

// Create the serverless handler
exports.handler = serverless(app);
