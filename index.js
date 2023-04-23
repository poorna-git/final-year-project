const express = require('express');
const expressApp = express();
const cors = require('cors');
require("dotenv").config();
const { existsSync, writeFile } = require('fs');

const userRoutes = require('./routes/user.routes');

expressApp.use(express.urlencoded( {extended: false} ));
expressApp.use(express.json());

expressApp.use(cors({
    origin: "*"
}));

expressApp.use('/user', userRoutes);

expressApp.use("/", (request, response) => {
    response.send("Base Route");
});

expressApp.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
    try {
        if (!existsSync('./assets/users.json')) {
            writeFile('./assets/users.json', '[]', (err) => {
                if (err) 
                    throw err;
            });
        }
    } catch (err) {
        console.log(err);
    }
});