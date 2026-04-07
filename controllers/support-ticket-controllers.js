const SupportTicket = require("../models/support-ticket-model");
const asyncWrapper = require("../utils/async-wrapper");
const CustomError = require("../utils/custom-error");
const mongoose = require("mongoose");

const createTicket = asyncWrapper(async (req, res, next) => {
  const { customerId, subject, message } = req.body;

  if (!customerId || !subject || !message) {
    return next(new CustomError("customerId, subject, and message are required", 400));
  }

  if (!mongoose.Types.ObjectId.isValid(customerId)) {
    return next(new CustomError("Invalid customerId", 400));
  }

  const ticket = await SupportTicket.create({ customerId, subject, message });

  res.status(201).json({
    status: "success",
    message: "Support ticket created successfully",
    data: ticket,
  });
});

const getAllTickets = asyncWrapper(async (req, res) => {
  const filter = {};
  if (req.query.customerId && mongoose.Types.ObjectId.isValid(req.query.customerId)) {
    filter.customerId = req.query.customerId;
  }
  if (req.query.status) filter.status = req.query.status;

  const tickets = await SupportTicket.find(filter)
    .sort({ createdAt: -1 })
    .populate("customerId assignedToId", "name email");

  res.status(200).json({
    status: "success",
    results: tickets.length,
    data: tickets,
  });
});

const getTicketById = asyncWrapper(async (req, res, next) => {
  const ticket = await SupportTicket.findById(req.params.id)
    .populate("customerId assignedToId", "name email");

  if (!ticket) return next(new CustomError("Support ticket not found", 404));

  res.status(200).json({ status: "success", data: ticket });
});

const updateTicketById = asyncWrapper(async (req, res, next) => {
  const ticket = await SupportTicket.findById(req.params.id);
  if (!ticket) return next(new CustomError("Support ticket not found", 404));

  const { status, assignedToId, reply, internalNote } = req.body;

  if (status) ticket.status = status;
  if (assignedToId && mongoose.Types.ObjectId.isValid(assignedToId)) ticket.assignedToId = assignedToId;
  if (reply && reply.userId && reply.message) {
    if (!mongoose.Types.ObjectId.isValid(reply.userId)) {
      return next(new CustomError("Invalid reply.userId", 400));
    }
    ticket.replies.push({ userId: reply.userId, message: reply.message });
  }
  if (internalNote) ticket.internalNotes.push(internalNote);

  await ticket.save();

  res.status(200).json({
    status: "success",
    message: "Support ticket updated successfully",
    data: ticket,
  });
});

const deleteTicketById = asyncWrapper(async (req, res, next) => {
  const ticket = await SupportTicket.findById(req.params.id);
  if (!ticket) return next(new CustomError("Support ticket not found", 404));

  await ticket.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Support ticket deleted successfully",
  });
});

module.exports = {
  createTicket,
  getAllTickets,
  getTicketById,
  updateTicketById,
  deleteTicketById,
};