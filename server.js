const express = require("express");
const path = require("path");
const helmet = require("helmet");

const app = express();
const PORT = process.env.PORT || 10000;

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

// Force HTTPS
app.use((req, res, next) => {
  if (
    req.header("x-forwarded-proto") !== "https" &&
    process.env.NODE_ENV === "production"
  ) {
    return res.redirect(`https://${req.header("host")}${req.url}`);
  }
  next();
});

//  Serve your files directly from the root folder 
app.use(express.static(__dirname));

// Default route (home page)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "flappy.html"));
});

app.listen(PORT, () => {
  console.log(`Secure Flappy Ball running on port ${PORT}`);
});
