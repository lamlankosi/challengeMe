import express from 'express';
import path from 'path';
import { connection as db } from './config/index.js';

const app = express();
const port = +process.env.PORT || 4000;
const router = express.Router();

app.use(router,
    express.static('./static'),
    express.json(),
    express.urlencoded({ 
        extended: true 
    })
);

// Endpoint for homepage
router.get('^/$|/challengeMe', (req, res) => {
    res.status(200).sendFile(path.resolve('./static/html/index.html'));
});

// Endpoint for users
router.get('/users', (req, res) => {
    try {
        const strQry = `
        SELECT userName, userSurname, userAge, userEmail
        FROM Users;
        `;
        db.query(strQry, (err, results) => {
            if (err) throw new Error(err);
            res.json({
                status: res.statusCode,
                results
            });
        });
    } catch (e) {
        res.json({
            status: 404,
            msg: e.message
        });
    }
});

// Endpoint for user
router.get('/user/:id', (req, res) => {
    try {
        const strQry = `
        SELECT userName, userSurname, userAge, userEmail
        FROM Users
        WHERE userID = ${req.params.id};
        `;
        db.query(strQry, (err, result) => {
            if (err) throw new Error(err);
            res.json({
                status: res.statusCode,
                result
            });
        });
    } catch (e) {
        res.json({
            status: 404,
            msg: e.message
        });
    }
});


//endpoint for adding products
router.post('/addProduct', (req, res) => {
    try {
        const strQry = `
        INSERT INTO Products (prodName, prodQuantity, prodPrice, prodURL)
        VALUES (?, ?, ?, ?);
        `;
        db.query(strQry, (err, results) => {
            if (err) throw new Error(err);
            res.json({
                status: res.statusCode,
                results
            });
        });
    } catch (e) {
        res.json({
            status: 404,
            msg: e.message
        });
    }
});



//endpoint for deleting product
router.delete('/product/:id', (req, res) => {
    try {
        const strQry = `
        DELETE FROM Products
        WHERE prodID = ${req.params.id};
        `;
        db.query(strQry,(err, results) => {
            if (err) throw new Error(err);
            res.json({
                status: res.statusCode,
                results
            });
        });
    } catch (e) {
        res.json({
            status: 404,
            msg: e.message
        });
    }
});


//endpoint for update
router.patch('/product/:id', (req, res) => {
    try {
        
        const strQry = `
        UPDATE Products
        SET prodName = , prodQuantity = ?, prodPrice = ?, prodURL=?
        WHERE productID = ${req.params.id};
        `;
        db.query(strQry, (err, results) => {
            if (err) throw new Error(err);
            res.json({
                status: res.statusCode,
                results
            });
        });
    } catch (e) {
        res.json({
            status: 404,
            msg: e.message
        });
    }
});


// Handle invalid endpoints
router.get('*', (req, res) => {
    res.json({
        status: 400,
        msg: 'Resource not found'
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
