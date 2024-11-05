import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Modal from './../ModalCart/ModalCart';

const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const cartId = Cookies.get('info');

    const fetchUserProducts = () => {
        fetch('http://localhost:5000/user-products?cartId=' + cartId)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const groupedProducts = data.reduce((acc, product) => {
                    const existingProduct = acc.find(p => p.idProduct === product.idProduct);
                    if (existingProduct) {
                        existingProduct.quantity += product.quantity; 
                    } else {
                        acc.push({ ...product, quantity: product.quantity });
                    }
                    return acc;
                }, []);
                setProducts(groupedProducts);
            })
            .catch(error => {
                console.error('Ошибка при получении товаров:', error);
            });
    };

    const handleOpenModal = () => {
        fetchUserProducts();
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <header className='relative mb-36'>
            <img src="" alt="img" className='w-full bg-[#b1b1b1] rounded-[10px] h-[175px] absolute' />
            <div className='relative top-28 md:left-12 w-min'>
                <div className='flex flex-wrap relative items-end left-6 md:left-0'>
                    <img src="" alt="img" className='w-[132px] bg-[#727272] rounded-[10px] h-[132px] sm:mr-8' />
                    <h1 className='mt-5 sm:mt-0 font-newsreader font-medium text-[40px] leading-10 text-[#426B1F]'>VITRINE</h1>
                </div>
                <nav className='flex flex-wrap sm:flex-nowrap font-inter leading-5 mt-3 sm:mt-5'>
                    <a href="#" className='py-2 px-8'>Товары</a>
                    <a href="#" className='py-2 px-8'>Отзывы</a>
                    <a href="#" className='py-2 px-8'>Контакты</a>
                    <a href="#" className='py-2 px-8 relative' onClick={handleOpenModal}>Корзина</a>
                </nav>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} products={products} userId={cartId} setProducts={setProducts}/>
        </header>
    );
};

export default Header;