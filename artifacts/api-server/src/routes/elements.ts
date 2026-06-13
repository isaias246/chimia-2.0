import { Router, type IRouter } from "express";
import { eq, ilike, or, sql } from "drizzle-orm";
import { db, elementsTable } from "@workspace/db";
import { GetElementParams, ListElementsQueryParams } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/elements", async (req, res): Promise<void> => {
  const params = ListElementsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  let query = db.select().from(elementsTable).$dynamic();

  if (params.data.search) {
    const s = `%${params.data.search}%`;
    query = query.where(
      or(
        ilike(elementsTable.name, s),
        ilike(elementsTable.symbol, s),
        sql`${elementsTable.atomicNumber}::text ILIKE ${s}`
      )
    );
  }

  if (params.data.category) {
    query = query.where(eq(elementsTable.category, params.data.category));
  }

  const elements = await query.orderBy(elementsTable.atomicNumber);
  res.json(elements.map(e => ({
    atomicNumber: e.atomicNumber,
    symbol: e.symbol,
    name: e.name,
    atomicMass: e.atomicMass,
    category: e.category,
    group: e.group,
    period: e.period,
    electronConfiguration: e.electronConfiguration,
    oxidationStates: e.oxidationStates,
    electronegativity: e.electronegativity,
    atomicRadius: e.atomicRadius,
    meltingPoint: e.meltingPoint,
    boilingPoint: e.boilingPoint,
    density: e.density,
    discoveredBy: e.discoveredBy,
    phase: e.phase,
    color: e.color,
  })));
});

router.get("/elements/stats/summary", async (_req, res): Promise<void> => {
  const result = await db
    .select({
      category: elementsTable.category,
      count: sql<number>`count(*)::int`,
    })
    .from(elementsTable)
    .groupBy(elementsTable.category)
    .orderBy(elementsTable.category);

  res.json(result);
});

router.get("/elements/:atomicNumber", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.atomicNumber) ? req.params.atomicNumber[0] : req.params.atomicNumber;
  const params = GetElementParams.safeParse({ atomicNumber: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [element] = await db
    .select()
    .from(elementsTable)
    .where(eq(elementsTable.atomicNumber, params.data.atomicNumber));

  if (!element) {
    res.status(404).json({ error: "Element not found" });
    return;
  }

  res.json({
    atomicNumber: element.atomicNumber,
    symbol: element.symbol,
    name: element.name,
    atomicMass: element.atomicMass,
    category: element.category,
    group: element.group,
    period: element.period,
    electronConfiguration: element.electronConfiguration,
    oxidationStates: element.oxidationStates,
    electronegativity: element.electronegativity,
    atomicRadius: element.atomicRadius,
    meltingPoint: element.meltingPoint,
    boilingPoint: element.boilingPoint,
    density: element.density,
    discoveredBy: element.discoveredBy,
    phase: element.phase,
    color: element.color,
  });
});

export default router;
