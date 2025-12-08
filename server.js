const express = require("express");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit"); 

const app = express();
const PORT = process.env.PORT || 10000;

//  Basic rate limiting: max 60 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,             // 60 requests per minute
});

// Apply rate limiter to all requests
app.use(limiter);

//  Security headers (Helmet)
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "img-src": ["'self'", "data:"],
        "script-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "font-src": ["'self'", "data:"],
        "connect-src": ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Enforce HTTPS in production
app.use((req, res, next) => {
  if (
    req.header("x-forwarded-proto") !== "https" &&
    process.env.NODE_ENV === "production"
  ) {
    return res.redirect(`https://${req.header("host")}${req.url}`);
  }
  next();
});

//  Serve static files from repo root
app.use(express.static(__dirname));

// Default route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "flappy.html"));
});

app.listen(PORT, () => {
  console.log(`Secure Flappy Ball running on port ${PORT}`);
});
