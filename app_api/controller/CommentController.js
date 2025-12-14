var mongoose = require("mongoose");
var Venue = mongoose.model("Venue");

// Ortak response fonksiyonu
const createResponse = function (res, status, content) {
    res.status(status).json(content);
};

// 🔹 Yardımcı fonksiyon: Ortalama puanı güncelle
const updateAverageRating = function (venue) {
    if (venue.comments.length === 0) {
        venue.rating = 0;
    } else {
        let total = 0;
        venue.comments.forEach(function (comment) {
            total += comment.rating;
        });
        venue.rating = total / venue.comments.length;
    }
};

// 🔹 YORUM EKLE (POST) ⭐ SLAYT 01
const addComment = function (req, res) {
    Venue.findById(req.params.venueid).exec()
        .then(function (venue) {
            if (!venue) {
                createResponse(res, 404, { message: "Mekan bulunamadı" });
                return;
            }

            venue.comments.push({
                author: req.body.author,
                rating: req.body.rating,
                text: req.body.text
            });

            updateAverageRating(venue);

            return venue.save();
        })
        .then(function (venue) {
            if (venue) {
                createResponse(res, 201, venue.comments.slice(-1)[0]);
            }
        })
        .catch(function (err) {
            createResponse(res, 400, err);
        });
};

// 🔹 TEK YORUM GETİR (GET)
const getComment = function (req, res) {
    Venue.findById(req.params.venueid)
        .select("name comments")
        .exec()
        .then(function (venue) {
            if (!venue) {
                createResponse(res, 404, { message: "Mekan bulunamadı" });
                return;
            }

            const comment = venue.comments.id(req.params.commentid);
            if (!comment) {
                createResponse(res, 404, { message: "Yorum bulunamadı" });
                return;
            }

            createResponse(res, 200, {
                venue: {
                    name: venue.name,
                    id: venue._id
                },
                comment: comment
            });
        })
        .catch(function (err) {
            createResponse(res, 404, err);
        });
};

// 🔹 YORUM GÜNCELLE (PUT) ⭐ SLAYT 02
const updateComment = function (req, res) {
    Venue.findById(req.params.venueid).exec()
        .then(function (venue) {
            if (!venue) {
                createResponse(res, 404, { message: "Mekan bulunamadı" });
                return;
            }

            const comment = venue.comments.id(req.params.commentid);
            if (!comment) {
                createResponse(res, 404, { message: "Yorum bulunamadı" });
                return;
            }

            comment.author = req.body.author || comment.author;
            comment.rating = req.body.rating || comment.rating;
            comment.text = req.body.text || comment.text;

            updateAverageRating(venue);

            return venue.save();
        })
        .then(function (venue) {
            if (venue) {
                createResponse(res, 200, { message: "Yorum güncellendi" });
            }
        })
        .catch(function (err) {
            createResponse(res, 400, err);
        });
};

// 🔹 YORUM SİL (DELETE) ⭐ SLAYT 03
const deleteComment = function (req, res) {
    Venue.findById(req.params.venueid).exec()
        .then(function (venue) {
            if (!venue) {
                createResponse(res, 404, { message: "Mekan bulunamadı" });
                return;
            }

            const comment = venue.comments.id(req.params.commentid);
            if (!comment) {
                createResponse(res, 404, { message: "Yorum bulunamadı" });
                return;
            }

            comment.deleteOne();
            updateAverageRating(venue);

            return venue.save();
        })
        .then(function () {
            createResponse(res, 200, { message: "Yorum silindi" });
        })
        .catch(function (err) {
            createResponse(res, 404, err);
        });
};

module.exports = {
    addComment,
    getComment,
    updateComment,
    deleteComment
};


