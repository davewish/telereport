import { Router } from "express";

import * as controller from "./download.controller";
const router = Router();
router.get("/:hospitalId/export", controller.exportPatients);

export default router;
