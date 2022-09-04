const express = require("express");
const env = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

//routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const initialDataRoutes = require("./routes/admin/initialData");
const pageRoutes = require("./routes/page");
const addressRoutes = require("./routes/address");
const orderRoutes = require("./routes/order");
const adminOrderRoutes = require("./routes/admin/order");

//Environment variable or constants
env.config();

//Mongoose DB Connection
const db = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.9ojmg.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;
// const db = `mongodb+srv://root:admin@cluster0.9ojmg.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(db).then(() => {
  console.log("Database connected");
});

const app = express();
app.use(cors());
app.use(express.json());
//This is used to expose the uploads folder as static and be able to serve the files whenever the files path is given in the url
//.....http://localhost:Portnumber/public/filename is hit,the express will serve that particular file from the uploads folder
app.use("/public", express.static(path.join(__dirname, "uploads")));
app.use("/api", authRoutes);
app.use("/api", adminRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", initialDataRoutes);
app.use("/api", pageRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);
app.use("/api", adminOrderRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
