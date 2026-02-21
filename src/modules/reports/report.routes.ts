import { Router } from "express";

import { createReportSchema } from "./report.schema";
import * as controller from "./reprot.controller";
import { validate } from "../../middleware/validate";

const router = Router();

router.post("/", validate(createReportSchema), controller.create);
router.get("/:patientId", controller.getReportsByPatient);

export default router;
