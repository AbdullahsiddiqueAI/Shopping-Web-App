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
import { AiOutlineFilter } from "react-icons/ai";

Modal.setAppElement("#root"); // Required for accessibility

const ProductsPage = () => {
  const queryClient = useQueryClient();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', price: '', stock: '', description: '', productPic: null });

  const [previewImage, setPreviewImage] = useState(null); 

  const [page, setPage] = useState(1); 
  const [pageSize, setPageSize] = useState(5); 
  const [products, setProducts] = useState([]); 
  const [hasMore, setHasMore] = useState(true); 
  const [selectedCategory, setSelectedCategory] = useState("all"); 
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false); 
  useEffect(() => {
    document.title = "Dashboard | Product"; 
  }, [])
  
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: productsError,
    isFetching,
  } = useQuery({
    queryKey: [
      "products",
      { page, page_size: pageSize, category: selectedCategory,sort_by: 'newest', },
    ],
    queryFn: getProducts,
    keepPreviousData: true, 
  });


  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategory,
  });

  
  useEffect(() => {
    if (productsData && productsData.results?.data) {
      if (page === 1) {
        
        setProducts(productsData.results.data);
      } else {
        
        setProducts((prevProducts) => [
          ...prevProducts,
          ...productsData.results.data,
        ]);
      }
      
      setHasMore(!!productsData.next);
    }
  }, [productsData, page]);

  
  const createProductMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(); 
      setPage(1);
      closeModal();
      toast.success("Product added successfully!");
    },
    onError: () => {
      toast.error("Failed to add product.");
    },
  });

  
  const updateProductMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries();
      closeModal();
      toast.success("Product updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update product.");
    },
  });

  
  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: (deletedProductId) => {
     
      setProducts((prevProducts) =>
        prevProducts.filter(
          (product) => product.product_id !== deletedProductId.data.product_id
        )
      );
      toast.success("Product deleted successfully!");
      
    },
    onError: () => {
      toast.error("Failed to delete product.");
    },
  });

  
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
      (product?.productPic ?`${import.meta.env.VITE_BACKEND_END_POINT_image}${product?.productPic}`: 
        null)
    ); 
    setModalIsOpen(true);
  };


  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentProduct(null);
    setPreviewImage(null);
  };

  
  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProduct({ ...newProduct, productPic: file }); 
      setPreviewImage(URL.createObjectURL(file)); 
    }
  };


  const handleCategoryChange = (e) => {
    const selectedCategory = categories.find(
      (cat) => cat.category_id === e.target.value
    );
    setNewProduct({ ...newProduct, category: selectedCategory });
  };


  const toggleCategoryDropdown = () => {
    setShowCategoryDropdown(!showCategoryDropdown);
  };

  
  const handleCategorySelect = (categoryId) => {
    if(selectedCategory != categoryId){

      setSelectedCategory(categoryId);
      setPage(1); 
      setProducts([]);
    } 
    setShowCategoryDropdown(false);
  };

 
  const loadMoreProducts = () => {
    setPage((prevPage) => prevPage + 1); 
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();

    
    const formData = new FormData();

 
    for (const key in newProduct) {
      if (isEditing) {
       
        if (newProduct[key] !== currentProduct[key]) {
          if (key == "category") {
            formData.append(key, newProduct[key].category_id);
          } else {
            formData.append(key, newProduct[key]);
          }
        }
      } else {
       
        if (key == "category") {
          formData.append(key, newProduct[key].category_id);
        } else {
          if(key == "productPic"){
            if(newProduct[key]){
              formData.append(key, newProduct[key]);
            }
            }
            else{

              formData.append(key, newProduct[key]);
            }
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
      
      createProductMutation.mutate({ formData });
    }
  };


  const handleDelete = (id) => {
    deleteProductMutation.mutate(id);
  };

  if (isLoadingProducts || isCategoriesLoading) {return <div style={{width:"100vw",height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"}}>
    
    <Loader />;
    </div>} 
  if (productsError || categoriesError) return <div>Error loading data</div>;

  return (
    <div className="products-page">
      <h1>Products</h1>
      <button className="btn" onClick={() => openModal()}>
        Add Product <FaPlus className="FaPlus-icon" />
      </button>

      {/* Product Filter */}
      {/* <div className="productPage_filter"> */}
        <div style={{display:"flex",position:"relative"}}>
          <span className="filter-label">Filter by Category:</span>
          <button onClick={toggleCategoryDropdown} className="Dashboard-filter-dropdown">
          <AiOutlineFilter
                  className="filter-icon"
                  // onClick={toggleCategoryDropdown}
                /> 

                {selectedCategory === "all"
              ? "All Categories"
              : categories?.find((cat) => cat.category_id === selectedCategory)?.name || "Select Category"}
          </button>
          {showCategoryDropdown && (
            <div className="category-dropdown" style={{left:'90px'}}>
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
      {/* </div> */}

     
      {(!isLoadingProducts && products.length==0) && (
                <div className="Product-not-Found" style={{width: "100%",height:"100%"}}>
                  Product Not Found
                </div>
              )}
      {(products.length>0) &&<div className="products-list">
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
                <td>{product.description.length > 20 ? product.description.slice(0,50) + "...": product.description.slice(0,20)}</td>
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
}
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
          <label >
  Is featured:
  <input
    type="checkbox"
    name="is_featured"
    checked={newProduct.is_featured} // use checked for checkbox state
    onChange={handleChange}
    // required
    style={{width:'10%'}}
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

          <button type="submit" className="btn" disabled={createProductMutation.isPending || updateProductMutation.isPending}>
            {isEditing ? "Update Product" : "Add Product"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ProductsPage;
