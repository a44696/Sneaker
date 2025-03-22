import { Router } from 'express'
import auth from '../middleware/auth.js'
import { createNewOrderController, CashOnDeliveryOrderController, getOrderDetails, getOrderDetailsbyUserController, getOrderController} from '../controllers/order.controller.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.post("/get-order-details",getOrderDetails)
orderRouter.post("/create",auth,createNewOrderController)
orderRouter.get("/order-list",auth,getOrderDetailsbyUserController)
orderRouter.post("/get",getOrderController)
export default orderRouter