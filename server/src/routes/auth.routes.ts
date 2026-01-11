import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const r = Router();
const JWT_SECRET = process.env.JWT_SECRET as string;

r.post('/register', async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    passwordHash: hash
  });

  const token = jwt.sign({ id: user.id }, JWT_SECRET);
  res.json({ token, user });
});

r.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.sendStatus(401);

  const ok = await bcrypt.compare(
    req.body.password,
    user.passwordHash as string
  );
  if (!ok) return res.sendStatus(401);

  const token = jwt.sign({ id: user.id }, JWT_SECRET);
  res.json({ token, user });
});

export default r;
