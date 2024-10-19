import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className="Footer-main">
        <div className="Footer-container">
            <div className="Footer-top">
                <div className="Footer-top-part">
                    <div className="head-text">Supports</div>
                    <div className="para-text">+92324-4046381</div>
                    <div className="para-text">ABC@gmail.com</div>
                </div>
                <div className="Footer-top-part">
                <div className="head-text">Quick Links</div>
                    
                    <div className="para-text"><Link to="/Products">Product</Link> </div>
                    <div className="para-text"><Link to="/Contact">Contact</Link> </div>
                    <div className="para-text"><Link to="/About">About</Link> </div>

                </div>
                <div className="Footer-top-part">
                <div className="head-text" style={{textAlign:'center'}}>Social Media Links</div>
                <div className="Footer-icon">
                <a className="Footer-icon-1"></a>
                <a className="Footer-icon-2"></a>
                <a className="Footer-icon-3"></a>
                </div>
                </div>
                <div className="Footer-top-part">
                <div className="head-text">Subscribe</div>
                <div className="Footer-input-wrap">
                <input type="text" className='Footer-input' placeholder='Email'/>
                <button></button>
                </div>

                </div>
            </div>
            <hr />
            <div className="Footer-bottom">
                <div className='Footer-bottom-inner'>
                <div className="para-text">Developed by Abddulah Siddique</div>
                <div className="para-text">&#169; 2024 ALL CopyRight Are Reserved</div>
                </div>
            </div>
        </div>

    </div>
  )
}

export default Footer