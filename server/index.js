var express = require('express');
var app = express();
const connectDB = require('./db/connect')
const morgan = require('morgan')
const bodyParser = require('body-parser')

// API IMPORTS
const authApi = require('./authentication/auth');
const productRoutes = require('./api/routes/products')
const orderRoutes = require('./api/routes/orders')



// MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS-ERROR-MIDDLEWARE
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'GET, POST, PUT, PATCH, DELETE'
        );
        return res.status(200).json({});
    }
    next();
})



// ROUTES WHICH SHOULD HANDEL REQUESTS
app.use(authApi);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// ERROR HANDLER MIDDLEWARE-S

// CUSTOM ERROR
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

// GLOBAL ERROR
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

app.listen(8000, function () {
    connectDB()
    console.log('Example app listening on port 8000.');
});