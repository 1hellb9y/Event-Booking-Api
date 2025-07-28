const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  capacity: { type: Number, required: true },
  remainingCapacity: { type: Number, required: true },
  bookedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }

});

eventSchema.pre("save", function (next) {
  if (this.isNew) {
    this.remainingCapacity = this.capacity;
  }
  next();
});

module.exports = mongoose.model("Event", eventSchema);
