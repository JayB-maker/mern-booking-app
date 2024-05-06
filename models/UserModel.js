import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please enter last name"],
  },
  role: {
    type: String,
    required: [true, "Please enter role"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please enter phone number"],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
  },
});

export const userModel = mongoose.model("userModel", userSchema);
