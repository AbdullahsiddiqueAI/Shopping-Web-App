import React, { useState, useEffect } from "react";
import { AiOutlineFilter } from "react-icons/ai"; 
import "../css/Product.css";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import ProductListItem from "../Components/Products/ProductListItem";
import { useQuery } from "@tanstack/react-query";
import { getCategory, getProducts } from "../util/queries";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import Loader from "../Components/Common/Loader";
import SmallLoader from "../Components/Common/SmallLoader";

function Products() {
  const [searchParams] = useSearchParams();
  const location = useLocation(); 
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState("newest");
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || "all"); 

  const [categories, setCategories] = useState([
    { id: "all", name: "All Categories" },
  ]);
  useEffect(() => {

    document.title = "Products"; 
  }, [])

  const searchQuery = useSelector((state) => state.search.searchQuery);

  useEffect(() => {
    setProducts([]); 
    setPage(1); 
  }, [searchQuery, sortBy, selectedCategory, pageSize]);
// console.log("selectedCategory",selectedCategory)
  const { data, isLoading, error, isFetching, isSuccess } = useQuery({
    queryKey: [
      "products",
      {
        page,
        page_size: pageSize,
        sort_by: sortBy,
        category: selectedCategory,
        search_query: searchQuery,
      },
    ],
    queryFn: getProducts,
    keepPreviousData: true, 
  });

  const { data: CategoryData, isSuccess: CategorySuccess } = useQuery({
    queryKey: ["categoryData"],
    queryFn: getCategory,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setProducts((prev) => [...prev, ...data?.results.data]); 
      setHasMore(Boolean(data?.next != null)); 
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (CategorySuccess && CategoryData) {
      const formattedCategories = CategoryData.map((elem) => ({
        id: elem.category_id,
        name: elem.name,
      }));
      setCategories([
        { id: "all", name: "All Categories" },
        ...formattedCategories,
      ]); 
    }
  }, [CategorySuccess, CategoryData]);

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
  };

  const loadMoreProducts = () => {
    if (hasMore) {
      setPage((prev) => prev + 1); 
    }
  };

  // if (isLoading && page === 1) return <div>Loading products...</div>;
  if (error) return <div>Error loading products: {error.message}</div>;

  return (
    <>
      <NavBar />
      <div className="productsPage_container">
        <div className="productsPage_content">
          <div className="productPage_main_content">
            <div className="productPage_filter">
              <div className="category-filter-container">
                {showCategoryDropdown && (
                  <div className="category-dropdown">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="category-item"
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        {category.name}
                      </div>
                    ))}
                  </div>
                )}
                <AiOutlineFilter
                  className="filter-icon"
                  onClick={toggleCategoryDropdown}
                />
                <span className="selected-category">
                  {categories.find((cat) => cat.id === selectedCategory)?.name}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <div className="productPage_filter_content">
                  <span>Items per page</span>
                  <select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    style={{ width: "5rem" }}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                  </select>
                </div>

                <div className="productPage_filter_content">
                  <span>Sort by</span>
                  <select value={sortBy} onChange={handleSortByChange}>
                    <option value="low-to-high">Low to High</option>
                    <option value="high-to-low">High to Low</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>
              </div>
            </div>

            <main className="productsPage_product-list">
              {isLoading && <Loader/> && page==1}
              {(!isLoading && products.length==0) && (
                <div className="Product-not-Found">
                  Product Not Found
                </div>
              )}
              {products.map((product, index) => (
                <ProductListItem product={product} key={index} />
              ))}
            </main>

            {hasMore && (
              <button
                onClick={loadMoreProducts}
                disabled={isFetching}
                style={{backgroundColor:isFetching ?"initial":"#3c3c3c"}}
                className="productPage_see-more"
              >
                {isFetching ? <div style={{display:'grid',placeItems:"center",width:"100%",height:"100%"}}><SmallLoader/></div> : "See More"}
              </button>
              
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Products;
