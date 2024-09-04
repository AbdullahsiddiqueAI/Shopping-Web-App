import React from 'react';
import '../css/ProductPage.css'; // Include the corresponding CSS
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import imageUrl from '../css/img/Product_images/Canon-750-D-overview.jpg'
import ProductListItem from '../Components/Products/ProductListItem';
import { Link, useParams } from 'react-router-dom';

const ProductPage = () => {
  const { id } = useParams();
  console.log("page id",id) 
    const products =[ 
        {
        name: 'Canon EOS DSLR Camera',
        price: 360,
        rating: 4.5,
        reviewCount: 95,
        imageUrl: imageUrl, // Replace with actual path
      },
        {
        name: 'Canon EOS DSLR Camera',
        price: 360,
        rating: 4.5,
        reviewCount: 95,
        imageUrl: imageUrl, // Replace with actual path
      },
        {
        name: 'Canon EOS DSLR Camera',
        price: 360,
        rating: 4.5,
        reviewCount: 95,
        imageUrl: imageUrl, // Replace with actual path
      },
        {
        name: 'Canon EOS DSLR Camera',
        price: 360,
        rating: 4.5,
        reviewCount: 95,
        imageUrl: imageUrl, // Replace with actual path
      }
    ]
  return (
    <>
    <NavBar/>
    <div className="main-product-page">
      <div className="main-product-breadcrumb"> <Link to='/' style={{color:'black'}}>Home</Link>  / Havic HV G-92 Gamepad</div>

      <div className="main-product-container">
        <div className="main-product-images">
          {/* <div >Main Image</div> */}
          <img src={imageUrl}/>
          
        </div>

        <div className="main-product-info">
          <h1 className="main-product-title">Havic HV G-92 Gamepad</h1>
          <div className="main-product-rating">
            ★★★★☆ (580 Reviews) - <span className="main-product-in-stock">In Stock</span>
          </div>
          <div className="main-product-price">$192.00</div>
          <p className="main-product-description">
            Playstation 5 Controller Skin High quality vinyl with air channel adhesive for easy bubble free install & mass free removal!
          </p>

          <div className="main-product-options">
          

            <div className="main-product-quantity-selection">
              <button>-</button>
              <input type="number" value="2" />
              <button>+</button>
            </div>
          </div>

          <button className="main-product-buy-now">Add to cart</button>

          <div className="main-product-delivery-options">
            <div>Free Delivery</div>
            <div>Return Delivery</div>
          </div>
        </div>
      </div>

      <div className="main-product-related-items">
        <h1>Related Items</h1>
        <div className="main-product-related-products">
      {
        products.map((product,index)=> (<ProductListItem product={product} key={index}/>))
        }
          {/* <div className="main-product-related-product">Product 1</div>
          <div className="main-product-related-product">Product 2</div>
          <div className="main-product-related-product">Product 3</div>
          <div className="main-product-related-product">Product 4</div> */}
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default ProductPage;
