const mongoose = require("mongoose");
const Order = require("../dbModals/ordersSchema");
const Product = require("../dbModals/productsDb");

exports.orders_get_all = (req, res, next) => {
    Order.find()
      .select("product quantity _id")
      .populate("product", "name")
      .exec()
      .then((doc) => {
        res.status(200).json({
          count: doc.length,
          orders: doc.map((doc) => {
            return {
              _id: doc._id,
              product: doc.product,
              quantity: doc.quantity,
              request: {
                type: "GET",
                url: "http://localhost:8000/orders/" + doc._id,
              },
            };
          }),
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  },

  exports.create_orders_all = (req, res, next) => {
    Product.findById(req.body.productId)
      .then((product) => {
        if (!product) {
          return res.status(404).json({
            message: "Product not found",
          });
        }
        const order = new Order({
          _id: mongoose.Types.ObjectId(),
          quantity: req.body.quantity,
          product: req.body.productId,
        });
        return order.save();
      })
      .then((result) => {
        res.status(201).json({
          massage: "Order Stored",
          createdOrder: {
            _id: result._id,
            product: result.product,
            quantity: result.quantity,
          },
          request: {
            type: "POST",
            url: "http://localhost:8000/orders/" + result._id,
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          Error: err,
        });
      });
  }, 
   
  exports.orders_get_single = (req, res, next) => {
    Order.findById(req.params.orderId)
      .select("product quantity _id")
      .populate("product")
      .exec()
      .then((order) => {
        if (!order) {
          return res.status(404).json({
            message: "Order Not Found",
          });
        }
        res.status(200).json({
          order: order,
          request: {
            type: "GET",
            url: "http://localhost:8000/orders/",
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  },

  exports.remove_orders = (req, res, next) => {
    Order.remove({
      _id: req.params.orderId,
    })
      .exec()
      .then((order) => {
        res.status(200).json({
          message: "Order Deleted",
          request: {
            type: "POST",
            url: "http://localhost:8000/orders/",
            body: {
              productId: "ID",
              quantity: "Number",
            },
          },
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }
