const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling GET request'
    });
});
router.post('/', (req, res, next) => {
    const product = {
        name: req.body.name,
        price: req.body.price
    }
    res.status(201).json({
        message: 'Handling post request to /products',
        createdProduct: product
    });
});

router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id === 'special') {
        res.status(200).json({
            message: 'You got the special ID',
            id: id
        })
    } else {
        res.status(200).json({
            message: 'Something Went wrong'
        })
    }
})

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId
    if (id === 'special') {
        res.status(200).json({
            message: 'Updated special ID',
            id: id
        })
    } else {
        res.status(200).json({
            message: 'Something is not updated'
        })
    }
});
router.delete('/', (req, res, next) => {
    res.status(200).json({
        message: 'Handling delete request'
    });
});

module.exports = router