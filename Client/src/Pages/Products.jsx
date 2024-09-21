import React, { useState, useEffect } from 'react';
import { AiOutlineFilter } from 'react-icons/ai'; // Import the Filter icon from react-icons
import '../css/Product.css';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import ProductListItem from '../Components/Products/ProductListItem';
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import { getCategory, getProducts } from '../util/queries'; // Import the API function
import { useLocation } from 'react-router';
import { useSelector } from 'react-redux';

function Products() {
  const location = useLocation();  // Use this hook to access the current URL
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState([]);  // This will hold the list of products
  const [hasMore, setHasMore] = useState(true);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([{ id: 'all', name: 'All Categories' }]);

  // Extract search query from URL parameters
  const searchQuery = useSelector((state) => state.search.searchQuery);
  // Reset products when search query, sortBy, category, or page size changes
  useEffect(() => {
    setProducts([]);  // Clear previous product list when any key parameter changes
    setPage(1);  // Reset to first page
  }, [searchQuery, sortBy, selectedCategory, pageSize]);

  // Fetch products based on current page, page size, sort by options, and search query
  const { data, isLoading, error, isFetching, isSuccess } = useQuery({
    queryKey: ['products', { page, page_size: pageSize, sort_by: sortBy, category: selectedCategory, search_query: searchQuery }],
    queryFn: getProducts,
    keepPreviousData: true,  // Keep previous data until new data is fetched
  });

  const { data: CategoryData, isSuccess: CategorySuccess } = useQuery({
    queryKey: ['categoryData'],
    queryFn: getCategory,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setProducts((prev) => [...prev, ...data?.results.data]);  // Append new products to the list
      setHasMore(Boolean(data?.next != null));  // Check if there are more pages
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (CategorySuccess && CategoryData) {
      const formattedCategories = CategoryData.map((elem) => ({
        id: elem.category_id,
        name: elem.name,
      }));
      setCategories([{ id: 'all', name: 'All Categories' }, ...formattedCategories]);  // Add "All Categories" to the top
    }
  }, [CategorySuccess, CategoryData]);

  // Handle page size change
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  // Handle sort by change
  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
  };

  // Toggle the category dropdown
  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  // Select category
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
  };

  // Function to load more products when the "See More" button is clicked
  const loadMoreProducts = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);  // Increment page number to load more
    }
  };

  // Handle loading and error states
  if (isLoading && page === 1) return <div>Loading products...</div>;
  if (error) return <div>Error loading products: {error.message}</div>;

  return (
    <>
      <NavBar />
      <div className="productsPage_container">
        <div className="productsPage_content">
          <div className="productPage_main_content">
            <div className="productPage_filter">
              {/* Filter Icon and Dropdown */}
              <div className="category-filter-container">
                <AiOutlineFilter className="filter-icon" onClick={toggleCategoryDropdown} />
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
                <span className="selected-category">
                  {categories.find((cat) => cat.id === selectedCategory)?.name}
                </span>
              </div>

              {/* Items per page */}
              <div style={{display:'flex',justifyContent:'space-between',gap:"1rem"}}>
                <div className="productPage_filter_content">
                  <span>Items per page</span>
                  <select value={pageSize} onChange={handlePageSizeChange} style={{ width: '5rem' }}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                  </select>
                </div>

                {/* Sort by options */}
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
              {/* Dynamically display products */}
              {products.map((product, index) => (
                <ProductListItem product={product} key={index} />
              ))}
            </main>

            {/* Pagination controls */}
            {hasMore && (
              <button onClick={loadMoreProducts} disabled={isFetching} className="productPage_see-more">
                {isFetching ? 'Loading more...' : 'See More'}
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
