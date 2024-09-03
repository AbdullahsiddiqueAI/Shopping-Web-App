import React from 'react';
import '../css/Product.css';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';
import imageUrl from '../css/img/Product_images/Canon-750-D-overview.jpg'
import ProductListItem from '../Components/Products/ProductListItem';

function Products() {
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
    <div className="productsPage_container">
        <div className="productsPage_content">
      <aside className="productsPage_sidebar">
        <div className="productsPage_categories">
          <h3>CATEGORIES</h3>
          <ul>
            <li>All Products</li>
            <li>B Vitamins</li>
            <li>Beauty</li>
            <li>Best Selling</li>
           
          </ul>
        </div>
        <div className="productsPage_price-filter">
          <h3>PRICE</h3>
          <input type="range" min="0" max="4500" />
        </div>
      </aside>
      <div className="productPage_main_content">
       <div className="productPage_filter">
        <div className="productPage_filter_content" >
            <span>Items per page</span>
            <select style={{width:'5rem'}}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
            </select>
        </div>
        <div className="productPage_filter_content">
            <span>Sort by</span>
            <select>
              <option value="low-to-high">Low to High</option>
              <option value="high-to-low">High to Low</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
        </div>
        </div> 
      <main className="productsPage_product-list">
      {
        products.map((product,index)=> (<ProductListItem product={product} key={index}/>))
        }
      </main>
      <div className="productPage_see-more">
        See Mores
      </div>
      </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

export default Products;
