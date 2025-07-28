const express=require("express");
const { getAllEvents, createEvent, getEventById, updateEvent, deleteEvent, bookEvent, cancelBooking } = require("../controllers/eventController");
const checkRole = require("../middlwares/checkRole");
const router=express.Router();
const auth = require("../middlwares/auth");
const validate = require("../middlwares/validate");
const { createEventValidator, updateEventValidator } = require("../validators/eventValidatro");


router.get("/events",getAllEvents);
router.get("/events/:id",getEventById)
router.post("/events",auth,checkRole(["admin","user"]),createEventValidator,validate,createEvent);
router.put("/events/:id",auth,checkRole(["admin"]),updateEventValidator,validate,updateEvent)
router.delete("/events/:id",auth,checkRole(["admin"]),deleteEvent);
router.post("/events/:id/book",auth,bookEvent);
router.post("/events/:id/cancel-book",auth,cancelBooking);




module.exports=router