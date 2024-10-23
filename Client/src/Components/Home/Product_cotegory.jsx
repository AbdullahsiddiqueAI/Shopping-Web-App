import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCategory } from '../../util/queries';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import Loader from '../Common/Loader';

const Product_cotegory = () => {
  const [count, setCount] = useState(0);
  const navigate = useNavigate(); // Use navigate hook for navigation

  // Using React Query to fetch category data
  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ['categories'], // Use product ID as part of the query key
    queryFn: getCategory
  });

  const SliderMove = (num) => {
    let newCount = count + num;
    const items = document.querySelectorAll('.Product_cotegory-items');
    const container = document.querySelector('.Product_cotegory-content');

    if (newCount < 0) {
      newCount = items.length - 1;
    } else if (newCount >= items.length) {
      newCount = 0;
    }

    container.scrollLeft = items[newCount]?.offsetLeft || 0;
    setCount(newCount);
  };

  // if (!isLoading) return <Loader/>;
  if (isError) return <div>Error fetching categories</div>;

  const handleCategoryClick = (category) => {
    // Navigate to the Products page and pass the selected category as a query param
    navigate(`/Products?category=${category.category_id}`);
  };

  return (
    <>
      <div className="Product_cotegory-container">
        <div className="Product_cotegory-top">
          <div className="Product_cotegory-text">Category</div>
          <div className="button-wrap">
            <button onClick={() => SliderMove(-1)}>{'<'}</button>
            <button onClick={() => SliderMove(1)}>{'>'}</button>
          </div>
        </div>
        <div className="Product_cotegory-content">
          {isLoading && <Loader/>}
          <div className="Product_cotegory-all-items">
            {categories?.map((category) => (
              <div 
                key={category.category_id} 
                className="Product_cotegory-items"
                onClick={() => handleCategoryClick(category)} // Handle click event
              >
                <div className="Product_cotegory-items-img">
                  {category.Categoryicon ? (
                    <img 
                      src={import.meta.env.VITE_BACKEND_END_POINT_image + category.Categoryicon} 
                      alt={category.name} 
                      className='Product_cotegory-items-img'
                    />
                  ) : (
                    <div>No Image</div>
                  )}
                </div>
                <div className="Product_cotegory-items-text">{category.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Product_cotegory;
