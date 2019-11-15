const app = require('express')();
const routes = require("./api/routes/routes");


// Route для API
app.use("/api/text-analysis", routes);

app.listen(3000);
