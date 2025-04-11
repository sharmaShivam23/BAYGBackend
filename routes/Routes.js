const express = require('express');
const router = express.Router();
const { contact } = require("../controllers/userAuth");


router.post("/contact", contact);


module.exports = router;
