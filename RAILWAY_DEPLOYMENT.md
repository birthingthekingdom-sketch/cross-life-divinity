# Railway Deployment Guide

## Prerequisites

1. **Railway Account**: Sign up at https://railway.app
2. **GitHub Repository**: Your code is already pushed to GitHub ✅
3. **Environment Variables**: Gather all required secrets

## Step 1: Connect GitHub Repository

1. Go to https://railway.app/dashboard
2. Click **New Project**
3. Select **Deploy from GitHub**
4. Authorize Railway to access your GitHub account
5. Select the `cross-life-divinity` repository
6. Click **Deploy**

## Step 2: Configure Environment Variables

In the Railway dashboard, go to **Variables** and add all required environment variables as listed in the guide.

## Step 3: Configure Build and Deploy Settings

1. Build Command: `pnpm build`
2. Start Command: `node dist/index.js`
3. Node Version: 22.13.0 or latest LTS

## Step 4: Deploy

Click the Deploy button and monitor the build logs.

## Step 5: Configure Custom Domain

Add your domain in Railway Settings → Domain

## Troubleshooting

See full guide in this file for detailed troubleshooting steps.
