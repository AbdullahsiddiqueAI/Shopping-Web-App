import React, { useState } from 'react'

const Product_cotegory = () => {
  const [count, setCount] = useState(0);

  const SliderMove = (num) => {
    let newCount = count + num;
    const items = document.querySelectorAll('.Product_cotegory-items');
    const container = document.querySelector('.Product_cotegory-content');

    if (newCount < 0) {
      newCount = items.length - 1;
    } else if (newCount >= items.length - 1) {
      newCount = 0;
    }

    if (container.scrollLeft + container.clientWidth === container.scrollWidth) {
      newCount = 0;
    }

    container.scrollLeft = items[newCount].offsetLeft;
    setCount(newCount);
  }

  return (
    <>
      <div className="Product_cotegory-container">
        <div className="Product_cotegory-top">
        <div className="Product_cotegory-text">
            Cotegory
        </div>
        <div className='button-wrap'>
          <button onClick={() => SliderMove(-1)}> {'<'} </button>
          <button onClick={() => SliderMove(1)}> {'>'} </button>
          </div>
        </div>
        <div className="Product_cotegory-content">
          <div className="Product_cotegory-all-items">
            <div className="Product_cotegory-items">
              <div className="Product_cotegory-items-img"></div>
              <div className="Product_cotegory-items-text">Phones</div>

            </div>
            <div className="Product_cotegory-items">
              <div className="Product_cotegory-items-img"></div>
              <div className="Product_cotegory-items-text">Computers</div>

            </div>
            <div className="Product_cotegory-items">
              <div className="Product_cotegory-items-img"></div>
              <div className="Product_cotegory-items-text">SmartWatch</div>

            </div>
            <div className="Product_cotegory-items">
              <div className="Product_cotegory-items-img"></div>
              <div className="Product_cotegory-items-text">Camera</div>

            </div>
            <div className="Product_cotegory-items">
              <div className="Product_cotegory-items-img"></div>
              <div className="Product_cotegory-items-text">HeadPhones</div>

            </div>
            <div className="Product_cotegory-items">
              <div className="Product_cotegory-items-img"></div>
              <div className="Product_cotegory-items-text">Gaming</div>
            </div>
           
          </div>
        </div>
      </div>
    </>
  );
}

export default Product_cotegory 