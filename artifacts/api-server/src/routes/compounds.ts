import { Router, type IRouter } from "express";
import { db, elementsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { BuildCompoundBody } from "@workspace/api-zod";
import { buildCompound } from "../lib/chemistry.js";
import { generarPerfil, MVP_COMPOUNDS } from "../lib/perfilUniversal.js";

const router: IRouter = Router();

router.post("/compounds/build", async (req, res): Promise<void> => {
  const parsed = BuildCompoundBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { element1Symbol, element1Oxidation, element2Symbol, element2Oxidation } = parsed.data;

  // Fetch element names from DB
  const [el1] = await db.select().from(elementsTable).where(eq(elementsTable.symbol, element1Symbol));
  const [el2] = await db.select().from(elementsTable).where(eq(elementsTable.symbol, element2Symbol));

  if (!el1 || !el2) {
    res.status(400).json({ error: "One or both element symbols not found" });
    return;
  }

  const result = buildCompound(
    element1Symbol, element1Oxidation,
    element2Symbol, element2Oxidation,
    el1.name, el2.name
  );

  res.json(result);
});

router.post("/compounds/perfil", async (req, res): Promise<void> => {
  const { formula } = req.body as { formula?: unknown };
  if (!formula || typeof formula !== "string" || !formula.trim()) {
    res.status(400).json({ error: "Se requiere el campo 'formula' (string)" });
    return;
  }
  const perfil = generarPerfil(formula.trim());
  if (!perfil) {
    res.status(422).json({
      error: `El compuesto '${formula}' está fuera del alcance del MVP. Solo se soportan los 11 compuestos fundamentales.`,
      compuestosMVP: MVP_COMPOUNDS,
      formula: formula.trim(),
    });
    return;
  }
  res.json(perfil);
});

export default router;
