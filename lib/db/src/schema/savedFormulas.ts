import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const savedFormulasTable = pgTable("saved_formulas", {
  id: serial("id").primaryKey(),
  formula: text("formula").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  molecularMass: real("molecular_mass"),
  userId: integer("user_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSavedFormulaSchema = createInsertSchema(savedFormulasTable).omit({ id: true, createdAt: true });
export type InsertSavedFormula = z.infer<typeof insertSavedFormulaSchema>;
export type SavedFormula = typeof savedFormulasTable.$inferSelect;
