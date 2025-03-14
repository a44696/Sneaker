import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  // Import useNavigate
import { FaShoppingCart, FaHeart } from "react-icons/fa";

interface Product {
  id: number;
  name: string;
  price: string | number;  // price có thể là số hoặc chuỗi
  image: string;
  discount: number;  // Thêm discount
}

interface ProductListProps {
  search: string;
  setSearch: (value: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ search, setSearch }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [likedProducts, setLikedProducts] = useState<number[]>([]); // State để theo dõi các sản phẩm đã thích
  const navigate = useNavigate();  // Khởi tạo navigate

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/products/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, limit: 12, search }), // Thay đổi limit để lấy 12 sản phẩm mỗi lần
      });

      if (!response.ok) {
        throw new Error("Lỗi khi gọi API");
      }

      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.totalNoPage);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  // Hàm điều hướng khi click vào sản phẩm
  const handleProductClick = (id: number) => {
    navigate(`/product-details/${id}`);  // Chuyển hướng đến trang chi tiết sản phẩm
  };

  // Hàm để thay đổi trạng thái liked của sản phẩm
  const handleLikeClick = (productId: number) => {
    setLikedProducts((prevLiked) =>
      prevLiked.includes(productId)
        ? prevLiked.filter((id) => id !== productId)
        : [...prevLiked, productId]
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-6 gap-4"> {/* Chỉnh số cột thành 6 */}
        {/* Danh mục bên trái */}
        <aside className="col-span-1 bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-bold mb-4">Danh mục</h2>
          <ul>
            {['Nike', 'Adidas', 'Jordan', 'Puma', 'Yeezy'].map((brand) => (
              <li key={brand} className="mb-2">
                <button className="text-blue-600 hover:underline" onClick={() => setSearch(brand)}>
                  {brand}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Danh sách sản phẩm */}
        <main className="col-span-5"> {/* Chỉnh lại cột sản phẩm */}
          <div className="relative">
            {/* Banner với chữ ghi đè */}
            <img src="/assets/img16.png" alt="Banner" className="w-full h-64 object-cover" />
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 p-4 text-white text-3xl ">
              <h2 className="font-bold ">Grocery store with different <br />treasures</h2>
              <p className="text-sm text-blue-500">We have prepared special discounts for you on grocery products...</p>
            </div>
          </div>
            {/* Nav Bar */}
          <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow-md mb-4 my-4">
              <span className="text-gray-600">Showing all 16 results</span>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Sort:</span>
                  <select className="bg-white border rounded px-2 py-1">
                    <option>Sort by latest</option>
                    
                  </select>
                </div>

                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Show:</span>
                  <select className="bg-white border rounded px-2 py-1">
                    <option>20 Items</option>
                    
                  </select>
                </div>
              </div>
            </div>
          <h1 className="text-2xl font-bold mb-4">Danh sách sản phẩm</h1>
          <div className="grid grid-cols-6 gap-4">
            {products.map((product) => {
              const price =
                typeof product.price === "string"
                  ? parseInt(product.price.replace(/[^0-9]/g, ""))
                  : product.price;
              const discountedPrice = product.discount > 0 ? price * (1 - product.discount / 100) : price;
              const isLiked = likedProducts.includes(product.id); // Kiểm tra sản phẩm có được thích hay không

              return (
                <div
                  key={product.id}
                  className="border p-4 rounded shadow cursor-pointer"
                  onClick={() => handleProductClick(product.id)} // Bấm vào sản phẩm để điều hướng
                >
                  <div className="relative">
                    {/* Hiển thị phần giảm giá ở góc trên bên trái */}
                    {product.discount > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white py-1 px-2 rounded-full text-sm font-semibold">
                        -{product.discount}%
                      </span>
                    )}

                    <img src={product.image} alt={product.name} className="w-full h-40 object-cover mb-2" />
                    {/* Thêm biểu tượng thích ở góc trên bên phải */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Ngừng sự kiện bọt để không trigger handleProductClick
                        handleLikeClick(product.id);
                      }}
                      className="absolute top-2 right-2 text-red-500"
                    >
                      <FaHeart color={isLiked ? "red" : "gray"} />
                    </button>
                  </div>

                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-red-500 font-bold">{price.toLocaleString()} VNĐ</p>

                  {/* Hiển thị giá sau khi giảm nếu có */}
                  {product.discount > 0 && (
                    <div className="text-green-500 mt-2">
                      <p className="line-through text-gray-400">{price.toLocaleString()} VNĐ</p>
                      <p className="text-lg font-bold">
                        {discountedPrice.toLocaleString()} VNĐ
                      </p>
                    </div>
                  )}

                  <button className="mt-2 p-2 bg-white text-green-500 rounded w-full flex mx-2">
                    <FaShoppingCart className="mr-8 text-green-500 w-8 h-8 " />
                    IN STOCK
                  </button>
                </div>
              );
            })}
          </div>

          {/* Phân trang */}
          <div className="mt-4 flex justify-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-2 bg-gray-300 rounded"
            >
              ◀ Trước
            </button>
            <span className="mt-2">Trang {page} / {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 bg-gray-300 rounded"
            >
              Sau ▶
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductList;
