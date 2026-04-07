const express = require("express");
const supportTicketControllers = require("../controllers/support-ticket-controllers");
const checkDocumentsExistMiddleware = require("../middlewares/check-documents-exist-middleware");
const User = require("../models/user-model");

const router = express.Router();

router.post(
  "/",
  checkDocumentsExistMiddleware({ customerId: User }),
  supportTicketControllers.createTicket
);

router.get("/", supportTicketControllers.getAllTickets);

router.get("/:id", supportTicketControllers.getTicketById);

router.patch("/:id", supportTicketControllers.updateTicketById);

router.delete("/:id", supportTicketControllers.deleteTicketById);

module.exports = router;