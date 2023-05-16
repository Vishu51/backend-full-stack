const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../dbModals/productsDb");
const { json } = require("body-parser");

// GET ALL PRODUCT DETAIL LIST
router.get("/", (req, res, next) => {
  Product.find()
    .select("name price _id")
    .exec()
    .then((productList) => {
      const response = {
        count: productList.length,
        products: productList.map((data) => {
          return {
            product: data.name,
            price: data.price,
            id: data._id,
            request: {
              type: "GET",
              url: "http://localhost:8000/products/" + data._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

// ADD PRODUCT DETAILS
router.post("/", (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      res.status(200).json({
        message: "Product Added Successfully.",
        createdProduct: {
          name: result.name,
          price: result.price,
          id: result._id,
          request: {
            type: "POST",
            url: "http://localhost:8000/products/" + result._id
          },
        },
      });
    })
    .catch((err) => {
        console.log("product post error", err),
        res.status(500).json({
            error: err
        })
    });
});

// SEARCH PRODUCT FROM THE LIST
router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id')
    .exec()
    .then((data) => {
        res.status(200).json({
            product: data,
            request: {
                type: "GET",
                url: "http://localhost:8000/products/"
            }
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: error,
      });
    });
});

// UPDATE PRODUCT DETAILS
router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.updateMany({ _id: id }, { $set: req.body })
    .exec()
    .then((obj) => {
        console.log('dddddddddddddddddddddd', obj),
      res.status(200).json({
        message: "Product Updated Successfully.",
        request: {
            type: "PATCH",
            url: "http://localhost:8000/products/" + id,
        }
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

// DELETE PRODUCT FROM THE LIST
router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Success",
        request: {
            type: "POST",
            url: "http://localhost:8000/products/",
            body: {
                name: 'String',
                price: 'Number'
            }
        }
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

module.exports = router;
