import fs from "fs";
import path from "path";
import JSON5 from "json5";

const filePath = path.join(process.cwd(), "partner_links.json5");

export default function handler(req, res) {
  const pass = process.env.ADMIN_PASS || "admin123";
  if (req.method === "GET") {
    const data = fs.readFileSync(filePath, "utf8");
    return res.status(200).json({ content: data });
  }

  if (req.method === "POST") {
    const { password, content } = req.body;
    if (password !== pass) {
      return res.status(403).json({ error: "Неверный пароль" });
    }
    fs.writeFileSync(filePath, content, "utf8");
    return res.status(200).json({ ok: true });
  }

  res.status(405).end();
}