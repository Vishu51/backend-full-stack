const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../authentication/userDbModal/schema");

// FOR SIGNUP
exports.user_signup = (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then((user) => {
        if (user.length > 0) {
          return res.status(409).json({
            message: "Mail exist",
          });
        } else {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                error: err,
              });
            } else {
              const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash,
              });
              user
                .save()
                .then((result) => {
                  console.log("signup user", result);
                  res.status(201).json({
                    message: "User Created Successfully",
                  });
                })
                .catch((err) => {
                  res.status(500).json({
                    error: err,
                  });
                });
            }
          });
        }
      });
  },

// FOR LOGIN USER
exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then((user) => {
        if (user.length < 1) {
          return res.status(401).json({
            message: "Authorization failed",
          });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Authorization failed",
            });
          }
          if (result) {
            const token = jwt.sign({
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: "10h",
            }
            );
            return res.status(200).json({
              message: "Authorization Successful",
              token: token
            });
          }
          res.status(401).json({
            message: "Incorrect Credentials",
          });
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  },

// FOR DELETE USER
exports.delete_user = (req, res, next) => {
    const id = req.params.userId;
    User.findOneAndDelete({
      _id: id,
    })
      .exec()
      .then((data) => {
        console.log("user deleted", data);
        res.status(200).json({
          message: "User Deleted",
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err,
        });
      });
  }