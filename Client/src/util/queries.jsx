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
    const [_key, { page, page_size, sort_by }] = queryKey;
    
    // Build the query string based on parameters
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (page_size) params.append('page_size', page_size);
    if (sort_by) params.append('sort_by', sort_by);
  
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