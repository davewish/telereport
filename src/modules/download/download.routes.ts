import { Router } from "express";

import * as controller from "./download.controller";
const router = Router();
router.post("/:hospitalId", controller.exportPatients);

export default router;
