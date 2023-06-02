const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const moment = require('moment');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `${moment().format('YYYY-MM-DD-HH-mm-SS')}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
     // Accept file
   cb(null, true)
  } else {
    // we can reject file with the help of below code
    cb(null, false)
  }
}


const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

const Product = require("../dbModals/productsDb");

// GET ALL PRODUCT DETAIL LIST
router.get("/", (req, res, next) => {
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
});

// ADD PRODUCT DETAILS
router.post("/", upload.single('productImage'), (req, res, next) => {
  console.log('uploaded', req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
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
    .select('name price _id productImage')
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
  Product.updateOne({ _id: id }, { $set: req.body })
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
    .then(() => {
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
