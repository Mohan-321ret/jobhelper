import express from "express";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    res.json({
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    });
  } catch (err) {
    res.status(401).json({ error: "Invalid Google token" });
  }
});

export default router; // ✅ IMPORTANT
