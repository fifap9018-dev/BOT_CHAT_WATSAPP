
const http = require("http");

const messages = [];

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  res.setHeader("Content-Type", "application/json");

  if (req.url === "/health" && req.method === "GET") {
    res.end(JSON.stringify({
      status: "online",
      name: "BOT_CHAT_WATSAPP"
    }));
    return;
  }

  if (req.url === "/api/messages" && req.method === "POST") {
    let body = "";

    req.on("data", chunk => body += chunk);

    req.on("end", () => {
      try {
        const data = JSON.parse(body);

        if (!data.to || !data.text || data.consent !== true) {
          res.writeHead(400);
          return res.end(JSON.stringify({
            error: "Valid recipient, message and consent required"
          }));
        }

        const message = {
          id: Date.now(),
          to: data.to,
          text: data.text,
          status: "simulated",
          date: new Date().toISOString()
        };

        messages.push(message);

        res.end(JSON.stringify({
          success: true,
          status: "simulated",
          message: "Test message saved. No WhatsApp message was sent."
        }));

      } catch {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(process.env.PORT || 3000, "0.0.0.0", () => {
  console.log("BOT_CHAT_WATSAPP server is running");
});
