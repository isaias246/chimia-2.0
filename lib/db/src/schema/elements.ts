import { pgTable, text, serial, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const elementsTable = pgTable("elements", {
  id: serial("id").primaryKey(),
  atomicNumber: integer("atomic_number").notNull().unique(),
  symbol: text("symbol").notNull().unique(),
  name: text("name").notNull(),
  atomicMass: real("atomic_mass").notNull(),
  category: text("category").notNull(),
  group: integer("group"),
  period: integer("period").notNull(),
  electronConfiguration: text("electron_configuration").notNull(),
  oxidationStates: text("oxidation_states").notNull(),
  electronegativity: real("electronegativity"),
  atomicRadius: real("atomic_radius"),
  meltingPoint: real("melting_point"),
  boilingPoint: real("boiling_point"),
  density: real("density"),
  discoveredBy: text("discovered_by"),
  phase: text("phase").notNull().default("solid"),
  color: text("color").notNull().default("#94a3b8"),
});

export const insertElementSchema = createInsertSchema(elementsTable).omit({ id: true });
export type InsertElement = z.infer<typeof insertElementSchema>;
export type Element = typeof elementsTable.$inferSelect;
