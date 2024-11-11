import instance from "./axios";
// auth
export const loginUser = async (data) => {
  try {
        const Data={
          'email':data.Email,
          'password':data.Password,
        }
  
    const response = await instance.post("login/", Data);
    // Assuming the server returns an access token
    // if (response.status == 200) {
    //   localStorage.setItem("access", response.data.tokens.access);
    //   // console.log("Login",response.data)
      
    // }
    
    return response;
  } catch (error) {
    console.log("error",error);
    throw new Error(error.response.data.error);
    // if (error.response.status === 400) {
    //   return {
    //     error: error.response.data.errors.email[0],
    //     status: error.response.status,
    //   };
    // }
    // if (error.response.status === 404) {
    //   return {
    //     status: error.response.status,
    //     statusText: error.response.statusText,
    //   };
    // }
  }
};



export const signupUser = async (formData) => {
    try {
        const form = new FormData();
        form.append('first_name', formData.Fname);
        form.append('last_name', formData.Lname);
        form.append('email', formData.Email);
        form.append('password', formData.Password);
        form.append('address', formData.Address);
        console.log(form)
    
      // Append the image if the user uploaded a profile picture
        if (formData.Picture) {
          form.append('profilePhoto', formData.Picture);
        }
      
      const response = await instance.post("signup/", form,{
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    
      // Assuming the server returns an access token
      localStorage.setItem("access", response.data.tokens.access);
      
     
      // localStorage.setItem("refresh", response.data.token.refresh);
      return response;
    } catch (error) {
      console.log("error",error);
      throw new Error(error.response.data.error);
      // throw new Error(JSON.stringify(error.response.data.error));
    }
  };

  export const getProducts = async ({ queryKey }) => {
    const [_key, { page, page_size, sort_by, category, search_query }] = queryKey;
    
    // Build the query string based on parameters
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (page_size) params.append('page_size', page_size);
    if (sort_by) params.append('sort_by', sort_by);
    if (category) params.append('category', category);
    if (search_query) params.append('search', search_query);  // Add search query
  
    const response = await instance.get(`products/?${params.toString()}`);
    return response.data;
  };
  
  
export const getProduct = async (id) => {
    try {
       
      const response = await instance.get(`products/${id}/`);
      return response.data.data;
    } catch (error) {
      console.log("error",error);
      throw new Error(error.response.data.error);
      // throw new Error(JSON.stringify(error.response.data.error));
    }
  };
export const getFeaturedProduct = async () => {
    try {
       
      const response = await instance.get(`products/FeaturedProduct`);
      return response.data.data;
    } catch (error) {
      console.log("error",error);
      throw new Error(error.response.data.error);
      // throw new Error(JSON.stringify(error.response.data.error));
    }
  };


  export const createProduct = async ({formData}) => {
    try {
    // Create a new FormData object to handle form data
    // const formData = new FormData();
  
    // // Append fields to FormData
    // formData.append('name', product.name);
    // formData.append('category', product.category.category_id);
    // formData.append('product_id', product.product_id);
    // formData.append('price', product.price);
    // formData.append('stock', product.stock);
  
    // // Append image if it exists
    // if (product.productPic) {
    //   formData.append('productPic', product.productPic);
    // }
  
    // Make API call using Axios instance
    const { data } = await instance.post('/products/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  
    return data;
  } catch (error) {
    console.log('error', error);
    throw new Error(error.response.data.error);
  }
  };
  
  // Edit product
  export const updateProduct = async ({formData,product_id}) => {
    try {
    // const formData = new FormData();
  
    // // Append each field to the form data
    // formData.append('name', product.name);
    // formData.append('category', product.category.category_id);
    // formData.append('product_id', product.product_id);
    // formData.append('price', product.price);
    // formData.append('stock', product.stock);
  
    // // If there's an image file, append it to the FormData
    // console.log("product",product);
    
    // if (product.productPic) {
    //   formData.append('productPic', product.productPic);
    // }
  
    // Make API call using the Axios instance
    const { data } = await instance.patch(`/products/${product_id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  
    return data;
  } catch (error) {
    console.log('error', error);
    throw new Error(error.response.data.error);
  }
  };
  
  // Delete product
  export const deleteProduct = async (id) => {
try{
    const { data } = await instance.delete(`products/${id}/`);
    return data;
  } catch (error) {
    console.log('error', error);
    throw new Error(error.response.data.error);
  }
  };

  export const getCartData = async () => {
    try {
      const response = await instance.get('order-items/');
      return response.data.data;
    } catch (error) {
      console.log('error', error);
      throw new Error(error.response.data.error);
    }
  };
  
  // Update Cart Item
  // export const updateCartItem = async ({ id, quantity }) => {
  //   try {
  //     const response = await instance.patch(`order-items/${id}/`, { quantity });
  //     return response.data;
  //   } catch (error) {
  //     console.log('error', error);
  //     throw new Error(error.response.data.error);
  //   }
  // };
  
  // Delete Cart Item
  export const deleteCartItem = async (id) => {
    try {
      console.log("id",id)
      const response = await instance.delete(`order-items/${(id.split('-')).join('')}/`);
      return response.data;
    } catch (error) {
      console.log('error', error);
      throw new Error(error.response.data.error);
    }
  };
  export const addCartItem = async (item) => {
    try {
      console.log("item",item)
      const response = await instance.post(`order-items/`, item);
      return response.data;
    } catch (error) {
      console.log('Error adding to cart:', error);
      throw new Error(error.response?.data?.error || 'Error adding item to cart');
    }
  };
  
  export const userDataUpdate= async (formData)=>{
    try{
      const response= await instance.post('user/',formData);
      return response.data.data;
    }
    catch(error){
      console.log('Error in user API', error.response?.data?.error);
      if(error.response?.data?.errors?.non_field_errors[0]){

        throw new Error(error.response?.data?.errors?.non_field_errors[0]);
      }
      else{
        throw new Error(error.response?.data?.error); 
      }
    }
    

  }
  export const getUserData= async (formData)=>{
    try{
      const response= await instance.get('user/');
      return response.data;
    }
    catch(error){
      console.log('Error in user API', error.response?.data?.error);
      if(error.response?.data?.errors?.non_field_errors[0]){

        throw new Error(error.response?.data?.errors?.non_field_errors[0]);
      }
      else{
        throw new Error(error.response?.data?.error); 
      }
    }
    

  }


  export const getCategory = async () => {
    try {
      const response = await instance.get('categories/');
      return response.data.data; // Adjust based on your API response structure
    } catch (error) {
      console.log('Error fetching categories:', error);
      throw new Error(error.response?.data?.error || 'Error fetching categories');
    }
  };
  
  export const createCategory = async (formData) => {
    try {
      const response = await instance.post('categories/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.log('Error creating category:', error);
      throw new Error(error.response?.data?.error || 'Error creating category');
    }
  };
  
  export const updateCategory = async ({ category_id, formData }) => {
    try {

      console.log("formData",formData)
      const response = await instance.patch(`categories/${category_id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data;
    } catch (error) {
      console.log('Error updating category:', error);
      throw new Error(error.response?.data?.error || 'Error updating category');
    }
  };
  
  
  export const deleteCategory = async (categoryId) => {
    try {
      const response = await instance.delete(`categories/${categoryId}/`);
      console.log("response.data",response.data)
      return response.data; // Adjust based on your API response structure
    } catch (error) {
      console.log('Error deleting category:', error);
      throw new Error(error.response?.data?.error || 'Error deleting category');
    }
  };


  export const getOrderHistory = async () => {
    try {
      const response = await instance.get('orders/');
      return response.data.data; // Adjust based on your API response structure
    } catch (error) {
      console.log('Error fetching categories:', error);
      throw new Error(error.response?.data?.error || 'Error fetching categories');
    }
  };
  export const orderCancel = async (id) => {
    try {
      const response = await instance.post(`orders/cancel/${id}/`);
      return response.data.data; // Adjust based on your API response structure
    } catch (error) {
      console.log('Error fetching categories:', error);
      throw new Error(error.response?.data?.error || 'Error fetching categories');
    }
  };
  export const getOrderCancelHistory = async () => {
    try {
      const response = await instance.get('orders/cancel/');
      return response.data.data; // Adjust based on your API response structure
    } catch (error) {
      console.log('Error fetching categories:', error);
      throw new Error(error.response?.data?.error || 'Error fetching categories');
    }
  };
  
  
  export const getAdminOrderHistory = async () => {
        try {
          const response = await instance.get('orders/admin/');
          return response.data.data; // Adjust based on your API response structure
        } catch (error) {
          console.log('Error fetching Order:', error);
          throw new Error(error.response?.data?.error || 'Error fetching Order');
        }
      };
  export const updateOrderStatus = async (id,status) => {
    try {
      const response = await instance.patch(`orders/${id}/`,status);
      return response.data.data; // Adjust based on your API response structure
    } catch (error) {
      console.log('Error fetching Order:', error);
      throw new Error(error.response?.data?.error || 'Error fetching Order');
    }
  };
  export const getAdminPaymentHistory = async () => {
        try {
          const response = await instance.get('payment/admin/');
          return response.data.data; // Adjust based on your API response structure
        } catch (error) {
          console.log('Error fetching Payments:', error);
          throw new Error(error.response?.data?.error || 'Error fetching Payments');
        }
      };
  export const updatePaymentStatus = async (id,status) => {
    try {
      const response = await instance.patch(`payment/admin/${id}/`,status);
      return response.data.data; // Adjust based on your API response structure
    } catch (error) {
      console.log('Error fetching categories:', error);
      throw new Error(error.response?.data?.error || 'Error fetching categories');
    }
  };