const mongoose = require("mongoose");

mongoose.connect(
  "mongodb+srv://kenmbano:pa55w0rd@cluster0.zs1pv2w.mongodb.net/EMS_DB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});
