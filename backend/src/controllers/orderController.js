import mongoose from "mongoose";
import Order from "../models/order.js";
import User from "../models/user.js";
export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { items, totalAmount, status } = req.body;
    const userId = req.user._id; // Assuming you have user authentication in place
    const address=await User.findById(userId).select("address");
    const newOrder = new Order({
      userId,
      items,
      totalAmount,
      status,
        address: address // Assuming you want to use the user's address
    });
    const savedOrder = await newOrder.save({ session });
    // Update user's order history
     await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          orderHistory: {
            orderId: savedOrder._id,
            date: new Date(),
            total: totalAmount,
            status,
          },
        },
      },
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    return res
      .status(201)
      .json({ message: "Order created successfully", order: savedOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: "Internal server error" });
  }
};
