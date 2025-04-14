import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

interface ListItemProps {
  id: number;
  name: string;
  description: string;
  onClick: (id: number) => void;
  isactive: boolean;
}

const ListItem: React.FC<ListItemProps> = ({ id, name, description, onClick, isactive }) => {
  const handleSetActive = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick(id);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Если клик был по кнопке, не обрабатываем его
    if ((e.target as HTMLElement).closest('.list-item-button')) {
      return;
    }
  };

  return (
    <li className={`list-item ${isactive ? 'active' : ''}`} onClick={handleCardClick}>
      <div className="list-item-content">
        <div className="list-item-actions">
          <div className="list-item-id">ID: <b>{id}</b></div>
          <Button 
            onClick={handleSetActive} 
            disabled={isactive}
            className="list-item-button"
          >
            {isactive ? 'Active' : 'Set Active'}
          </Button>
        </div>
        <Link to={`/${id}`} className="list-item-link">
          <div className="list-item-name">{name}</div>
          <div className="list-item__description">{description}</div>
        </Link>
      </div>
    </li>
  );
};

export default ListItem;
