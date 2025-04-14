import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

type ItemType = {
  id: number;
  name: string;
  description: string;
};

function SinglePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<ItemType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchItem = async () => {
      if (!id) {
        if (mounted) {
          setError('No ID provided');
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(`http://localhost:3100/items/${id}`);
        
        if (!response.ok) {
          throw new Error(
            response.status === 403 
              ? 'Access denied for this item' 
              : 'Failed to fetch item'
          );
        }
        
        const data = await response.json();
        
        if (!data) {
          throw new Error('Item not found');
        }

        if (mounted) {
          setItem(data);
          setError(null);
        }
      } catch (err: any) {
        if (mounted) {
          console.error('Failed to fetch item:', err);
          setError(err.message);
          setItem(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchItem();

    return () => {
      mounted = false;
    };
  }, [id]);

  const renderContent = () => {
    if (loading) {
      return <h2>Loading...</h2>;
    }

    if (error) {
      return (
        <>
          <h2>Error</h2>
          <p>{error}</p>
        </>
      );
    }

    if (!item) {
      return <h2>Item not found</h2>;
    }

    return (
      <>
        <h2>Item Details</h2>
        <p>ID: {item.id}</p>
        <p>Name: {item.name}</p>
        <p>Description: {item.description}</p>
      </>
    );
  };

  return (
    <div className="detail">
      <Link to={'/'}>Go Back</Link>
      {renderContent()}
    </div>
  );
}

export default SinglePage;
