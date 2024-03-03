const express = require('express')
const app = express()
const port = 5000
const mongoDB = require("./db")
mongoDB();


app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); ; 
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, adminkey, token"
  );
  next();
});


app.use(express.json())
app.use('/api', require("./Routes/CreateUser"))
app.use('/api', require("./Routes/ProductData"))
app.use('/api', require("./Routes/OrderData"))
app.use('/api', require("./Routes/CartRoute"))
app.use('/api', require("./Routes/AdminRoute"))
app.use('/api', require("./Routes/PaymentRoute"))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})