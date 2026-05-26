import React from 'react';
import { FiRefreshCw } from 'react-icons/fi';

interface Cat { id: string; url: string; }

interface Props {
  cats: Cat[];
  loading: boolean;
  onRefetch: () => void;
}

const CatsCard: React.FC<Props> = ({ cats, loading, onRefetch }) => (
  <section className="db__card db__card--cats">
    <div className="db__card-head">
      <div className="db__card-title">
        <span className="db__card-icon db__card-icon--pink">🐱</span>
        Котики дня
      </div>
      <button className="db__cats-refresh" onClick={onRefetch}>
        <FiRefreshCw size={13} /> Нові котики
      </button>
    </div>
    <div className="db__cats-grid">
      {loading
        ? [1, 2, 3].map(i => <div key={i} className="db__cat-skeleton" />)
        : cats.map(cat => (
          <div key={cat.id} className="db__cat">
            <img
              src={cat.url}
              alt="котик"
              className="db__cat-img"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://cdn2.thecatapi.com/images/0XYvRd7oD.jpg';
              }}
            />
          </div>
        ))
      }
    </div>
  </section>
);

export default CatsCard;