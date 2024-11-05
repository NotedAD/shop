const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 5000; 

app.use(cors()); 
app.use(express.json()); 

const db = mysql.createConnection({
    host: 'sql7.freemysqlhosting.net',
    user: 'sql7740472',
    password: 'nWf5ILSRgn', 
    database: 'sql7740472',
});

db.connect(err => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('Подключено к базе данных!');
});

app.get('/products', (req, res) => {
    db.query('SELECT idProduct, name, price, image FROM products', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        const products = results.map((product) => {
            return {
                ...product,
                image: product.image ? `data:image/jpeg;base64,${product.image.toString('base64')}` : null
            };
        });
        res.json(products);
    });
});

app.post('/add-to-cart', (req, res) => {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ error: 'userId и productId обязательны' });
    }

    const checkQuery = 'SELECT * FROM cart WHERE userId = ? AND productId = ?';
    db.query(checkQuery, [userId, productId], (err, results) => {
        if (err) {
            console.error('Ошибка при проверке товара:', err);
            return res.status(500).json({ error: 'Ошибка при проверке товара' });
        }

        if (results.length > 0) {
            const newQuantity = results[0].quantity + 1;
            const updateQuery = 'UPDATE cart SET quantity = ? WHERE userId = ? AND productId = ?';
            db.query(updateQuery, [newQuantity, userId, productId], (err) => {
                if (err) {
                    console.error('Ошибка при обновлении количества товара:', err);
                    return res.status(500).json({ error: 'Ошибка при обновлении количества товара' });
                }
                res.json({ message: 'Количество товара обновлено' });
            });
        } else {
            const insertQuery = 'INSERT INTO cart (userId, productId, quantity) VALUES (?, ?, ?)';
            db.query(insertQuery, [userId, productId, 1], (err) => {
                if (err) {
                    console.error('Ошибка при добавлении товара в корзину:', err);
                    return res.status(500).json({ error: 'Ошибка при добавлении товара в корзину' });
                }
                res.json({ message: 'Товар добавлен в корзину' });
            });
        }
    });
});

app.get('/user-products', (req, res) => {
    const cartId = req.query.cartId;

    const query = 'SELECT p.*, c.quantity FROM products p JOIN cart c ON p.idProduct = c.productId WHERE c.userId = ?';
    
    db.query(query, [cartId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        const products = results.map((product) => {
            return {
                ...product,
                image: product.image ? `data:image/jpeg;base64,${product.image.toString('base64')}` : null
            };
        });
        res.json(products);
    });
});

app.delete('/remove-from-cart', (req, res) => {
    const { userId, productId } = req.body;

    const deleteQuery = 'DELETE FROM cart WHERE userId = ? AND productId = ?';
    db.query(deleteQuery, [userId, productId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка при удалении товара' });
        }

        if (results.affectedRows > 0) {
            res.json({ message: 'Товар удален из корзины' });
        } else {
            res.status(404).json({ error: 'Товар не найден в корзине' });
        }
    });
});

app.put('/update-cart', (req, res) => {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity === undefined) {
        return res.status(400).json({ error: 'userId, productId и quantity обязательны' });
    }

    const query = 'UPDATE cart SET quantity = ? WHERE userId = ? AND productId = ?';
    db.query(query, [quantity, userId, productId], (err, results) => {
        if (err) {
            console.error('Ошибка при обновлении количества товара:', err);
            return res.status(500).json({ error: 'Ошибка обновления количества товара' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Товар не найден в корзине' });
        }
        res.json({ message: 'Количество товара обновлено' });
    });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
