import React from 'react';

import Rating from '../Common/Rating'; // Assuming you have a Rating component

const ProductListItem = ({ product }) => {
  return (
    <div className="Product_list-items">
      <div className="Product_list-items-img">
        <img src={product.imageUrl} alt={product.name} />
      </div>
      <div className="Product_list-items-text">{product.name}</div>
      <div>
        <div className="Product_list-items-text-price">${product.price}</div>
        <Rating value={product.rating} count={product.reviewCount} />
      </div>
      <div className="Product_list-Add_cart">
        <div className="Product_list-Add_cart-text">Add to Cart</div>
      </div>
    </div>
  );
};



export default ProductListItem;
