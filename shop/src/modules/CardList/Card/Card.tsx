import React from 'react';

const Card = ({ image, title, price, onAddToCart, productId }) => {
    return (
        <div className='w-auto pt-8 pb-4 px-9 border border-[#00000012] rounded-xl'>
            <img src={image} alt="img" className='w-[169px] h-[169px] mb-5 mx-auto' />
            <h2 className='font-noto text-[20px] leading-5 mb-4 text-center'>{title}</h2>
            <div className='flex justify-end gap-5'>
                <p className='font-newsreader font-medium text-[20px] leading-5'>{price} р</p>
                <img 
                    src="./basketAdd.png" 
                    alt="Добавить в корзину" 
                    className='w-[24px] cursor-pointer' 
                    onClick={() => onAddToCart(productId)} 
                />
            </div>
        </div>
    );
};

export default Card;