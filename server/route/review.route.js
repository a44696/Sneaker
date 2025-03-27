import express from "express";
import { 
    createReviewController, 
    getReviewsByProductController, 
    deleteReviewController 
} from "../controllers/ReviewController.js";

const router = express.Router();

router.post("/reviews", createReviewController);
router.get("/reviews/:productId", getReviewsByProductController);
router.delete("/reviews/:reviewId", deleteReviewController);

export default router;
