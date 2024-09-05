import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { User } from "../../models/User";

const secretKey = process.env.JWT_SECRET || "secreta";

export const loginUser = async (req: Request, res: Response) => {
  console.log("Dados da requisição:", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  console.log("Email:", email);
  console.log("Senha:", password);

  try {
    console.log("Iniciando processo de login...");
    const user = await User.findOne({ email }).select("+password"); // Inclua a senha no resultado

    if (!user) {
      console.log("Usuário não encontrado");
      return res.status(400).json({ msg: "Credenciais inválidas" });
    }

    console.log("Usuário encontrado:", user);

    // Verificar e logar o tipo da senha
    console.log("Tipo de senha armazenada:", typeof user.password);
    console.log("Senha armazenada:", user.password);

    if (typeof password !== "string" || typeof user.password !== "string") {
      console.error("Senha fornecida ou armazenada não é uma string");
      return res.status(400).json({ msg: "Credenciais inválidas" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Senhas não correspondem");
      return res.status(400).json({ msg: "Credenciais inválidas" });
    } else {
      console.log("Senha corresponde");
    }

    const payload = { user: { id: user.id } };
    console.log("Payload para o token JWT:", payload);

    jwt.sign(payload, secretKey, { expiresIn: 360000 }, (err, token) => {
      if (err) {
        console.error("Erro ao gerar o token JWT:", err);
        return res.status(500).send("Erro ao gerar o token");
      } else {
        console.log("Token gerado com sucesso:", token);
        res.json({ token });
      }
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error("Erro capturado:", err.message);
    } else {
      console.error("Erro desconhecido");
    }
    res.status(500).send("Erro no servidor");
  }
};
