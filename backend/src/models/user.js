import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {

    image:{
      type: String,
      default: "https://www.w3schools.com/howto/img_avatar.png",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone:{
      type: String,
      required: true,
    },
    orderHistory: [
      {
        orderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Order",
        },
        date: {
          type: Date,
          default: Date.now,
        },
        total: {
          type: Number,
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "shipped", "delivered"],
          default: "pending",
        },
      },
    ],
  },
  { timestamps: true }
);

const User= mongoose.model("User", userSchema);
export default User;
