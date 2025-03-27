import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    orderId: {
      type: String,
      required: [true, "Provide orderId"],
      unique: true,
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        size: {
          type: Number,
          required: true,
        },
      },
    ],
    payment_status: {
      type: String,
      default: "",
    },
    subTotalAmt: {
      type: Number,
      default: 0,
    },
    totalAmt: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const OrderModel = mongoose.model("Order", orderSchema);

export default OrderModel;
