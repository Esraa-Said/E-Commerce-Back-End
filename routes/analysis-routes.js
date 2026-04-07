const express = require("express");
const analysisControllers = require("../controllers/analysis-controllers");

const router = express.Router();

router.post("/", analysisControllers.createAnalysis);

router.get("/", analysisControllers.getAllAnalyses);

router.get("/:id", analysisControllers.getAnalysisById);

router.patch("/:id", analysisControllers.updateAnalysisById);

router.delete("/:id", analysisControllers.deleteAnalysisById);

module.exports = router;