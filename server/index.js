var express = require('express');
var app = express();
const connectDB = require('./db/connect')
const morgan = require('morgan')
const bodyParser = require('body-parser')

// API IMPORTS
const authApi = require('./authentication/auth');
const productRoutes = require('./api/routes/routes/products')
const orderRoutes = require('./api/routes/routes/orders');



// MIDDLEWARE
app.use(morgan('dev'));
app.use('/uploads', express.static('uploads')); // Making folder public
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

// Best approach is to connect data base first then to the server
let dataBaseConnection = async () => {
   const connectedDb = await connectDB();
   if (!connectedDb) {
    console.log('Database Connection could not happen');
    return 
   }
   app.listen(8000, function () {
    console.log('Example app listening on port 8000.');
});
};

dataBaseConnection()

