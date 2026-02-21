const express = require('express');
const serverless = require('serverless-http');

// Try this path instead
const app = require('../../dist/index.js');

// Create the serverless handler
exports.handler = serverless(app);
