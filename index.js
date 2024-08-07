import express from 'express';
import path from 'path';
import { connection as db } from './config/index.js';

const app = express();
const port = +process.env.PORT || 4000;
const router = express.Router();

app.use(router,
    express.static('./static'),
    express.json(),
    express.urlencoded({ extended: true })
);

// Endpoint for homepage
router.get('^/$|/eShop', (req, res) => {
    res.status(200).sendFile(path.resolve('./static/html/index.html'));
});

// Endpoint for users
router.get('/users', (req, res) => {
    try {
        const strQry = `
        SELECT firstName, lastName, age, emailAdd
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

// Endpoint for a single user
router.get('/user/:id', (req, res) => {
    try {
        const strQry = `
        SELECT userID, firstName, lastName, age, emailAdd
        FROM Users
        WHERE userID = ${req.params.id};
        `;
        db.query(strQry, (err, result) => {
            if (err) throw new Error('Unable to fetch user details');
            res.json({
                status: res.statusCode,
                result: result[0]
            });
        });
    } catch (e) {
        res.json({
            status: 404,
            msg: e.message
        });
    }
});

// Endpoint to add a user
router.post('/register', (req, res) => {
    try {
        const { firstName, lastName, age, emailAdd, pwd } = req.body;
        const strQry = `
        INSERT INTO Users (firstName, lastName, age, emailAdd, pwd)
        VALUES (?, ?, ?, ?, ?);
        `;
        db.query(strQry, [firstName, lastName, age, emailAdd, pwd] , (err, results) => {
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

// Endpoint to update a user
router.patch('/user/:id', (req, res) => {
    try {
        const { firstName, lastName, age, emailAdd } = req.body;
        const strQry = `
        UPDATE Users
        SET firstName = ?, lastName = ?, age = ?, emailAdd = ?
        WHERE userID = ?;
        `;
        db.query(strQry, [firstName, lastName, age, emailAdd], (err, results) => {
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
