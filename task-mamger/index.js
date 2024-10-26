const app = require('./src/app')
require("dotenv").config();
require('./src/modules/mongoConnection');

app.listen(process.env.PORT, () => {
    console.log(`Run in port ${process.env.PORT}`)
})