const express = require('express');
const serverless = require('serverless-http');

// Import your main Express app
const app = require('../../dist/public/index.js');

// Create the serverless handler
exports.handler = serverless(app);
