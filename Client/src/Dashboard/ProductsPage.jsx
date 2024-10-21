import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaPlus, FaTimes } from "react-icons/fa"; // Import the X icon
import "../css/Dashboard/ProductsPage.css";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategory,
} from "../util/queries";
import Loader from "../Components/Common/Loader";
import SmallLoader from "../Components/Common/SmallLoader";
import { toast } from "react-toastify";

Modal.setAppElement("#root"); // Required for accessibility

const ProductsPage = () => {
  const queryClient = useQueryClient();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', stock: '', description: '', productPic: null });

  const [previewImage, setPreviewImage] = useState(null); // Preview image before uploading

  const [page, setPage] = useState(1); // Track the current page
  const [pageSize, setPageSize] = useState(5); // Track the number of items per page
  const [products, setProducts] = useState([]); // Store the products for the current page
  const [hasMore, setHasMore] = useState(true); // Check if more products are available
  const [selectedCategory, setSelectedCategory] = useState("all"); // Store the selected category
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false); // Toggle for category dropdown

  // Fetch products from the API with pagination
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
    isFetching,
  } = useQuery({
    queryKey: [
      "products",
      { page, page_size: pageSize, category: selectedCategory },
    ],
    queryFn: getProducts,
    keepPreviousData: true, // Keep old data while fetching new data
  });

  // Fetch categories for the dropdown
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategory,
  });

  // Handle products loading and pagination
  useEffect(() => {
    if (productsData && productsData.results?.data) {
      if (page === 1) {
        // Replace products when loading a new category or on initial load
        setProducts(productsData.results.data);
      } else {
        // Concatenate products when clicking "See More"
        setProducts((prevProducts) => [
          ...prevProducts,
          ...productsData.results.data,
        ]);
      }
      // Check if more products are available
      setHasMore(!!productsData.next);
    }
  }, [productsData, page]);

  // Mutation for adding a new product
  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(); // Invalidate all cached data
      setPage(1);
      closeModal();
      toast.success("Product added successfully!");
    },
    onError: () => {
      toast.error("Failed to add product.");
    },
  });

  // Mutation for updating a product
  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(); // Invalidate all cached data
      closeModal();
      toast.success("Product updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update product.");
    },
  });

  // Mutation for deleting a product
  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (deletedProductId) => {
      // Remove the deleted product from local state
      setProducts((prevProducts) =>
        prevProducts.filter(
          (product) => product.product_id !== deletedProductId.data.product_id
        )
      );
      toast.success("Product deleted successfully!");
      // queryClient.invalidateQueries(); // Invalidate all cached data
    },
    onError: () => {
      toast.error("Failed to delete product.");
    },
  });

  // Open the modal for adding or editing
  const openModal = (product = null) => {
    setIsEditing(!!product);
    setCurrentProduct(product);
    setNewProduct(
      product || {
        name: "",
        category: "",
        price: "",
        stock: "",
        description:"",
        productPic: null,
      }
    );
    setPreviewImage(
      `${import.meta.env.VITE_BACKEND_END_POINT_image}${product.productPic}` ||
        null
    ); // Set the image for preview
    setModalIsOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentProduct(null);
    setPreviewImage(null);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, productPic: file }); // Store the file in newProduct
      setPreviewImage(URL.createObjectURL(file)); // Show a preview of the image
    }
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    const selectedCategory = categories.find(
      (cat) => cat.category_id === e.target.value
    );
    setNewProduct({ ...newProduct, category: selectedCategory });
  };

  // Toggle category dropdown visibility
  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  // Handle category selection for filtering products
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setPage(1); // Reset page
    setProducts([]); // Clear products
    setShowCategoryDropdown(false);
  };

  // Load more products (pagination)
  const loadMoreProducts = () => {
    setPage((prevPage) => prevPage + 1); // Increment the page number to fetch the next page
  };

  // Add or Edit Product
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a FormData object to handle form submission (for both create and update)
    const formData = new FormData();

    // Add the product ID to formData (required for updating)

    // formData.append('product_id', currentProduct.product_id);

    // Add the rest of the fields (only changed fields for editing)
    for (const key in newProduct) {
      if (isEditing) {
        // Add only the fields that have changed
        if (newProduct[key] !== currentProduct[key]) {
          if (key == "category") {
            formData.append(key, newProduct[key].category_id);
          } else {
            formData.append(key, newProduct[key]);
          }
        }
      } else {
        // For new product creation, add all fields
        if (key == "category") {
          formData.append(key, newProduct[key].category_id);
        } else {
          formData.append(key, newProduct[key]);
        }
      }
    }

    if (isEditing) {
      // Check if there's anything to update
      const updatedFields = {};
      for (const key in newProduct) {
        if (newProduct[key] !== currentProduct[key]) {
          updatedFields[key] = newProduct[key];
        }
      }

      if (Object.keys(updatedFields).length > 0) {
        // Make the update request with FormData
        updateProductMutation.mutate({
          formData,
          product_id: currentProduct.product_id,
        });
      } else {
        console.log("No changes detected");
        closeModal(); // Close the modal if no changes were made
      }
    } else {
      // Creating a new product with FormData
      createProductMutation.mutate({ formData });
    }
  };

  // Delete product
  const handleDelete = (id) => {
    deleteProductMutation.mutate(id);
  };

  if (isLoadingProducts || isCategoriesLoading) return <Loader />;
  if (productsError || categoriesError) return <div>Error loading data</div>;

  return (
    <div className="products-page">
      <h1>Products</h1>
      <button className="btn" onClick={() => openModal()}>
        Add Product <FaPlus className="FaPlus-icon" />
      </button>

      {/* Product Filter */}
      <div className="productPage_filter">
        <div className="category-filter-container">
          <span className="filter-label">Filter by Category</span>
          <button onClick={toggleCategoryDropdown} className="filter-dropdown">
            {selectedCategory === "all"
              ? "All Categories"
              : categories?.find((cat) => cat.category_id === selectedCategory)
                  ?.name || "Select Category"}
          </button>
          {showCategoryDropdown && (
            <div className="category-dropdown">
              <div
                key="all"
                className="category-item"
                onClick={() => handleCategorySelect("all")}
              >
                All Categories
              </div>
              {categories.map((category) => (
                <div
                  key={category.category_id}
                  className="category-item"
                  onClick={() => handleCategorySelect(category.category_id)}
                >
                  {category.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Products List */}
      <div className="products-list">
        <table>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.product_id}>
                <td>#{String(product.product_id).slice(0, 4)}</td>
                <td>
                  {product.productPic ? (
                    <img
                      src={`${import.meta.env.VITE_BACKEND_END_POINT_image}${
                        product.productPic
                      }`}
                      alt={product.name}
                      className="product-img"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.category.name}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
                <td>{product.description}</td>
                <td>
                  <button
                    className="btn edit-btn"
                    onClick={() => openModal(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn delete-btn"
                    onClick={() => handleDelete(product.product_id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* See More Button for Pagination */}
      {hasMore && (
        <button
          onClick={loadMoreProducts}
          disabled={isFetching}
          className="productPage_see-more"
        >
          {isFetching ? <SmallLoader /> : "See More"}
        </button>
      )}

      {/* Modal for Create/Edit */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Product Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <button className="close-modal" onClick={closeModal}>
          <FaTimes />
        </button>
        <h2>{isEditing ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={newProduct.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Category:
            <select
              name="category"
              value={newProduct.category?.category_id || ""}
              onChange={handleCategoryChange}
              required
            >
              <option value="">Select Category</option>
              {categories &&
                categories.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.name}
                  </option>
                ))}
            </select>
          </label>

          <label>
            Price:
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Stock:
            <input
              type="number"
              name="stock"
              value={newProduct.stock}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Description:
            <br />
            <textarea
              name="description"
              value={newProduct.description}
              onChange={handleChange}
                style={{width: '100%'}}
              required
            />
          </label>

          <label>
            Image:
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>

          {previewImage && (
            <div className="image-preview">
              <h3>Image Preview:</h3>
              <img src={previewImage} alt="Preview" />
            </div>
          )}

          <button type="submit" className="btn">
            {isEditing ? "Update Product" : "Add Product"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ProductsPage;
