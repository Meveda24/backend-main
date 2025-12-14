var mongoose = require("mongoose");
var Venue = mongoose.model("Venue");

// Ortak response fonksiyonu
const createResponse = function (res, status, content) {
    res.status(status).json(content);
};

// 🔹 TÜM MEKANLARI LİSTELE (GET)
const listVenues = function (req, res) {
    Venue.find().exec()
        .then(function (venues) {
            createResponse(res, 200, venues);
        })
        .catch(function (err) {
            createResponse(res, 404, err);
        });
};

// 🔹 TEK MEKAN GETİR (GET)
const getVenue = function (req, res) {
    Venue.findById(req.params.venueid).exec()
        .then(function (venue) {
            if (!venue) {
                createResponse(res, 404, { message: "Mekan bulunamadı" });
                return;
            }
            createResponse(res, 200, venue);
        })
        .catch(function (err) {
            createResponse(res, 404, err);
        });
};

// 🔹 YENİ MEKAN EKLE (POST)
const addVenue = function (req, res) {
    Venue.create({
        name: req.body.name,
        address: req.body.address,
        foodanddrink: req.body.foodanddrink,
        coordinates: req.body.coordinates,
        hours: req.body.hours
    })
        .then(function (venue) {
            createResponse(res, 201, venue);
        })
        .catch(function (err) {
            createResponse(res, 400, err);
        });
};

// 🔹 MEKAN GÜNCELLE (PUT)  ⭐ SLAYT 02
const updateVenue = function (req, res) {
    Venue.findById(req.params.venueid).exec()
        .then(function (venue) {
            if (!venue) {
                createResponse(res, 404, { message: "Mekan bulunamadı" });
                return;
            }

            venue.name = req.body.name || venue.name;
            venue.address = req.body.address || venue.address;
            venue.foodanddrink = req.body.foodanddrink || venue.foodanddrink;
            venue.hours = req.body.hours || venue.hours;

            return venue.save();
        })
        .then(function (venue) {
            if (venue) {
                createResponse(res, 200, venue);
            }
        })
        .catch(function (err) {
            createResponse(res, 400, err);
        });
};

// 🔹 MEKAN SİL (DELETE) ⭐ SLAYT 03
const deleteVenue = function (req, res) {
    Venue.findByIdAndDelete(req.params.venueid)
        .then(function (venue) {
            if (!venue) {
                createResponse(res, 404, { message: "Mekan bulunamadı" });
                return;
            }
            createResponse(res, 200, { message: "Mekan silindi" });
        })
        .catch(function (err) {
            createResponse(res, 404, err);
        });
};

module.exports = {
    listVenues,
    getVenue,
    addVenue,
    updateVenue,
    deleteVenue
};

