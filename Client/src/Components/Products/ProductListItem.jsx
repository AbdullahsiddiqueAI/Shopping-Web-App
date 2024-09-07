import React from 'react';
import Rating from '../Common/Rating'; // Assuming you have a Rating component
import { Link } from 'react-router-dom';

const ProductListItem = ({ product }) => {
  return (
    <Link to={`/ProductPage/${product.product_id}`}>

    <div className="Product_list-items">
      <div className="Product_list-items-img">
        {/* Display product image or fallback to a default image */}
        <img src={`http://127.0.0.1:8000/${product.productPic}` || 'default-image.jpg'} alt={product.name}  />
      </div>
      <div className="Product_list-items-text">{product.name}</div>
      <div>
        <div className="Product_list-items-text-price">${product.price}</div>
        <div >{String(product.description).slice(0,25)}{String(product.description).length > 25?"...":''}</div>
        {/* Assuming you have a Rating component that accepts rating and review count */}
        <Rating value={product?.rating || 4.0} count={product?.reviewCount || 64} />
      </div>
      <div className="Product_list-Add_cart">
        {/* Link to the product's details page using its product_id */}
        <Link to={`/ProductPage/${product.product_id}`} className="Product_list-Add_cart-text">
          Add to Cart
        </Link>
      </div>
    </div>
    </Link>
  );
};

export default ProductListItem;
