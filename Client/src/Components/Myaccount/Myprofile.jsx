import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserInfo } from '../../Store/authSlice';
import { FaUserCircle } from 'react-icons/fa';
import { useMutation } from '@tanstack/react-query';
import { userDataUpdate } from '../../util/queries';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SmallLoader from '../Common/SmallLoader';

const MyProfile = () => {
  const dispatch = useDispatch();

  // Fetch user data from Redux store or fallback to localStorage
  const user = useSelector((state) => state.auth.user);
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const userInfo = user || storedUser;
  const [loading,setLoading]=useState(false);
  // State to handle form data
  const [formData, setFormData] = useState({
    firstName: userInfo.first_name || '',
    lastName: userInfo.last_name || '',
    email: userInfo.email || '',
    address: userInfo.address || '',
    currentPassword: '',
    password: '',
    confirmPassword: '',
    profilePhoto: userInfo.profilePhoto || null,
  });

  // Handle image preview
  const [previewImage, setPreviewImage] = useState(
    userInfo.profilePhoto ? `${import.meta.env.VITE_BACKEND_END_POINT_image}${userInfo.profilePhoto}` : null
  );

  const { mutate: updateUser } = useMutation({
    mutationFn:(Data)=> userDataUpdate(Data),
    onSuccess: (data) => {
      dispatch(updateUserInfo({ user: data }));
      localStorage.setItem('user', JSON.stringify(data));
      toast.success('Profile updated successfully!');
      setLoading(false)
    },
    onError: (error) => {
      console.log(JSON.stringify(error))
      toast.error(`Failed to update profile.${error}`);
    },
  });

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'profilePhoto' && files && files[0]) {
      const file = files[0];
      setFormData({ ...formData, profilePhoto: file });
      setPreviewImage(URL.createObjectURL(file)); // Preview the uploaded image
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)  
    // Password validation
    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error("New password and confirm password don't match.");
      setLoading(false)  
      return;
    }

    // Prepare form data for submission, including file handling if necessary
    const updatedUserInfo = new FormData();
    updatedUserInfo.append('first_name', formData.firstName);
    updatedUserInfo.append('last_name', formData.lastName);
    updatedUserInfo.append('email', formData.email);
    updatedUserInfo.append('address', formData.address);

    // Add the profile photo if updated
    if (formData.profilePhoto && formData.profilePhoto instanceof File) {
      updatedUserInfo.append('profilePhoto', formData.profilePhoto);
    }

    // Add passwords to the update if present
    if (formData.password && formData.confirmPassword) {
      updatedUserInfo.append('password', formData.password);
      updatedUserInfo.append('currentPassword', formData.currentPassword);
    }

    // Call the mutation to update the user
    updateUser(updatedUserInfo);
  };

  const handleAvatarClick = () => {
    document.getElementById('PictureInput').click(); // Trigger file input click
  };

  return (
    <div className="Myprofile-main">
      <div className='Myprofile-text'>Edit Your Profile</div>
      <form className="myprofile-container" onSubmit={handleSubmit}>
        
        {/* Avatar/Profile Photo */}
        <div className="avatar-upload" onClick={handleAvatarClick}>
          {previewImage ? (
            <img src={previewImage} alt="Avatar" className="avatar-preview" />
          ) : (
            <FaUserCircle size={100} className="default-avatar" />
          )}
          <input
            type="file"
            id="PictureInput"
            name="profilePhoto"
            onChange={handleChange}
            accept="image/*"
            style={{ display: 'none' }} // Hide the file input
          />
        </div>

        {/* Name and Email */}
        <div className='Myprofile-input-div'>
          <div>
            <label htmlFor="firstName">First Name</label><br />
            <input
              type="text"
              name='firstName'
              id='firstName'
              placeholder='First Name'
              value={formData.firstName}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div>
            <label htmlFor="lastName">Last Name</label><br />
            <input
              type="text"
              name='lastName'
              id='lastName'
              placeholder='Last Name'
              value={formData.lastName}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
        </div>

        {/* Email and Address */}
        <div className='Myprofile-input-div'>
          <div>
            <label htmlFor="email">Email</label><br />
            <input
              type="email"
              name='email'
              id='email'
              placeholder='Email'
              value={formData.email}
              // onChange={handleChange}
              autoComplete="off"
              contentEditable={false}
              disabled={true}
            />
          </div>
          <div>
            <label htmlFor="address">Address</label><br />
            <input
              type="text"
              name='address'
              id='address'
              placeholder='Address'
              value={formData.address}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
        </div>

        {/* Change Password */}
        <div className='Myprofile-change-pass'>
          <label htmlFor="currentPassword">Change password</label>
          <input
            type="password"
            name='currentPassword'
            id='currentPassword'
            placeholder='Current Password'
            value={formData.currentPassword}
            onChange={handleChange}
            autoComplete="off"
          />
          <input
            type="password"
            name='password'
            id='newPassword'
            placeholder='New Password'
            value={formData.password}
            onChange={handleChange}
            autoComplete="off"
          />
          <input
            type="password"
            name='confirmPassword'
            id='confirmPassword'
            placeholder='Confirm Password'
            value={formData.confirmPassword}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>

        <div className="Myprofile-btn-main">
          <input type='reset' value="Cancel" onClick={() => setFormData(userInfo)} />
         
          {loading ? (
                <div
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: "100%",
                    height: "100%",
                    marginRight: "7rem",
                    padding: "0.5rem 2rem",
                    backgroundColor: "white",
                    fontWeight: "500",
                    cursor: "pointer",
                    border:"1px solid #232323",
                  }}
                  disabled={loading}
                >
                  <SmallLoader />
                </div>
                
              ) : (
                <input type="submit" value="Submit" />
              )}
        </div>
      </form>
    </div>
  );
};

export default MyProfile;
