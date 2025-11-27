const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { JWT_SECRET } = require("../middleware/requireAuth");
const { freshState } = require("../services/saveStore");

module.exports = {
  async register(req, res) {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ msg: "Email e senha são obrigatórios." });
    const hash = await bcrypt.hash(password, 10);
    try {
      const result = await db.query(
        "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id",
        [email, hash]
      );
      const userId = result.rows[0].id;

      await db.query("INSERT INTO saves (user_id, state) VALUES ($1, $2)", [userId, freshState()]);
      const token = jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({ token });
    } catch (err) {
      if (err.code === "23505") {
        return res.status(409).json({ msg: "Email já registrado." });
      }
      console.error(err);
      return res.status(500).json({ msg: "Erro ao registrar." });
    }
  },

  async login(req, res) {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ msg: "Email e senha são obrigatórios." });
    const userRes = await db.query("SELECT id, password_hash FROM users WHERE email = $1", [email]);
    if (userRes.rows.length === 0) return res.status(401).json({ msg: "Credenciais inválidas." });
    const user = userRes.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ msg: "Credenciais inválidas." });
    const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token });
  }
};
