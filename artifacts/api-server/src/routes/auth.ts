import { Router, type IRouter } from "express";
import { createHash, randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import {
  RegisterBody,
  LoginBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function hashPassword(password: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${password}`).digest("hex");
}

// Simple in-memory session store (production would use Redis/DB)
const sessions = new Map<string, number>();

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email, username, password } = parsed.data;

  const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (existing.length > 0) {
    res.status(409).json({ error: "Email already registered" });
    return;
  }

  const salt = randomBytes(16).toString("hex");
  const passwordHash = hashPassword(password, salt) + ":" + salt;

  const [user] = await db.insert(usersTable).values({ email, username, passwordHash }).returning();
  const token = randomBytes(32).toString("hex");
  sessions.set(token, user.id);

  res.status(201).json({
    user: { id: user.id, email: user.email, username: user.username, createdAt: user.createdAt },
    token,
  });
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email, password } = parsed.data;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const [storedHash, salt] = user.passwordHash.split(":");
  const computedHash = hashPassword(password, salt);
  if (computedHash !== storedHash) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = randomBytes(32).toString("hex");
  sessions.set(token, user.id);

  res.json({
    user: { id: user.id, email: user.email, username: user.username, createdAt: user.createdAt },
    token,
  });
});

router.post("/auth/logout", async (req, res): Promise<void> => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (token) sessions.delete(token);
  res.sendStatus(204);
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token || !sessions.has(token)) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const userId = sessions.get(token)!;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }
  res.json({ id: user.id, email: user.email, username: user.username, createdAt: user.createdAt });
});

export { sessions };
export default router;
