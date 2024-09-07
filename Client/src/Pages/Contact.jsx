import React, { useState } from 'react';
import '../css/Contact.css'; // Assuming the CSS is stored here
import { FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add form submission logic here
    console.log('Form Submitted', formData);
  };

  return (
    <>
 <NavBar/>
    <div className="contact-container">
      <div className="contact-breadcrumb">
        <Link to='/' style={{color:'black'}}>Home</Link> / Contact
      </div>

      <div className="contact-content">
        <div className="contact-info">
          <div className="contact-info-item">
            <FaPhoneAlt className="contact-icon" />
            <h3>Call To Us</h3>
            <p>We are available 24/7, 7 days a week.</p>
            <p>Phone: +88016111122222</p>
          </div>
          <hr />
          <div className="contact-info-item">
            <FaEnvelope className="contact-icon" />
            <h3>Write To Us</h3>
            <p>Fill out our form and we will contact you within 24 hours.</p>
            <p>Emails: customer@exclusive.com</p>
            <p>Emails: support@exclusive.com</p>
          </div>
        </div>

        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input 
                type="text" 
                name="name" 
                placeholder="Your Name *" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
              />
              <input 
                type="email" 
                name="email" 
                placeholder="Your Email *" 
                value={formData.email} 
                onChange={handleInputChange} 
                required 
              />
              <input 
                type="tel" 
                name="phone" 
                placeholder="Your Phone *" 
                value={formData.phone} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="form-group">
              <textarea 
                name="message" 
                placeholder="Your Message" 
                value={formData.message} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <button type="submit" className="contact-submit-button">Send Message</button>
          </form>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Contact;
