import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserInfo } from '../../Store/authSlice'; // Import the action to update user info
import { FaUserCircle } from 'react-icons/fa'; // Icon for the avatar

const Myprofile = () => {
  const dispatch = useDispatch();

  // Fetch user data from Redux store or fallback to localStorage
  const user = useSelector((state) => state.auth.user);
  const storedUser = JSON.parse(localStorage.getItem('user')) || {};
  const userInfo = user || storedUser;

  // State to handle form data
  const [formData, setFormData] = useState({
    firstName: userInfo.first_name || '',
    lastName: userInfo.last_name || '',
    email: userInfo.email || '',
    address: userInfo.address || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    profilePhoto: userInfo.profilePhoto || null // Avatar/Profile Picture
  });

  const [previewImage, setPreviewImage] = useState(
    userInfo.profilePhoto ? `http://127.0.0.1:8000${userInfo.profilePhoto}` : null
  ); // Preview uploaded image

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

    // Basic password validation (if changing the password)
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      alert("New password and confirm password don't match");
      return;
    }

    // Prepare updated user info
    const updatedUserInfo = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      address: formData.address,
      profilePhoto: formData.profilePhoto // New avatar
    };

    // Dispatch action to update the user information
    dispatch(updateUserInfo({ user: updatedUserInfo }));

    alert('Profile updated successfully!');
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
              onChange={handleChange}
              autoComplete="off"
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
            name='newPassword'
            id='newPassword'
            placeholder='New Password'
            value={formData.newPassword}
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
          <input type="submit" value="Submit" />
        </div>
      </form>
    </div>
  );
};

export default Myprofile;
