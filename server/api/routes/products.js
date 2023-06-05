const express = require("express");
const router = express.Router();
const multer = require('multer');
const moment = require('moment');

// Imports
const checkAuth = require('../middleware/check-auth');
const productController = require('../controllers/products');


// Multer storage options
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `${moment().format('YYYY-MM-DD-HH-mm-SS')}-${file.originalname}`);
  }
});

// FILTERING FILE TYPE
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
     // Accept file
   cb( null, true)
  } else {
    // we can reject file with the help of below code
    cb('custom error', false)
  }
}

// UPLOAD MULTER MIDDLEWARE FUNCTION
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

// GET ALL PRODUCT DETAIL LIST
router.get("/", productController.get_all_products);

// ADD PRODUCT DETAILS
router.post("/", checkAuth,  upload.single('productImage'), productController.add_single_product);

// SEARCH PRODUCT FROM THE LIST
router.get("/:productId", productController.get_searched_product);

// UPDATE PRODUCT DETAILS
router.patch("/:productId", checkAuth, productController.update_single_product);

// DELETE PRODUCT FROM THE LIST
router.delete("/:productId", checkAuth, productController.delete_product);

module.exports = router;
