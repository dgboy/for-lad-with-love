const router = require("express").Router();
const analysis = require("../../public/js/analysis");


// GET запрос анализа переданных urls
router.get("/", async (req, res) => {
    if(req.query.urls) {
        await analysis(req, res, req.query.urls);
    } else {
        res.send("Не было введено ни одного URL!");
    }
});
// POST запрос анализа переданных urls
router.post("/", async (req, res) => {
    if(req.body.urls) {
        await analysis(req, res, req.body.urls);
    } else {
        res.send("Не было введено ни одного URL!");
    }
});

module.exports = router;
