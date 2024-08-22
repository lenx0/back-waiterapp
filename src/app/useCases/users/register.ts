import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { User } from "../../models/User";

const secretKey = process.env.JWT_SECRET || "secreta";

export const registerUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "Usuário já existe" });
    }

    user = new User({ name, email, password });

    // Criptografa a senha
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Gera o token JWT
    const payload = { user: { id: user.id } };

    jwt.sign(payload, secretKey, { expiresIn: 360000 }, (err, token) => {
      if (err) {
        console.error("Erro ao gerar o token JWT:", err);
        return res.status(500).send("Erro ao gerar o token");
      }
      res.json({ token });
    });
  } catch (err) {
    console.error("Erro no servidor:", err);
    res.status(500).send("Erro no servidor");
  }
};


