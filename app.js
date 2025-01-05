const express = require("express");
const path = require("path");
const customerRoutes = require("./api/routes/customers");
const productRoutes = require("./api/routes/products");
const inventoryRoutes = require("./api/routes/inventory");
const promotionRoutes = require("./api/routes/promotions");
const orderRoutes = require("./api/routes/orders");
const orderDetailsRoutes = require("./api/routes/orderDetails");
const app = express();

//Serve static files
app.use("/static", express.static(path.resolve(__dirname, "public")));

// Route for the store front simulation
app.get("/e-commerce", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "e-commerce.html"));
});

// Route for the order page
app.get("/store-order", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "pages", "store-order.html"));
});

// Route for the order page
app.get("/store-cart", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "pages", "store-cart.html"));
});

// Route for the order page
app.get("/store-order-confirmation", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "public", "pages", "store-order-confirmation.html")
  );
});

//serve data
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/products-inventory", inventoryRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/orders-details", orderDetailsRoutes);

app.get("/*", (req, res) => {
  res.sendFile(path.resolve("public", "index.html"));
});

app.listen(process.env.PORT || 3001, () =>
  console.log("Server running on http://localhost:3001")
);
