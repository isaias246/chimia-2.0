import { Router, type IRouter } from "express";
import { listCompounds, getCompound } from "../lib/compoundLibrary.js";

const router: IRouter = Router();

router.get("/compounds/library", async (req, res): Promise<void> => {
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const state = typeof req.query.state === "string" ? req.query.state : undefined;
  res.json(listCompounds(search, category, state));
});

router.get("/compounds/library/:id", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const compound = getCompound(id);
  if (!compound) {
    res.status(404).json({ error: `Compound '${id}' not found` });
    return;
  }
  res.json(compound);
});

export default router;
