import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";

const ModalCart = ({ isOpen, onClose, products, userId, onRemove, setProducts }) => {
    if (!isOpen) return null;

    const totalAmount = products.reduce((total, product) => total + (Number(product.price) * product.quantity), 0);
    const formattedTotalAmount = totalAmount.toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const handleRemove = (productId) => {
        fetch('http://localhost:5000/remove-from-cart', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, productId }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка удаления товара');
                }
                setProducts(prevProducts => prevProducts.filter(product => product.idProduct !== productId));
            })
            .catch(error => {
                console.error('Ошибка при удалении товара:', error);
            });
    };

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        fetch('http://localhost:5000/update-cart', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, productId, quantity: newQuantity }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка обновления количества товара');
                }

                setProducts(prevProducts =>
                    prevProducts.map(product =>
                        product.idProduct === productId
                            ? { ...product, quantity: newQuantity }
                            : product
                    )
                );
            })
            .catch(error => {
                console.error('Ошибка при обновлении количества товара:', error);
            });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
            <div className="bg-white w-full sm:w-4/5 p-5 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-4">Ваши товары</h2>
                {products.length === 0 ? (
                    <p>Ваша корзина пуста.</p>
                ) : (
                    <ul className="w-full">
                        {products.map(product => (
                            <li key={product.idProduct} className="border-b py-2 flex justify-between items-center flex-wrap w-full">
                                <div className='flex items-center gap-5 w-full sm:w-2/5 justify-center mb-5 sm:mb-0'>
                                    <img src={product.image} alt={product.name} className='w-[32px] md:w-[64px] h-auto' />
                                    <p className="flex-1">{product.name}</p>
                                </div>
                                <div className='flex items-center gap-5'>
                                    <input
                                        type="number"
                                        min="1"
                                        value={product.quantity}
                                        onChange={(e) => handleQuantityChange(product.idProduct, Number(e.target.value))}
                                        className="w-[40%] text-center border rounded"
                                    />
                                </div>
                                <div className='flex items-center gap-5 sm:w-1/5 justify-end'>
                                    <p>{(Number(product.price) * product.quantity).toLocaleString('ru-RU', { minimumFractionDigits: 2 })} р</p>
                                    <button onClick={() => handleRemove(product.idProduct)} className="text-red-500 text-[20px]"><IoClose /></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                {products.length > 0 && (
                    <div className="mt-4 font-bold text-[20px] text-end">
                        Итого: {formattedTotalAmount} р
                    </div>
                )}
                <div className='flex justify-end'>
                    <button className="mt-4 bg-blue-500 text-white py-2 px-4 rounded mr-6">Оформить заказ</button>
                    <button onClick={onClose} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Закрыть</button>
                </div>
            </div>
        </div>
    );
};

export default ModalCart;