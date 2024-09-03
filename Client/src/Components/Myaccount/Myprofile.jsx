import React from 'react'

const Myprofile = () => {
  return (
    <div className="Myprofile-main">
      <div className='Myprofile-text'>Edit Your Profile</div>
      <form className="myprofile-container">
        <div className='Myprofile-input-div'>
          <div>
            <label for="FName">First Name</label><br />
            <input type="text" name='FName' id='FName' placeholder='First Name' required/>
          </div>
          <div>
            <label for="LName">Last Name</label><br />
            <input type="text" name='LName' id='LName' placeholder='Last Name' required/>
            </div>
        </div>
        <div className='Myprofile-input-div'>
          <div>
            <label for="Email">Email</label><br />
            <input type="email" name='Email' id='Email' placeholder='Email' required/>
            </div>
          <div>
            <label for="Address">Address</label><br />
            <input type="text" name='Address' id='Address' placeholder='Address' required/>
            </div>
        </div>
        <div className='Myprofile-change-pass'>
      
            <label for="Change">Change password</label>
            <input type="password" name='Currentpassword' id='Currentpassword' placeholder='Current Password' required/>
            <input type="password" name='Newpassword' id='Newpassword' placeholder='New password' required/>
            <input type="password" name='ConfirmPassword' id='ConfirmPassword' placeholder='Confirm Password' required/>
          </div>
          
          <div className="Myprofile-btn-main">
            <input type='reset' value="Cancel"/>
            <input type="submit" value="Submit" />
          </div>
      </form>
    </div>
  )
}

export default Myprofile