import { Router, type IRouter } from "express";
import { solve } from "../lib/smartSolver.js";

const router: IRouter = Router();

const VALID_TOPICS = ["molecular-mass", "stoichiometry", "gas-laws", "acids-bases", "equilibrium", "thermodynamics", "electrochemistry", "general"] as const;
const VALID_LEVELS = ["beginner", "highschool", "university"] as const;
const VALID_ACTIONS = ["solve", "simplify", "example", "practice", "formula", "mistakes"] as const;

router.post("/solver/solve", async (req, res): Promise<void> => {
  const { problem, topic, level, action } = req.body ?? {};

  if (typeof problem !== "string" || !problem.trim()) {
    res.status(400).json({ error: "problem must be a non-empty string" });
    return;
  }
  if (!VALID_TOPICS.includes(topic)) {
    res.status(400).json({ error: `topic must be one of: ${VALID_TOPICS.join(", ")}` });
    return;
  }
  if (!VALID_LEVELS.includes(level)) {
    res.status(400).json({ error: `level must be one of: ${VALID_LEVELS.join(", ")}` });
    return;
  }
  if (!VALID_ACTIONS.includes(action)) {
    res.status(400).json({ error: `action must be one of: ${VALID_ACTIONS.join(", ")}` });
    return;
  }

  const result = solve(problem, topic, level, action);
  res.json(result);
});

export default router;
