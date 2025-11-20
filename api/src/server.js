const express = require("express");
const cors = require("cors");
const gameRoutes = require("./routes/gameRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/game", gameRoutes);

app.listen(8000, () => {
  console.log("API rodando em http://localhost:8000");
});
