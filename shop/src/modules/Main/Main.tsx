import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import CardList from '../CardList/CardList';

function Main() {
    const [userId, setUserId] = useState('');

    useEffect(() => {
        const existingCartId = Cookies.get('info');
        if (!existingCartId) {
            const newCartId = Math.random().toString(36).substr(2, 9);
            Cookies.set('info', newCartId);
            setUserId(newCartId);
        } else {
            setUserId(existingCartId);
        }
    }, []);

    const addToCart = (productId) => {
        fetch('http://localhost:5000/add-to-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, productId }),
        })
            .then(response => response.json())
            .then(data => {
            })
            .catch(error => {
            });
    };

    return (
        <main>
            <CardList addToCart={addToCart} />
        </main>
    );
}

export default Main;