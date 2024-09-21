import React from 'react';

const Rating = ({ value, count }) => {
  const fullStars = Math.floor(value);
  const halfStar = value % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="Product_list-items-rating">
      {[...Array(fullStars)].map((_, i) => (
        <span key={i}>★</span>
      ))}
      {halfStar && <span>☆</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={i + fullStars + (halfStar ? 1 : 0)}>☆</span>
      ))}
      <span>({count})</span>
    </div>
  );
};

export default Rating;
