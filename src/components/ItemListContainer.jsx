import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import ItemList from './ItemList';

function ItemListContainer() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'productos'));
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = id
    ? products.filter(product => product.category === id)
    : products;

  if (loading) {
    return <p className="text-center">Momento por favor, estamos cargando nuestros productos.</p>;
  }

  return (
    <div className="item-list-container container">
      <h2 className="text-center mb-4">
        {id ? `Productos de ${id}` : 'Bienvenido a la tienda de Phoenix Contact'}
      </h2>
      <ItemList products={filteredProducts} />
    </div>
  );
}

export default ItemListContainer;

















