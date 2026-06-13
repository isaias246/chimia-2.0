import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import elementsRouter from "./elements";
import calculationsRouter from "./calculations";
import compoundsRouter from "./compounds";
import formulasRouter from "./formulas";
import chatRouter from "./chat";
import solverRouter from "./solver";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(elementsRouter);
router.use(calculationsRouter);
router.use(compoundsRouter);
router.use(formulasRouter);
router.use(chatRouter);
router.use(solverRouter);

export default router;
