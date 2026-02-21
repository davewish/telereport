import { Router } from "express";

import * as controller from "./patient.controller";
import { createPatientSchema } from "./patient.schema";
import { validate } from "../../middleware/validate";
const router = Router();

router.post("/", validate(createPatientSchema), controller.create);
router.get("/", controller.getPatients);

router.get("/:id", controller.getPatient);
router.get("/:id/health-score", controller.getScore);
export default router;
