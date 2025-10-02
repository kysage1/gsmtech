# 🚀 Deployment Guide - GSM Technology E-Commerce Platform

## Quick Deployment Options

### 1. GitHub Pages (Recommended - Free & Easy)

**Steps:**
```bash
# 1. Ensure you're on the correct branch
git branch

# 2. Add all files
git add .

# 3. Commit changes
git commit -m "Deploy GSM Technology e-commerce website"

# 4. Push to GitHub
git push origin main
```

**Enable GitHub Pages:**
1. Go to your repository on GitHub
2. Click "Settings" → "Pages"
3. Under "Source", select branch: `main`
4. Click "Save"
5. Your site will be live at: `https://yourusername.github.io/repositoryname/`

---

### 2. Netlify (Free, Custom Domain Support)

**Method A: Git Integration**
1. Go to https://app.netlify.com
2. Click "New site from Git"
3. Connect to your GitHub repository
4. Build settings:
   - Build command: (leave empty)
   - Publish directory: `/`
5. Click "Deploy site"

**Method B: Drag & Drop**
1. Go to https://app.netlify.com/drop
2. Drag your project folder
3. Instant deployment!

**Custom Domain (Optional):**
1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Follow DNS configuration instructions

---

### 3. Vercel (Free, Excellent Performance)

**Using Vercel CLI:**
```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? gsmtechnology
# - In which directory is your code? ./
# - Auto-detected project settings? Yes
```

**Using Vercel Dashboard:**
1. Go to https://vercel.com
2. Click "New Project"
3. Import your Git repository
4. Click "Deploy"

---

### 4. Traditional Web Hosting (cPanel, FTP)

**Via FTP:**
1. Connect to your hosting via FTP client (FileZilla, etc.)
2. Navigate to `public_html` or `www` directory
3. Upload all files from your local project
4. Ensure file permissions:
   - Files: 644
   - Directories: 755
5. Access via your domain: `https://yourdomain.com`

**Via cPanel:**
1. Login to cPanel
2. Open "File Manager"
3. Navigate to `public_html`
4. Click "Upload"
5. Select all project files
6. Extract if uploaded as zip

---

### 5. Firebase Hosting (Free, Fast CDN)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init hosting

# Prompts:
# - What do you want to use as your public directory? (press Enter for current directory)
# - Configure as a single-page app? No
# - Set up automatic builds and deploys with GitHub? (Optional)

# Deploy
firebase deploy
```

---

### 6. AWS S3 + CloudFront (Scalable)

**Steps:**
1. Create S3 bucket
2. Enable static website hosting
3. Upload all files
4. Set bucket policy for public access
5. (Optional) Set up CloudFront CDN
6. Access via S3 URL or CloudFront domain

**Using AWS CLI:**
```bash
# Install AWS CLI
pip install awscli

# Configure AWS credentials
aws configure

# Sync files to S3
aws s3 sync . s3://your-bucket-name --acl public-read
```

---

## Environment-Specific Configurations

### For Subdirectory Deployment

If deploying to a subdirectory (e.g., `https://example.com/shop/`):

1. Update all absolute paths in HTML files:
   ```html
   <!-- Before -->
   <link rel="stylesheet" href="/css/main.css">
   
   <!-- After -->
   <link rel="stylesheet" href="/shop/css/main.css">
   ```

2. Update JavaScript file paths in `js/main.js`:
   ```javascript
   const CONFIG = {
     productsFile: '/shop/products.json',
     // ...
   };
   ```

---

## Post-Deployment Checklist

After deploying, verify:

- [ ] Home page loads correctly
- [ ] All images display properly
- [ ] Navigation links work
- [ ] Product listing page shows products
- [ ] Product detail pages load
- [ ] Search functionality works
- [ ] Cart adds/removes items
- [ ] Language selector changes language
- [ ] Currency selector changes prices
- [ ] Blog section displays
- [ ] Admin dashboard accessible
- [ ] All info pages load (About, Privacy, etc.)
- [ ] Site is responsive on mobile
- [ ] No console errors in browser

---

## Custom Domain Setup

### For Netlify:
1. Domain settings → Add custom domain
2. Update DNS records at your registrar:
   ```
   Type: CNAME
   Name: www
   Value: your-site.netlify.app
   ```

### For Vercel:
1. Project settings → Domains → Add
2. Follow DNS configuration instructions

### For GitHub Pages:
1. Settings → Pages → Custom domain
2. Add CNAME record:
   ```
   Type: CNAME
   Name: www
   Value: yourusername.github.io
   ```

---

## SSL/HTTPS Setup

### GitHub Pages:
- Automatic HTTPS (after DNS propagation)
- Enable in Settings → Pages → "Enforce HTTPS"

### Netlify & Vercel:
- Automatic SSL certificates (Let's Encrypt)
- No configuration needed

### Traditional Hosting:
- Install SSL certificate via cPanel or hosting panel
- Or use Let's Encrypt (free)

---

## Performance Optimization

### Before Deployment:

1. **Minify CSS:**
   ```bash
   # Using cssnano
   npx cssnano css/main.css css/main.min.css
   ```

2. **Minify JavaScript:**
   ```bash
   # Using terser
   npx terser js/main.js -o js/main.min.js
   ```

3. **Optimize Images:**
   - Use WebP format where possible
   - Compress with tools like TinyPNG
   - Set appropriate dimensions

4. **Enable Caching:**
   Add `.htaccess` for Apache:
   ```apache
   <IfModule mod_expires.c>
     ExpiresActive On
     ExpiresByType image/jpg "access plus 1 year"
     ExpiresByType image/jpeg "access plus 1 year"
     ExpiresByType image/png "access plus 1 year"
     ExpiresByType text/css "access plus 1 month"
     ExpiresByType application/javascript "access plus 1 month"
   </IfModule>
   ```

---

## Monitoring & Analytics

### Google Analytics:
Add before `</head>` in all HTML files:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## Troubleshooting

### Issue: 404 Errors on Page Refresh
**Solution:** Configure server for SPA routing or use hash routing

### Issue: Images Not Loading
**Solution:** Check file paths and ensure images are uploaded

### Issue: CORS Errors
**Solution:** Deploy to a web server instead of opening files directly

### Issue: JavaScript Not Working
**Solution:** Check browser console for errors, verify file paths

---

## Maintenance

### Regular Updates:
- Update product data in `products.json`
- Add new blog posts
- Monitor and respond to support requests
- Update prices and inventory

### Backup:
- Keep regular backups of `products.json`
- Backup `data/` directory
- Version control with Git

---

## Security Best Practices

For production deployment:
1. Use HTTPS (SSL certificate)
2. Implement Content Security Policy (CSP)
3. Add rate limiting
4. Sanitize all user inputs
5. Use environment variables for sensitive data
6. Regular security updates
7. Monitor for vulnerabilities

---

## Support & Help

If you encounter issues:
1. Check browser console for errors
2. Verify all files are uploaded
3. Check file permissions
4. Review deployment logs
5. Test in incognito/private mode

---

**Good luck with your deployment! 🚀**
