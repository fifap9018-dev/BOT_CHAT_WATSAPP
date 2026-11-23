
const http = require("http");

const PORT = process.env.PORT || 3000;
const messages = [];

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  res.setHeader("Content-Type", "application/json; charset=utf-8");

  // 1. Main page
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8"
    });

    return res.end(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>BOT_CHAT_WATSAPP</title>
<style>
*{box-sizing:border-box}
body{
  margin:0;
  background:#07110d;
  color:#eafff2;
  font-family:Arial,sans-serif;
  min-height:100vh;
  display:grid;
  place-items:center;
  padding:20px;
}
.card{
  width:100%;
  max-width:520px;
  background:#10221a;
  border:1px solid #1b9b62;
  border-radius:20px;
  padding:30px;
  box-shadow:0 0 35px #00c87822;
}
h1{color:#25d987}
.status{color:#25d987;font-weight:bold}
.item{
  background:#0a1711;
  padding:14px;
  border-radius:10px;
  margin-top:12px;
}
a{color:#25d987}
</style>
</head>
<body>
<div class="card">
  <h1>BOT_CHAT_WATSAPP</h1>
  <p>Backend service dashboard</p>
  <p class="status">● Server is running</p>
  <div class="item">
    <b>Server Status</b>
    <p>Online</p>
  </div>
  <div class="item">
    <b>Health API</b>
    <p><a href="/health">Open /health</a></p>
  </div>
  <div class="item">
    <b>Messages API</b>
    <p>GET /api/messages</p>
    <p>POST /api/messages</p>
  </div>
  <p>Version 1.0.1</p>
</div>
</body>
</html>`);
  }

  // 2. Health check
  if (req.method === "GET" && req.url === "/health") {
    return res.end(JSON.stringify({
      status: "online",
      name: "BOT_CHAT_WATSAPP",
      version: "1.0.1",
      uptime: process.uptime()
    }));
  }

  // 3. Get stored test messages
  if (req.method === "GET" && req.url === "/api/messages") {
    return res.end(JSON.stringify({
      success: true,
      count: messages.length,
      messages
    }));
  }

  // 4. Receive test messages
  if (req.method === "POST" && req.url === "/api/messages") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;

      if (body.length > 100000) {
        res.writeHead(413);
        res.end(JSON.stringify({
          error: "Request too large"
        }));
        req.destroy();
      }
    });

    req.on("end", () => {
      try {
        const data = JSON.parse(body);

        if (!data.to || !data.text || data.consent !== true) {
          res.writeHead(400);
          return res.end(JSON.stringify({
            error: "Recipient, text and consent are required"
          }));
        }

        const message = {
          id: Date.now(),
          to: String(data.to),
          text: String(data.text),
          status: "simulated",
          date: new Date().toISOString()
        };

        messages.push(message);

        res.writeHead(201);
        return res.end(JSON.stringify({
          success: true,
          message: "Test message saved successfully",
          status: "simulated",
          data: message
        }));

      } catch (error) {
        res.writeHead(400);
        return res.end(JSON.stringify({
          error: "Invalid JSON"
        }));
      }
    });

    return;
  }

  // 5. Unknown routes
  res.writeHead(404);
  res.end(JSON.stringify({
    error: "Not found",
    availableRoutes: [
      "/",
      "/health",
      "/api/messages"
    ]
  }));
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("BOT_CHAT_WATSAPP server is running");
  console.log("Port:", PORT);
});

server.on("error", error => {
  console.error("Server error:", error);
});
          
