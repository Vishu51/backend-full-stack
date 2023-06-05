const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const ordersController = require("../controllers/orders");


// GET ALL ORDERS
router.get("/", checkAuth, ordersController.orders_get_all);

// FOR CREATE ORDERS
router.post("/", checkAuth, ordersController.create_orders_all);

// FOR SINGLE ORDER
router.get("/:orderId", checkAuth, ordersController.orders_get_single);

// FOR DELETE ORDER
router.delete("/:orderId", checkAuth, ordersController.remove_orders);

module.exports = router;
