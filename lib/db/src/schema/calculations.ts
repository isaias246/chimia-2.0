import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const calculationsTable = pgTable("calculations", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  input: text("input").notNull(),
  result: text("result").notNull(),
  userId: integer("user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCalculationSchema = createInsertSchema(calculationsTable).omit({ id: true, createdAt: true });
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type Calculation = typeof calculationsTable.$inferSelect;
