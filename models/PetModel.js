import mongoose from "mongoose";

const petSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    name: {
      type: String,
      required: [true, "Please enter name"],
    },
    categories: {
      type: String,
      required: [true, "Please enter categories"],
    },
    quantity: {
      type: Number,
      required: [true, "Please enter quantity"],
    },
    gender: {
      type: String,
      required: [true, "Please enter gender"],
    },
    image: {
      type: String,
      required: [true, "Please upload an image"],
    },
    price: {
      type: Number,
      required: [true, "Please enter price"],
    },
  },
  { timestamps: true }
);

export const petModel = mongoose.Model("petModel", petSchema);
