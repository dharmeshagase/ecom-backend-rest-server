const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
exports.signup = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user)
      return res.status(400).json({
        message: "Admin already registered",
      });
    const { firstName, lastName, email, password } = req.body;
    const hash_password = await bcrypt.hashSync(password, 10);
    const _user = new User({
      firstName,
      lastName,
      email,
      hash_password,
      username: shortid.generate(),
      role: "admin",
    });
    _user.save((error, data) => {
      if (error) {
        return res.status(400).json({
          message: error,
        });
      }
      if (data) {
        return res.status(200).json({
          message: "Admin created successfully",
        });
      }
    });
  });
};

exports.signin = (req, res) => {
  User.findOne({ email: req.body.email }).exec(async (error, user) => {
    if (user) {
      const isPasswordValid = await user.authenticate(req.body.password);
      if (isPasswordValid && user.role === "admin") {
        const { _id, firstName, lastName, role, email, fullName } = user;
        const token = jwt.sign(
          { _id: user._id, role: role },
          process.env.JWT_SECRET,
          { expiresIn: "10h" }
        );
        res.cookie("token", token, { expiresIn: "10h" });
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
        return res.status(400).json({
          message: "Invalid Password",
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
