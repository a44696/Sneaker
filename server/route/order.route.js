import { Router } from 'express'
import auth from '../middleware/auth.js'
import { createNewOrderController, deleteOrderDetails, getOrderListController, CashOnDeliveryOrderController, getOrderDetails, getOrderDetailsbyUserController, getOrderController} from '../controllers/order.controller.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.post("/get-order-details",getOrderDetails)
orderRouter.post("/create",auth,createNewOrderController)
orderRouter.get("/order-list",auth,getOrderDetailsbyUserController)
orderRouter.post("/get",getOrderController)
orderRouter.get("/get-order-list",getOrderListController)
orderRouter.delete("/delete",auth,deleteOrderDetails)
export default orderRouter