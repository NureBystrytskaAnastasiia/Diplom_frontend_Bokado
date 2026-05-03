import React from 'react';
import { FiHeart } from 'react-icons/fi';

interface CatCardProps {
  cat: {
    id: string;
    url: string;
  };
}

const CatCard: React.FC<CatCardProps> = ({ cat }) => {
  return (
    <div className="cat-card">
      <img
        src={cat.url}
        alt="Котик"
        className="cat-image"
        onError={(e) => {
          e.currentTarget.src = 'https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg';
        }}
      />
      <div className="cat-info">
        <FiHeart className="heart-icon" />
        <span>{cat.id.slice(0, 6)}</span>
      </div>
    </div>
  );
};

export default CatCard;