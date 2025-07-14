const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

const config = require("./config");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const accs = JSON.parse(fs.readFileSync("data/accs.json"));
  res.render("index", { accs });
});

app.post("/napthe", async (req, res) => {
  const { telco, code, serial, amount } = req.body;
  const callback = "https://yourdomain.com/callback"; // nếu dùng callback
  try {
    const response = await axios.post("https://thesieure.com/chargingws/v2", {
      telco,
      code,
      serial,
      amount,
      request_id: Date.now().toString(),
      partner_id: config.PARTNER_ID,
      sign: config.API_KEY,
      command: "charging"
    });
    res.send(response.data);
  } catch (err) {
    res.send({ error: "Lỗi gửi thẻ" });
  }
});

app.listen(PORT, () => console.log(`Shop chạy tại http://localhost:${PORT}`));
