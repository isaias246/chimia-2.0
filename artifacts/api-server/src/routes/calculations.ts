import { Router, type IRouter } from "express";
import { db, calculationsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import {
  CalculateMolecularMassBody,
  ParseFormulaBody,
  BalanceEquationBody,
  CalculateStoichiometryBody,
} from "@workspace/api-zod";
import { calculateMolecularMass, parseFormula, balanceEquation, calculateStoichiometry } from "../lib/chemistry.js";

const router: IRouter = Router();

router.post("/calculations/molecular-mass", async (req, res): Promise<void> => {
  const parsed = CalculateMolecularMassBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const result = calculateMolecularMass(parsed.data.formula);
  if (!result) {
    res.status(400).json({ error: "Invalid chemical formula. Please check element symbols and parentheses." });
    return;
  }

  // Save to history
  await db.insert(calculationsTable).values({
    type: "molecular-mass",
    input: parsed.data.formula,
    result: JSON.stringify({ molecularMass: result.molecularMass }),
  }).catch(() => {});

  res.json(result);
});

router.post("/calculations/parse-formula", async (req, res): Promise<void> => {
  const parsed = ParseFormulaBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const elements = parseFormula(parsed.data.formula);
  if (!elements) {
    res.json({
      formula: parsed.data.formula,
      isValid: false,
      elements: [],
      totalAtoms: 0,
      error: "Invalid chemical formula syntax",
    });
    return;
  }

  const totalAtoms = elements.reduce((sum, e) => sum + e.count, 0);

  res.json({
    formula: parsed.data.formula,
    isValid: true,
    elements,
    totalAtoms,
    error: null,
  });
});

router.post("/calculations/balance-equation", async (req, res): Promise<void> => {
  const parsed = BalanceEquationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const result = balanceEquation(parsed.data.equation);
  if (!result) {
    res.status(400).json({ error: "Invalid equation format. Use: H2 + O2 -> H2O" });
    return;
  }

  // Save to history
  await db.insert(calculationsTable).values({
    type: "balance-equation",
    input: parsed.data.equation,
    result: result.balanced,
  }).catch(() => {});

  res.json(result);
});

router.post("/calculations/stoichiometry", async (req, res): Promise<void> => {
  const parsed = CalculateStoichiometryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { equation, reactantAmounts, targetFormula, actualYieldGrams } = parsed.data;

  const result = calculateStoichiometry(
    equation,
    reactantAmounts as Array<{ formula: string; amount: number; unit: "grams" | "moles" }>,
    targetFormula,
    actualYieldGrams ?? undefined,
  );

  if (!result) {
    res.status(400).json({
      error: "Could not calculate stoichiometry. Check that the equation balances, the target formula appears as a product, and all reactant formulas are valid.",
    });
    return;
  }

  await db.insert(calculationsTable).values({
    type: "stoichiometry",
    input: `${equation} → ${targetFormula}`,
    result: JSON.stringify({
      theoreticalYieldGrams: result.theoreticalYieldGrams,
      limitingReagent: result.limitingReagent,
      percentYield: result.percentYield,
    }),
  }).catch(() => {});

  res.json(result);
});

router.get("/calculations/history", async (_req, res): Promise<void> => {
  const history = await db
    .select()
    .from(calculationsTable)
    .orderBy(desc(calculationsTable.createdAt))
    .limit(50);

  res.json(history.map(c => ({
    id: c.id,
    type: c.type,
    input: c.input,
    result: c.result,
    userId: c.userId,
    createdAt: c.createdAt,
  })));
});

export default router;
