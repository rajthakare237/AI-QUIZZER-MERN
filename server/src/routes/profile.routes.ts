import express from 'express';
import { User } from '../models/User.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

/**
 * PATCH /api/users/me
 */
/**
 * GET /api/users/me
 */
router.get('/me', requireAuth, async (req, res) => {
  const userId = (req as any).user.id;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    avatarId: user.avatarId
  });
});


router.patch('/me', requireAuth, async (req, res) => {
  const { name, avatarId } = req.body;

  const userId = (req as any).user.id;

  if (avatarId < 1 || avatarId > 8) {
    return res.status(400).json({ message: 'Invalid avatar' });
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { name, avatarId },
    { new: true }
  );

  res.json({
    id: user!._id,
    name: user!.name,
    email: user!.email,
    avatarId: user!.avatarId
  });
});


export default router;
