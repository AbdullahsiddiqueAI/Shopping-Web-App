import React, { useState, useEffect } from 'react';
import '../css/Product.css';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import ProductListItem from '../Components/Products/ProductListItem';
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import { getProducts } from '../util/queries'; // Import the API function

function Products() {
  // State to manage page, page size, and sort by options
  const [page, setPage] = useState(1); // Default page is 1
  const [pageSize, setPageSize] = useState(5); // Default items per page is 10
  const [sortBy, setSortBy] = useState('newest'); // Default sort by newest
  const [products, setProducts] = useState([]); // Store all products
  const [hasMore, setHasMore] = useState(true); // If there are more products to load

  // Fetch products based on the current page, page size, and sort by options
  const { data, isLoading, error, isFetching,isSuccess } = useQuery({
    queryKey: ['products', { page, page_size: pageSize, sort_by: sortBy }],
    queryFn: getProducts,
    keepPreviousData: true, // Keep the previous data while fetching new data
   
  });
  useEffect(() => {
    if (isSuccess && data) {
      console.log(data)
      setProducts((prev) => [...prev, ...data?.results.data]);
      setHasMore(Boolean(data?.next!=null)); // Check if there are more pages
    }
  }, [isSuccess, data]);



  // Handle page size change
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1); // Reset to page 1 when page size changes
    setProducts([]); // Reset products
  };

  // Handle sort by change
  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
    setPage(1); // Reset to page 1 when sort changes
    setProducts([]); // Reset products
  };

  // Function to load more products when the "See More" button is clicked
  const loadMoreProducts = () => {
    if (hasMore) {
      setPage((prev) => prev + 1); // Increment page number to load more
    }
  };

  // Scroll Event Listener to Load More Products on Scroll
  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
    // Load more products if scrolled to bottom and there are more products to load
    loadMoreProducts();
  };

  // Add scroll event listener for infinite scroll
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
              {/* Items per page */}
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
