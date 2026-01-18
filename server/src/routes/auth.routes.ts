import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const r = Router();
const JWT_SECRET = process.env.JWT_SECRET as string;

// ✅ NEW: Guest Login Route
r.post('/guest', async (req, res) => {
  try {
    // 1. Create a unique identifier based on timestamp
    const uniqueId = Date.now();
    
    // 2. Generate a temporary email and dummy password
    // We use a specific domain (.guest) so you can easily identify/delete these later
    const guestEmail = `guest_${uniqueId}@temp.guest`;
    const guestPassword = `guest_pass_${uniqueId}`;
    
    // 3. Hash the dummy password (to satisfy Schema requirements)
    const hash = await bcrypt.hash(guestPassword, 10);

    // 4. Create the User in DB
    const user = await User.create({
      name: `Guest User ${uniqueId.toString().slice(-4)}`,
      email: guestEmail,
      passwordHash: hash
    });

    // 5. Generate Token
    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    
    // 6. Return same structure as Login/Register
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create guest session" });
  }
});

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
