const express = require('express');
const serverless = require('serverless-http');

// Import your main app
const app = require('../../dist/public/index.js');

exports.handler = serverless(app);
