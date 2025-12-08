const express = require("express");
const path = require("path");
const helmet = require("helmet");

const app = express();
const PORT = process.env.PORT || 3001;

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "img-src": ["'self'", "data:"],
        "script-src": ["'self'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "font-src": ["'self'"],
        "connect-src": ["'self'"]
      }
    },
    crossOriginEmbedderPolicy: false
  })
);

// Force HTTPS (important for security)
app.use((req, res, next) => {
  if (req.header("x-forwarded-proto") !== "https" && process.env.NODE_ENV === "production") {
    return res.redirect(`https://${req.header("host")}${req.url}`);
  }
  next();
});

// Serve static files (your game files)
app.use(express.static(path.join(__dirname, "public")));

// Default page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "flappy.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`Secure Flappy Ball running on port ${PORT}`);
});
