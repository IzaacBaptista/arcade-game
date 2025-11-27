const express = require("express");
const cors = require("cors");
const gameRoutes = require("./routes/gameRoutes");
const authRoutes = require("./routes/authRoutes");
const { ensureTables } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

ensureTables().catch(err => {
  console.error("Erro ao criar tabelas", err);
});

app.use("/auth", authRoutes);
app.use("/game", gameRoutes);

app.listen(8000, () => {
  console.log("API rodando em http://localhost:8000");
});
