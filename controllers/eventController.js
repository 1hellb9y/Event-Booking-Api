const Event=require("../models/Event-model");
const asyncHandler = require("../utils/asyncHandler");
const {body}=require("express-validator");
exports.getAllEvents=asyncHandler(async(req,res)=>{
    const events=await Event.find({}).populate("bookedUsers","username email");
    return res.status(200).json({
        msg:"Events:",
        events
    });
});
exports.getEventById=asyncHandler(async(req,res)=>{
    const eventId=req.params.id;
    const event=await Event.findById(eventId);
    if(!event){
        return res.status(400).json({
            msg:"cannot find this event",
        });
    };
    return res.status(200).json(
        event
    )
});

exports.createEvent=asyncHandler(async(req,res)=>{
    const {title,description,date,capacity}=req.body;
    if(!title || !description || ! date || !capacity){
        return res.status(400).json({
            msg:"fields required",
        });
    };
    const newEvent=new Event({
        title,
        description,
        date,
        capacity,
        remainingCapacity:capacity,
        createdBy:req.user.id
    });
    await newEvent.save();
    return res.status(200).json({
        msg:"new event submitted",
        event:newEvent.title,
    });
});

exports.updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (req.user.role !== "admin" && event.createdBy.toString() !== req.user.id) {
    return res.status(403).json({ message: "You are not allowed to update this event" });
  }

  const { title, description, date, capacity } = req.body;

  let updateData = { title, description, date };

  if (capacity) {
    if (capacity < event.bookedUsers.length) {
      return res.status(400).json({
        message: "New capacity cannot be less than already booked users",
      });
    }

    const usedSeats = event.capacity - event.remainingCapacity;
    updateData.capacity = capacity;
    updateData.remainingCapacity = capacity - usedSeats;
  }

  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    message: "Event updated successfully",
    event: updatedEvent,
  });
});

exports.deleteEvent=asyncHandler(async(req,res)=>{
    const eventId=req.params.id;
    const event=await Event.findByIdAndDelete(eventId)
    if(!event){
        return res.status(400).json({
            msg:"this event is already deleted",
        })
    };
    return res.status(200).json({msg:"event deleted"});
});


exports.bookEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (event.remainingCapacity <= 0) {
    return res.status(400).json({ message: "Event is fully booked" });
  }

  if (event.bookedUsers.includes(req.user.id)) {
    return res.status(400).json({ message: "You have already booked this event" });
  }

  event.bookedUsers.push(req.user.id);
  event.remainingCapacity -= 1;
  await event.save();

  res.status(200).json({
    message: "Booking confirmed",
    remainingCapacity: event.remainingCapacity,
  });
});

exports.cancelBooking = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  if (!event.bookedUsers.includes(req.user.id)) {
    return res.status(400).json({ message: "You are not booked for this event" });
  }

  event.bookedUsers = event.bookedUsers.filter(
    (userId) => userId.toString() !== req.user.id
  );
  event.remainingCapacity += 1;
  await event.save();

  res.status(200).json({
    message: "Booking canceled",
    remainingCapacity: event.remainingCapacity,
  });
});
