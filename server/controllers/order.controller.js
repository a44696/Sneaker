import ProductModel from "../models/product.model.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";
export async function createNewOrderController(request, response) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { userId, products, totalAmt, payment_method, address } = request.body;

        if (!userId || !products || products.length === 0) {
            return response.status(400).json({
                message: "Missing userId or products in the order.",
                error: true,
                success: false,
            });
        }

        // Tạo payload cho order
        const orderPayload = {
            userId,
            orderId: `ORD-${new Date().getTime()}`, // Tạo orderId dựa trên timestamp để đảm bảo duy nhất
            products,
            payment_method: payment_method,
            payment_status: "Pending",
            delivery_status: "Pending",
            delivery_address: address || "",
            subTotalAmt: totalAmt,
            totalAmt,
        };

        // Tạo đơn hàng
        const createdOrder = await OrderModel.create([orderPayload], { session });

        // Giảm stock sản phẩm trong transaction
        for (let item of products) {
            await ProductModel.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } },
                { session }
            );
        }

        // Xóa giỏ hàng của user trong transaction
        await CartProductModel.deleteMany({ userId }, { session });
        await UserModel.updateOne({ _id: userId }, { shopping_cart: [] }, { session });

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
        // Rollback transaction nếu có lỗi
        await session.abortTransaction();
        session.endSession();
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false,
        });
    }
}
export async function getOrderDetailsbyUserController(request, response) {
    try {
        const userId = request.userId;

        const orderList = await OrderModel.find({ userId: userId })
            .sort({ createdAt: -1 })
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

export const getOrderController = async(request,response)=>{
    try {
        
        let { page, limit, search } = request.body 

        if(!page){
            page = 1
        }

        if(!limit){
            limit = 10
        }

        const query = search ? {
            $text : {
                $search : search
            }
        } : {}

        const skip = (page - 1) * limit

        const [data,totalCount] = await Promise.all([
            OrderModel.find(query).sort({createdAt : -1 }).skip(skip).limit(limit),
            OrderModel.countDocuments(query)
        ])

        return response.json({
            message : "Order data",
            error : false,
            success : true,
            totalCount : totalCount,
            totalNoPage : Math.ceil( totalCount / limit),
            data : data
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getOrderDetails = async(request,response)=>{
    try {
        const { id } = request.body 

        const order = await OrderModel.findOne({ _id : id })


        return response.json({
            message : "Order details",
            data : order,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
export const getOrderListController = async (request, response) => {
    try {
        const [data, totalCount] = await Promise.all([
            OrderModel.find().sort({ createdAt: -1 }), // Lấy danh sách order, sắp xếp giảm dần theo ngày tạo
            OrderModel.countDocuments()          // Đếm tổng số đơn hàng (Nhưng `query` chưa định nghĩa!)
        ]);

        return response.json({
            message: "Order data",
            error: false,
            success: true,
            data: data
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};
export const deleteOrderDetails = async (request, response) => {
    const session = await OrderModel.startSession(); // Khởi tạo session
    session.startTransaction(); // Bắt đầu transaction

    try {
        const { _id } = request.body;

        if (!_id) {
            return response.status(400).json({
                message: "Provide _id",
                error: true,
                success: false
            });
        }

        const order = await OrderModel.findOne({ _id }).session(session);

        if (!order) {
            await session.abortTransaction(); // Hủy transaction nếu không tìm thấy đơn hàng
            session.endSession();
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }

        // Cập nhật lại stock cho từng sản phẩm trong đơn hàng
        for (let item of order.products) {
            await ProductModel.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: +item.quantity } },
                { session }
            );
        }

        // Xóa đơn hàng
        const deleteOrder = await OrderModel.deleteOne({ _id }).session(session);

        // Commit transaction
        await session.commitTransaction();
        session.endSession();

        return response.json({
            message: "Delete successfully",
            error: false,
            success: true,
            data: deleteOrder
        });
    } catch (error) {
        await session.abortTransaction(); // Hủy transaction nếu có lỗi
        session.endSession();
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const updateOrderDetails = async(request,response)=>{
    try {
        const { id } = request.body 

        if(!id){
            return response.status(400).json({
                message : "provide Order id",
                error : true,
                success : false
            })
        }

        const updateOrder = await OrderModel.updateOne({ _id : id },{
            ...request.body
        })

        return response.json({
            message : "updated successfully",
            data : updateOrder,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}
export const updateOrderStatus = async (request, response) => {
    try {
        const { id, delivery_status, payment_status } = request.body;

        if (!id) {
            return response.status(400).json({
                message: "Provide Order ID",
                error: true,
                success: false
            });
        }

        if (delivery_status && !["Pending", "Delivered"].includes(delivery_status)) {
            return response.status(400).json({
                message: "Invalid delivery status",
                error: true,
                success: false,
            });
        }
        if (payment_status && !["Pending", "Success"].includes(payment_status)) {
            return response.status(400).json({
                message: "Invalid delivery status",
                error: true,
                success: false,
            });
        }
        const updateOrder = await OrderModel.updateOne({ _id: id }, { ...request.body });

        return response.json({
            message: "Order updated successfully",
            data: updateOrder,
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};