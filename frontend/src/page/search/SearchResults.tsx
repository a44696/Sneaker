import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Pagination } from "@mui/material"; // Import Pagination
import LeftsideBar from "../../components/Layout/LeftsideBar";

const SearchResults = ({ search }: { search: string }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang để dùng cho Pagination

  const fetchProducts = async (pageNumber = 1,minPrice: any,maxPrice: any, search:any) => {
    try {
      const response = await fetch("http://localhost:8080/api/product/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: pageNumber, limit: 12, search, minPrice, maxPrice}), // Lấy 12 sản phẩm mỗi trang
      });

      if (!response.ok) throw new Error("Lỗi khi gọi API");

      const data = await response.json();
      if (data.success) {
        const productsWithId = data.data.map((product: any) => ({
          ...product,
          id: product._id,
        }));
        setProducts(productsWithId);
        setTotalPages(data.totalNoPage); // Cập nhật tổng số trang
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
    }
  };

  useEffect(() => {
    const query = searchParams.get("query") || "" ;
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const category = searchParams.get("brand");
    const search = searchParams.get("search");

    const requestBody = {
      page,
      limit: 12,
      search: search,
      query: query,
      minPrice: minPrice ? parseInt(minPrice) : 0,
      maxPrice: maxPrice ? parseInt(maxPrice) : 10000000,
      category: category !== "Tất cả sản phẩm" ? category : undefined,
    };
    console.log(requestBody)
    if (
      requestBody.query === "" 
    ) {
      fetchProducts(page, minPrice, maxPrice, search); // Nếu không có filter thì lấy tất cả sản phẩm
    } else {
      fetch("http://localhost:8080/api/product/get-product-by-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProducts(data.data);
            setTotalPages(data.totalNoPage); // Cập nhật tổng số trang
          } else {
            setProducts([]);
            setTotalPages(1);
          }
        })
        .catch((error) => console.error("Lỗi khi tìm kiếm sản phẩm:", error));
    }
  }, [searchParams, search, page]); // Theo dõi page để load lại sản phẩm khi chuyển trang

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value); // Cập nhật trang hiện tại
  };

  return (
    <div className="container mx-auto p-4 !max-w-full">
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-1">
          <LeftsideBar />
        </div>
        <main className="col-span-5 flex flex-col min-h-screen">
          <h2 className="text-2xl font-bold mb-4">Kết quả tìm kiếm</h2>

          <div className="flex-grow"> 
            {/* Nội dung danh sách sản phẩm */}
            {products.length === 0 ? (
              <p className="text-center text-lg text-red-500">
                Không có sản phẩm nào được tìm thấy
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {products.map((product) => (
                  <Link
                    to={`/product-details/${product._id}`}
                    key={product.id}
                    className="border p-4 rounded shadow"
                  >
                    <img
                      src={product.image[0]}
                      alt={product.name}
                      className="w-full h-40 object-cover mb-2"
                    />
                    <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                    <p className="mt-auto text-red-500 font-bold text-right">{product.price} VNĐ</p>
                    {product.status && (
                      <p
                        className={`text-sm mt-2 ${
                          product.status === "In Stock"
                            ? "text-green-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {product.status === "In Stock" ? "Còn hàng" : "Giảm giá"}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Pagination luôn ở cuối */}
          <div className="flex justify-center mt-6">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchResults;
