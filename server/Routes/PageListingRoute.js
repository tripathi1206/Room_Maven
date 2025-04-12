const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createListing,
    getAllListingProperty,
    getSingleProperty,
    searchProperty
} = require('../Controllers/PageListingController')



/** Configuration Multur for File Uploade**/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // store upload file in uplods folder
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

/** User Register **/
router.post('/create', upload.array("listingPhotos"), createListing);
router.get('/', getAllListingProperty);
router.get('/:listingId', getSingleProperty);
router.get("/search/:search",searchProperty );

module.exports = router;