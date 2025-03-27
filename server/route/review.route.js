import express from "express";
import { 
    createReviewController, 
    getReviewsByProductController, 
    deleteReviewController 
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/create", createReviewController);
router.post("/get-review-product", getReviewsByProductController);
router.delete("/reviews/:reviewId", deleteReviewController);

export default router;
