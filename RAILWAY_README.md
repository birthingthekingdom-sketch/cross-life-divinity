# Cross Life School of Divinity - Railway Deployment

This guide provides everything you need to deploy the Cross Life School of Divinity platform to Railway.

## Quick Start

### 1. Create Railway Account
- Go to https://railway.app
- Sign up with GitHub account
- Create a new project

### 2. Deploy from GitHub
- Select "Deploy from GitHub"
- Choose `birthingthekingdom-sketch/cross-life-divinity`
- Railway will automatically detect the configuration

### 3. Add Environment Variables
Copy all variables from your Manus dashboard and add them to Railway:
- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Session signing key
- `VITE_APP_ID` - Manus OAuth app ID
- `STRIPE_SECRET_KEY` - Stripe test/live key
- And all other variables listed in RAILWAY_DEPLOYMENT.md

### 4. Deploy
Click "Deploy" and wait for the build to complete.

## What's Included

- ✅ Full React + Express + tRPC stack
- ✅ 24 theological courses with 200+ lessons
- ✅ Student enrollment and progress tracking
- ✅ Stripe payment integration
- ✅ Email/password and OAuth authentication
- ✅ Admin dashboard
- ✅ Certificate generation
- ✅ Content protection

## Configuration Files

- `railway.json` - Railway build and deploy configuration
- `Procfile` - Process definition for Railway
- `.railwayignore` - Files to exclude from deployment
- `RAILWAY_DEPLOYMENT.md` - Detailed deployment guide

## Important Notes

### OAuth Callback URL
After deploying to Railway, update your OAuth callback URL in Manus:
```
https://your-railway-domain.railway.app/api/oauth/callback
```

### Database
- Option 1: Use Railway's MySQL database (recommended for quick setup)
- Option 2: Connect to your existing database via `DATABASE_URL`

### Custom Domain
1. Purchase domain or use existing domain
2. In Railway Settings → Domain, add your domain
3. Update DNS records as instructed
4. Wait for SSL certificate to be issued

### Environment Variables
All environment variables from Manus must be added to Railway:
- Copy from your Manus project settings
- Add to Railway Variables section
- Restart deployment after adding variables

## Troubleshooting

### Build Fails
Check the build logs in Railway dashboard. Common issues:
- Missing environment variables
- Node version incompatibility
- Dependency issues

### Application Won't Start
Check application logs:
1. Go to Railway dashboard
2. Click on your project
3. View logs in the Logs tab
4. Look for error messages

### OAuth Not Working
1. Verify callback URL is correct
2. Check `VITE_APP_ID` is set
3. Ensure `OAUTH_SERVER_URL` points to correct endpoint

### Database Connection Error
1. Verify `DATABASE_URL` format
2. Check database is accessible from Railway
3. Ensure user has proper permissions

## Monitoring

Railway provides built-in monitoring:
- **Logs**: View application output in real-time
- **Metrics**: Monitor CPU, memory, network usage
- **Alerts**: Set up notifications for errors

## Scaling

As traffic grows:
1. Upgrade Railway plan for more resources
2. Increase memory allocation
3. Add database replicas if needed
4. Implement caching strategies

## Support

- Railway Docs: https://docs.railway.app
- Railway Support: https://railway.app/support
- Project Issues: Check GitHub repository

## Next Steps

1. Deploy to Railway
2. Test OAuth login
3. Test payment flow with Stripe test cards
4. Monitor application logs
5. Set up custom domain
6. Configure email notifications (optional)

## Cost Estimation

Railway pricing is usage-based:
- Free tier: $5 credit/month
- Paid tier: $0.000463/hour for compute
- Database: MySQL included in free tier

For a small to medium deployment:
- Estimated cost: $10-30/month

See https://railway.app/pricing for detailed pricing.
