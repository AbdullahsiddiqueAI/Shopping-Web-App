import React from 'react';
import Rating from '../Common/Rating';
import imageUrl from '../../css/img/Product_images/Canon-750-D-overview.jpg'
// import imageUrl2 from '../../css/img/Slider/2.jpg'
import ProductListItem from '../Products/ProductListItem';
function ProductList() {
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
    <div className="Product_list-container">
      <div className="Product_cotegory-top">
        <div className="Product_cotegory-text">
          Our Products
        </div>
        <div className="Product_list-button-see-all">
        See All
      </div>
      </div>
      <div className="Product_list-content">
       {
        products.map((product,index)=> (<ProductListItem product={product} key={index}/>))
        }
      </div>
      
    </div>
  );
}

export default ProductList;