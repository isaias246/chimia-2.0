import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, conversationsTable, messagesTable } from "@workspace/db";
import {
  CreateConversationBody,
  GetConversationParams,
  DeleteConversationParams,
  SendMessageParams,
  SendMessageBody,
} from "@workspace/api-zod";
import { getChemistryResponse } from "../lib/chemistryTutor.js";

const router: IRouter = Router();

router.get("/chat/conversations", async (_req, res): Promise<void> => {
  const conversations = await db
    .select()
    .from(conversationsTable)
    .orderBy(desc(conversationsTable.updatedAt));

  res.json(conversations.map(c => ({
    id: c.id,
    title: c.title,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  })));
});

router.post("/chat/conversations", async (req, res): Promise<void> => {
  const parsed = CreateConversationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [conversation] = await db
    .insert(conversationsTable)
    .values({ title: parsed.data.title })
    .returning();

  res.status(201).json({
    id: conversation.id,
    title: conversation.title,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
  });
});

router.get("/chat/conversations/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetConversationParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [conversation] = await db
    .select()
    .from(conversationsTable)
    .where(eq(conversationsTable.id, params.data.id));

  if (!conversation) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }

  const messages = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, params.data.id))
    .orderBy(messagesTable.createdAt);

  res.json({
    id: conversation.id,
    title: conversation.title,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    messages: messages.map(m => ({
      id: m.id,
      conversationId: m.conversationId,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt,
    })),
  });
});

router.delete("/chat/conversations/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteConversationParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db.delete(messagesTable).where(eq(messagesTable.conversationId, params.data.id));
  await db.delete(conversationsTable).where(eq(conversationsTable.id, params.data.id));

  res.sendStatus(204);
});

router.post("/chat/conversations/:id/messages", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = SendMessageParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = SendMessageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [conversation] = await db
    .select()
    .from(conversationsTable)
    .where(eq(conversationsTable.id, params.data.id));

  if (!conversation) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }

  // Save user message
  await db.insert(messagesTable).values({
    conversationId: params.data.id,
    role: "user",
    content: parsed.data.content,
  });

  // Get conversation history
  const history = await db
    .select()
    .from(messagesTable)
    .where(eq(messagesTable.conversationId, params.data.id))
    .orderBy(messagesTable.createdAt);

  // Get chemistry tutor response
  const { answer } = getChemistryResponse(
    parsed.data.content,
    history.map(m => ({ role: m.role, content: m.content }))
  );

  // Save assistant message
  const [assistantMsg] = await db.insert(messagesTable).values({
    conversationId: params.data.id,
    role: "assistant",
    content: answer,
  }).returning();

  // Update conversation timestamp
  await db
    .update(conversationsTable)
    .set({ updatedAt: new Date() })
    .where(eq(conversationsTable.id, params.data.id));

  res.json({
    id: assistantMsg.id,
    conversationId: assistantMsg.conversationId,
    role: assistantMsg.role,
    content: assistantMsg.content,
    createdAt: assistantMsg.createdAt,
  });
});

export default router;
