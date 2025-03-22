import ProductModel from "../models/product.model.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";

export async function CashOnDeliveryOrderController(request, response) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const userId = request.userId;
        const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

        if (!list_items || list_items.length === 0) {
            return response.status(400).json({
                message: "No items in the order.",
                error: true,
                success: false
            });
        }

        const products = list_items.map(el => ({
            productId: el.productId._id,
            quantity: el.quantity
        }));

        const orderPayload = {
            userId: userId,
            orderId: `ORD-${new mongoose.Types.ObjectId()}`,
            products: products,
            payment_status: "CASH ON DELIVERY",
            delivery_address: addressId,
            subTotalAmt: subTotalAmt,
            totalAmt: totalAmt,
        };

        const generatedOrder = await OrderModel.create([orderPayload], { session });

        for (let item of list_items) {
            await ProductModel.findByIdAndUpdate(
                item.productId._id,
                { $inc: { stock: -item.quantity } },
                { session }
            );
        }
        await CartProductModel.deleteMany({ userId: userId }, { session });
        await UserModel.updateOne({ _id: userId }, { shopping_cart: [] }, { session });

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        return response.json({
            message: "Order successfully",
            error: false,
            success: true,
            data: generatedOrder
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function getOrderDetailsController(request, response) {
    try {
        const userId = request.userId;

        const orderList = await OrderModel.find({ userId: userId })
            .sort({ createdAt: -1 })
            .populate("delivery_address")
            .populate("products.productId");

        if (!orderList || orderList.length === 0) {
            return response.status(404).json({
                message: "No orders found for this user.",
                data: [],
                error: false,
                success: true
            });
        }

        return response.json({
            message: "Order list retrieved successfully",
            data: orderList,
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
}
export async function createNewOrderController(request, response) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { userId, products, totalAmt } = request.body;

        if (!userId || !products || products.length === 0) {
            return response.status(400).json({
                message: "Missing userId or products in the order.",
                error: true,
                success: false,
            });
        }

        // Tạo payload cho order
        const orderPayload = {
            userId: userId,
            orderId: `ORD-${new mongoose.Types.ObjectId()}`, // Tạo orderId duy nhất
            products: products,
            payment_status: "PENDING", // Trạng thái thanh toán mặc định
            delivery_address: null, // Có thể xử lý sau nếu có thông tin
            subTotalAmt: totalAmt,
            totalAmt: totalAmt,
        };

        // Tạo đơn hàng trong session
        const createdOrder = await OrderModel.create([orderPayload], { session });

        // Giảm stock sản phẩm dựa trên danh sách products
        for (const item of products) {
            await ProductModel.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } }, // Trừ stock theo quantity của sản phẩm
                { session }
            );
        }

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        return response.status(201).json({
            message: "Order created successfully",
            error: false,
            success: true,
            data: createdOrder,
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false,
        });
    }
}