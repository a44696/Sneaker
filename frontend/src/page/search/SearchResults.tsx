import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import LeftsideBar from "../../components/Layout/LeftsideBar";

const SearchResults = ({ search }: { search: string }) => {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const query = searchParams.get("query") || search;
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const brand = searchParams.get("brand");
    const status = searchParams.get("status");

    // Tạo đối tượng request body với các tham số từ searchParams
    const requestBody = {
      page: 1,
      limit: 12,
      search: query,
      minPrice: minPrice ? parseInt(minPrice) : 0,
      maxPrice: maxPrice ? parseInt(maxPrice) : 10000000,
      brand: brand || 'Tất cả sản phẩm',
      status: status || 'Tất cả sản phẩm', // Gửi trạng thái tìm kiếm
    };

    if (query || minPrice || maxPrice || brand || status) {
      fetch("http://localhost:8080/api/product/search-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProducts(data.data);  // Cập nhật sản phẩm khi tìm kiếm thành công
          } else {
            setProducts([]); // Không có sản phẩm thì làm rỗng mảng
          }
        })
        .catch((error) => console.error("Lỗi khi tìm kiếm sản phẩm:", error));
    }
  }, [searchParams, search]);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-1">
          <LeftsideBar />
        </div>
        <main className="col-span-5">
          <h2 className="text-2xl font-bold mb-4">Kết quả tìm kiếm</h2>

          {products.length === 0 ? (
            <p className="text-center text-lg text-red-500">Không có sản phẩm nào được tìm thấy</p>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border p-4 rounded shadow">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 object-cover mb-2"
                  />
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-red-500 font-bold">{product.price} VNĐ</p>

                  {/* Hiển thị trạng thái nếu có */}
                  {product.status && (
                    <p className={`text-sm mt-2 ${product.status === "In Stock" ? 'text-green-500' : 'text-yellow-500'}`}>
                      {product.status === "In Stock" ? "Còn hàng" : "Giảm giá"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchResults;
