const express = require('express');
const serverless = require('serverless-http');

// Import your main app
const app = require('../../dist/server.js');

exports.handler = serverless(app);
