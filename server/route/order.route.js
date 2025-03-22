import { Router } from 'express'
import auth from '../middleware/auth.js'
import { createNewOrderController, CashOnDeliveryOrderController, getOrderDetailsController} from '../controllers/order.controller.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.post("/create",auth,createNewOrderController)
orderRouter.get("/order-list",auth,getOrderDetailsController)

export default orderRouter