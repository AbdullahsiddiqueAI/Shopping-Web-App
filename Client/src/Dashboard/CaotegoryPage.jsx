import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaTimes } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategory, createCategory, updateCategory, deleteCategory } from '../util/queries';
import Loader from '../Components/Common/Loader';
import { toast } from 'react-toastify';
import '../css/Dashboard/CategoryPage.css'

import { FaPlus } from "react-icons/fa";


Modal.setAppElement('#root'); // Required for accessibility

const CategoryPage = () => {
  const queryClient = useQueryClient();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({ name: '', description: '', Categoryicon: null });
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    document.title = "Dashboard | Category"; // Change this title as needed
  }, [])
  // Fetch categories from the API
  const { data: categoriesData, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategory,
  });

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  // Mutation for adding a new category
  const createCategoryMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      closeModal();
      toast.success('Category added successfully!');
    },
    onError: () => {
      toast.error('Failed to add category.');
    }
  });

  // Mutation for updating a category
  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      closeModal();
      toast.success('Category updated successfully!');
    },
    onError: () => {
      toast.error('Failed to update category.');
    }
  });

  // Mutation for deleting a category
  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (deletedCategoryId) => {

      setCategories((prevCategories) =>
        prevCategories.filter((category) => String(category.category_id) != String(deletedCategoryId.data.category_id))
      );
      toast.success('Category deleted successfully!');
    },
    onError: () => {
      toast.error('Failed to delete category.');
    }
  });

  // Open the modal for adding or editing
  const openModal = (category = null) => {
    setIsEditing(!!category);
    setCurrentCategory(category);
    setNewCategory(category || { name: '', description: '', Categoryicon: null });
    setModalIsOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentCategory(null);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCategory({ ...newCategory, Categoryicon: file });
    }
  };

  // Add or Edit Category
// Add or Edit Category
const handleSubmit = (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append('name', newCategory.name);
  formData.append('description', newCategory.description);
  
  // Append the image file if it exists
  if (newCategory.Categoryicon) {
    if (isEditing) {

      if(currentCategory.Categoryicon !=newCategory.Categoryicon){
  
        formData.append('Categoryicon', newCategory.Categoryicon);
      }
    }else{
      
      formData.append('Categoryicon', newCategory.Categoryicon);
    }
  }

  if (isEditing) {
   
    
    updateCategoryMutation.mutate({ formData, category_id: currentCategory.category_id });
  } else {
    createCategoryMutation.mutate(formData);
  }
};


  // Delete category
  const handleDelete = (id) => {
    deleteCategoryMutation.mutate(id);
  };

  if (isLoading) return <Loader />;
  if (error) return <div>Error loading categories</div>;

  return (
    <div className="category-page">
      <h1>Categories</h1>
      <button className="btn" onClick={() => openModal()}>Add Category <FaPlus className='FaPlus-icon'/></button>

      {/* Categories List */}
      <div className="categories-list">
        <table>
          <thead>
            <tr>
              <th>Category ID</th>
              <th>Icon</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((category) => (
              <tr key={category.category_id}>
                <td>#{String(category.category_id).slice(0,4)}</td>
                <td>
                  {category.Categoryicon ? (
                    <img
                      src={`${import.meta.env.VITE_BACKEND_END_POINT_image}${category.Categoryicon}`}
                      alt={category.name}
                      className="category-icon"
                    />
                  ) : (
                    'No Icon'
                  )}
                </td>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td>
                  <button className="btn edit-btn" onClick={() => openModal(category)}>
                    Edit
                  </button>
                  <button className="btn delete-btn" onClick={() => handleDelete(category.category_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Create/Edit */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Category Modal"
        className="modal"
        overlayClassName="modal-overlay"
      >
        <button className="close-modal" onClick={closeModal}>
          <FaTimes />
        </button>
        <h2>{isEditing ? 'Edit Category' : 'Add Category'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={newCategory.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Description:
            <input
              type="text"
              name="description"
              value={newCategory.description}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Icon:
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>

          <button type="submit" className="btn">
            {isEditing ? 'Update Category' : 'Add Category'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default CategoryPage;
