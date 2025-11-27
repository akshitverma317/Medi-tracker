# Netlify Deployment Guide for Medicine Tracker

## Problem Solved

The 404 error you encountered (`/patients/add` returning 404) was caused by Netlify trying to serve a physical file for client-side routes. This is now fixed with proper redirect configuration.

## Files Added

1. **netlify.toml** - Main Netlify configuration file
2. **public/_redirects** - Backup redirect rules (Netlify supports both methods)

## How It Works

Both files tell Netlify to redirect all requests to `index.html` with a 200 status code. This allows React Router to handle routing on the client side.

## Deployment Steps

### Option 1: Automatic Deployment (Recommended)

1. **Push the new files to your repository**:
   ```bash
   git add netlify.toml public/_redirects
   git commit -m "Fix: Add Netlify SPA routing configuration"
   git push
   ```

2. **Netlify will automatically redeploy** with the new configuration

3. **Wait for deployment to complete** (usually 1-2 minutes)

4. **Test your application** - Navigate to `/patients/add` directly and it should work now

### Option 2: Manual Deployment

If you're deploying manually:

1. **Build the application locally**:
   ```bash
   npm run build
   ```

2. **Deploy the dist folder** to Netlify via:
   - Netlify CLI: `netlify deploy --prod`
   - Drag and drop the `dist` folder to Netlify dashboard
   - Connect your Git repository

## Verification

After deployment, test these scenarios:

1. **Direct URL access**: Visit `https://your-app.netlify.app/patients/add` directly
   - ✅ Should load the page correctly
   - ❌ Previously showed 404

2. **Refresh on any route**: Navigate to any page and hit refresh
   - ✅ Should stay on the same page
   - ❌ Previously showed 404

3. **Browser back/forward**: Use browser navigation
   - ✅ Should work smoothly

## Configuration Details

### netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

- **command**: Tells Netlify how to build your app
- **publish**: Specifies the output directory (Vite uses `dist`)
- **redirects**: Redirects all routes to index.html for SPA routing

### public/_redirects

```
/*    /index.html   200
```

Simple redirect rule that achieves the same result.

## Troubleshooting

### Issue: Still getting 404 errors

**Solution**:
1. Clear Netlify cache and redeploy:
   ```bash
   netlify deploy --prod --clear-cache
   ```

2. Check Netlify build logs for errors

3. Verify `netlify.toml` is in the root of your repository

### Issue: Build fails on Netlify

**Solution**:
1. Check Node version in Netlify settings (should be 18 or higher)
2. Verify build command: `npm run build`
3. Verify publish directory: `dist`

### Issue: Environment variables needed

**Solution**:
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add any required variables (e.g., `VITE_API_URL`)
3. Redeploy

## Build Settings in Netlify Dashboard

If you prefer to configure via the Netlify dashboard:

1. **Site Settings** → **Build & Deploy** → **Build Settings**
2. Set:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 20.x (or 18.x minimum)

## Performance Optimization

The `netlify.toml` includes:

- **Security headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **Cache headers**: Static assets cached for 1 year
- **Immutable assets**: JS, CSS, and fonts marked as immutable

## Custom Domain

To add a custom domain:

1. Go to **Domain Settings** in Netlify
2. Add your custom domain
3. Update DNS records as instructed
4. Enable HTTPS (automatic with Netlify)

## Continuous Deployment

Your site is now set up for continuous deployment:

- **Push to main branch** → Automatic deployment
- **Pull request** → Deploy preview (if enabled)
- **Rollback** → Available in Netlify dashboard

## Additional Resources

- [Netlify SPA Documentation](https://docs.netlify.com/routing/redirects/rewrites-proxies/#history-pushstate-and-single-page-apps)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#netlify)
- [React Router with Netlify](https://ui.dev/react-router-cannot-get-url-refresh)

## Support

If you continue to experience issues:

1. Check Netlify build logs
2. Verify all files are committed to Git
3. Test locally with `npm run build && npm run preview`
4. Contact Netlify support with build logs

---

**Your application should now work correctly on Netlify!** 🎉
