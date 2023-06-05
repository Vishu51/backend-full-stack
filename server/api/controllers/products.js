const mongoose = require("mongoose");
const Product = require("../dbModals/productsDb");

(exports.get_all_products = (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then((productList) => {
      const response = {
        count: productList.length,
        products: productList.map((data) => {
          return {
            product: data.name,
            price: data.price,
            productImage: data.productImage,
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
}),
  (exports.add_single_product = (req, res, next) => {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path,
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
              url: "http://localhost:8000/products/" + result._id,
            },
          },
        });
      })
      .catch((err) => {
        console.log("product post error", err),
          res.status(500).json({
            error: err,
          });
      });
  }),
  (exports.get_searched_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
      .select("name price _id productImage")
      .exec()
      .then((data) => {
        res.status(200).json({
          product: data,
          request: {
            type: "GET",
            url: "http://localhost:8000/products/",
          },
        });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          message: error,
        });
      });
  }),
  (exports.update_single_product = (req, res, next) => {
    const id = req.params.productId;
    Product.updateOne({ _id: id }, { $set: req.body })
      .exec()
      .then((obj) => {
        console.log("dddddddddddddddddddddd", obj),
          res.status(200).json({
            message: "Product Updated Successfully.",
            request: {
              type: "PATCH",
              url: "http://localhost:8000/products/" + id,
            },
          });
      })
      .catch((error) => {
        res.status(500).json({
          error: error,
        });
      });
  }),
  (exports.delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
      .exec()
      .then(() => {
        res.status(200).json({
          message: "Success",
          request: {
            type: "POST",
            url: "http://localhost:8000/products/",
            body: {
              name: "String",
              price: "Number",
            },
          },
        });
      })
      .catch((error) => {
        res.status(500).json({
          error: error,
        });
      });
  });
