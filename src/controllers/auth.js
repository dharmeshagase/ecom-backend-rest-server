const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

const generateJwtToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.JWT_SECRET, { expiresIn: "12h" });
};

exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user)
      return res.status(400).json({
        message: "User already registered",
      });
    const { firstName, lastName, email, password } = req.body;
    const hash_password = bcrypt.hashSync(password, 10);
    const _user = new User({
      firstName,
      lastName,
      email,
      hash_password,
      username: shortid.generate(),
    });
    _user.save((error, user) => {
      if (error) {
        return res.status(400).json({
          message: error,
        });
      }
      if (user) {
        const { _id, firstName, lastName, role, email, fullName } = user;
        const token = generateJwtToken(_id, role);
        res.cookie("token", token, { expiresIn: "12h" });
        res.status(200).json({
          token,
          user: {
            _id,
            email,
            firstName,
            lastName,
            role,
          },
        });
      }
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user) {
      const isPasswordValid = await user.authenticate(req.body.password);
      if (isPasswordValid && user.role === "user") {
        const { _id, firstName, lastName, role, email, fullName } = user;
        const token = generateJwtToken(_id, role);
        res.cookie("token", token, { expiresIn: "12h" });
        res.status(200).json({
          token,
          user: {
            _id,
            email,
            firstName,
            lastName,
            role,
          },
        });
      } else {
        if (!isPasswordValid) {
          return res.status(400).json({
            message: "Invalid Password",
          });
        }
        return res.status(400).json({
          message: "Something went wrong",
        });
      }
    } else
      return res.status(400).json({
        message: "Invalid Email",
      });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Signout successful!",
  });
};
