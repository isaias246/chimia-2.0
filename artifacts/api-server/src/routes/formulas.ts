import { Router, type IRouter } from "express";
import { desc, eq } from "drizzle-orm";
import { db, savedFormulasTable } from "@workspace/db";
import { SaveFormulaBody, DeleteFormulaParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/formulas", async (_req, res): Promise<void> => {
  const formulas = await db
    .select()
    .from(savedFormulasTable)
    .orderBy(desc(savedFormulasTable.createdAt))
    .limit(100);

  res.json(formulas.map(f => ({
    id: f.id,
    formula: f.formula,
    name: f.name,
    type: f.type,
    molecularMass: f.molecularMass,
    createdAt: f.createdAt,
  })));
});

router.post("/formulas", async (req, res): Promise<void> => {
  const parsed = SaveFormulaBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [formula] = await db.insert(savedFormulasTable).values(parsed.data).returning();

  res.status(201).json({
    id: formula.id,
    formula: formula.formula,
    name: formula.name,
    type: formula.type,
    molecularMass: formula.molecularMass,
    createdAt: formula.createdAt,
  });
});

router.delete("/formulas/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteFormulaParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(savedFormulasTable)
    .where(eq(savedFormulasTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Formula not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
