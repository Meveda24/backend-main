var mongoose = require("mongoose");
require("dotenv").config();   // 👈 ÖNEMLİ

var dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI);

mongoose.connection.on("connected", function () {
  console.log("MongoDB bağlantısı başarılı");
});

mongoose.connection.on("error", function (err) {
  console.log("MongoDB bağlantı hatası:", err);
});

mongoose.connection.on("disconnected", function () {
  console.log("MongoDB bağlantısı kesildi");
});

process.on("SIGINT", function () {
  mongoose.connection.close();
  process.exit(0);
});

require("./venue");
