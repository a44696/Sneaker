import { Router } from 'express'
import auth from '../middleware/auth.js'
import { getCategoryDetails, AddCategoryController, deleteCategoryController, getCategoryController, updateCategoryController } from '../controllers/category.controller.js'

const categoryRouter = Router()

categoryRouter.post("/add-category",auth,AddCategoryController)
categoryRouter.post('/get',getCategoryController)
categoryRouter.post('/get-category-detail',getCategoryDetails)
categoryRouter.put('/update',auth,updateCategoryController)
categoryRouter.delete("/delete",auth,deleteCategoryController)

export default categoryRouter