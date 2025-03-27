import  { useState, useEffect } from "react";
import { Avatar, Pagination ,Button, TextField, IconButton } from "@mui/material";
import { BiBold, BiItalic, BiUnderline, BiImage, BiSmile, BiLink, BiAt } from "react-icons/bi";
import axios from "axios";
import Box from '@mui/material/Box';

import Rating from '@mui/material/Rating';
interface User {
    _id: string;
    avatar: string;
    name: string;
    email: string;
  }
  interface ProductReview{
    _id: string;
    product: string;
    user: {
        _id: string;
        avatar: string;
        name: string;
        email: string;
    };
    comment: string;
    rating: number;
    createdAt: string;
  }
const CommentSection: React.FC<{ productId: any }> = ({ productId }) => {
    const [page, setPage] = useState(1);
    const commentsPerPage = 5;
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(5);
    const [user, setUser] = useState<User | null>(null);
    const [productReview, setProductReview] = useState<ProductReview[] | null>([]);
    
    useEffect(() => {
        fetchData();
    },[])
    const fetchData = async() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
        }
        try{
           
            const reviewResponse = await axios.post("http://localhost:8080/api/review/get-review-product", {productId: productId});
            console.log(reviewResponse.data)
            setProductReview(reviewResponse.data?.data);
        } catch (error) {
            console.error("Failed to fetch review product:", error);
        }
        
    }
    
    const handleSubmit = async () => {
        const review = {
            product: productId,
            user: user?._id,
            comment,
            rating,
        }
        try {
            console.log(review);
            await axios.post("http://localhost:8080/api/review/create", review);
            
            window.location.reload();
        } catch (error) {
            console.error("Failed to add review:", error);
        }
        setComment("");
    };
    const totalPages = Math.ceil((productReview?.length || 0) / commentsPerPage);
    const displayedReviews = productReview?.slice((page - 1) * commentsPerPage, page * commentsPerPage);
    return (
        <div className="max-w-full mx-auto bg-white p-4 shadow-md rounded-md">
       
        {/* Input comment */}
        <div className="border p-3 rounded-md">
         {/*rating */}
            <Box sx={{ '& > legend': { mt: 2 } }}>
            <Rating
            name="simple-controlled"
            value={rating}
            onChange={(event, newValue: number | null) => {
                if (newValue !== null) {
                    setRating(newValue);
                }
            }}
            />
            </Box> 
            <TextField
            fullWidth
            variant="standard"
            placeholder="Add comment..."
            multiline
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            InputProps={{ disableUnderline: true }}
            />

            {/* Toolbar */}
            <div className="flex justify-between items-center mt-2">
            <div className="flex space-x-2">
                <IconButton size="small"><BiBold /></IconButton>
                <IconButton size="small"><BiItalic /></IconButton>
                <IconButton size="small"><BiUnderline /></IconButton>
                <IconButton size="small"><BiLink /></IconButton>
                <IconButton size="small"><BiImage /></IconButton>
                <IconButton size="small"><BiSmile /></IconButton>
                <IconButton size="small"><BiAt /></IconButton>
            </div>

            <Button variant="contained" color="warning" onClick={handleSubmit}>
                Submit
            </Button>
            </div>
        </div>

        <div className="mt-6">
            {/* List comments */}
            {displayedReviews?.map((review) => (
                <div key={review._id} className="mt-6">
                    <div className="flex items-start space-x-3 border-b pb-4">
                        <Avatar src={review?.user?.avatar} />
                        <div>
                            <div className="flex items-center space-x-2">
                                <p className="font-semibold">
                                    {review?.user?.name}{" "}
                                    <span className="text-gray-400 text-sm">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </p>
                                <Rating name="read-only" value={review.rating} readOnly />
                            </div>
                            <p className="text-gray-600 mt-1">{review.comment}</p>
                        </div>
                    </div>
                </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-4">
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                        color="primary"
                    />
                </div>
            )}
        </div>
        
        </div>
  );
};

export default CommentSection;
