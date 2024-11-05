import React, { useEffect, useState } from 'react';
import Card from './Card/Card';

const CardList = ({ addToCart }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/products');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Ошибка при получении продуктов:', error);
            }
        };

        fetchProducts(); 
    }, []); 

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7'>
            {products.map((product) => (
                <Card 
                    key={product.idProduct} 
                    image={product.image} 
                    title={product.name} 
                    price={product.price} 
                    onAddToCart={addToCart} 
                    productId={product.idProduct}
                />
            ))}
        </div>
    );
};

export default CardList;
