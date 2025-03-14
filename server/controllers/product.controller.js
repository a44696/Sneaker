import ProductModel from "../models/product.model.js";

export const createProductController = async (request, response) => {
    try {
        const products = Array.isArray(request.body) ? request.body : [request.body];

        // Kiểm tra dữ liệu đầu vào của từng sản phẩm
        for (const productData of products) {
            const { name, image, category, subCategory, unit, stock, price, discount, description } = productData;

            if (!name || !image?.length || !category?.length || !subCategory?.length || !unit || stock === undefined || price === undefined || discount === undefined || !description) {
                return response.status(400).json({
                    message: "Enter required fields",
                    error: true,
                    success: false
                });
            }
        }

        // Thêm sản phẩm vào DB
        const savedProducts = await ProductModel.insertMany(products);

        return response.json({
            message: `${savedProducts.length} Product(s) Created Successfully`,
            data: savedProducts,
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


export const getProductController = async (request, response) => {
    try {
        let { page, limit, search } = request.body 
        
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        const [data, totalCount] = await Promise.all([
            ProductModel.find()
                .sort({ createdAt: -1 }) 
                .skip(skip)
                .limit(limit)
                .populate("category subCategory")
                .lean(),
            ProductModel.countDocuments()
        ]);

        return response.json({
            message: "Product data",
            error: false,
            success: true,
            totalCount,
            totalNoPage: Math.ceil(totalCount / limit),
            data: data.map(item => ({
                ...item,
                id: item._id.toString(),
            })),
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};


export const getProductByCategory = async(request,response)=>{
    try {
        const { id } = request.body 

        if(!id){
            return response.status(400).json({
                message : "provide category id",
                error : true,
                success : false
            })
        }

        const product = await ProductModel.find({ 
            category : { $in : id }
        }).limit(15)

        return response.json({
            message : "category product list",
            data : product,
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

  
export const getProductByCategoryAndSubCategory  = async(request,response)=>{
    try {
        const { categoryId,subCategoryId,page=1,limit=10 } = request.body

        if(!categoryId || !subCategoryId){
            return response.status(400).json({
                message : "Provide categoryId and subCategoryId",
                error : true,
                success : false
            })
        }

        const query = {
            category : { $in : categoryId  },
            subCategory : { $in : subCategoryId }
        }

        const skip = (page - 1) * limit

        const [data,dataCount] = await Promise.all([
            ProductModel.find(query).sort({createdAt : -1 }).skip(skip).limit(limit),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message : "Product list",
            data : data,
            totalCount : dataCount,
            page : page,
            limit : limit,
            success : true,
            error : false
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getProductDetails = async(request, response) => {
    try {
      const { productId } = request.body; // Lấy productId từ body
      
      const product = await ProductModel.findById(productId);  // Tìm sản phẩm theo ID
  
      if (!product) {
        return response.status(404).json({
          message: "Product not found",
          error: true,
          success: false
        });
      }
  
      return response.json({
        data: product,
        success: true,
        error: false,
      });
  
    } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false
      });
    }
  };


//update product
export const updateProductDetails = async(request,response)=>{
    try {
        const { productId } = request.body;

        if(!productId){
            return response.status(400).json({
                message : "provide product productId",
                error : true,
                success : false
            })
        }

        const updateProduct = await ProductModel.updateOne({ productId : productId },{
            ...request.body
        })

        return response.json({
            message : "updated successfully",
            data : updateProduct,
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

//delete product
export const deleteProductDetails = async(request,response)=>{
    try {
        const { productId } = request.body;

        if(!productId){
            return response.status(400).json({
                message : "provide _id ",
                error : true,
                success : false
            })
        }

        const deleteProduct = await ProductModel.deleteOne({_id : productId })

        return response.json({
            message : "Delete successfully",
            error : false,
            success : true,
            data : deleteProduct
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//search product
export const searchProduct = async (request, response) => {
    try {
        let { search, page, limit } = request.body;

        if (!page) page = 1;
        if (!limit) limit = 10;

        let query = {};
        let sortQuery = {};

        if (search) {
            query = {
                name: { $regex: search, $options: "i" } 
            };
            sortQuery = {
                isMatchStart: -1,
                createdAt: -1
            };
        }

        const skip = (page - 1) * limit;

        const data = await ProductModel.aggregate([
            {
                $match: query
            },
            {
                $addFields: {
                    isMatchStart: { $cond: [{ $regexMatch: { input: "$name", regex: `^${search}`, options: "i" } }, 1, 0] }
                }
            },
            { $sort: sortQuery },
            { $skip: skip },
            { $limit: limit }
        ]);

        const dataCount = await ProductModel.countDocuments(query);

        return response.json({
            message: "Product data",
            error: false,
            success: true,
            data: data,
            totalCount: dataCount,
            totalPage: Math.ceil(dataCount / limit),
            page: page,
            limit: limit,
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
};