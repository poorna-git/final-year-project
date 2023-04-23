const { hash, compare } = require('bcrypt');
const { sign } = require("jsonwebtoken");
require("dotenv").config();

const responses = require('../utils/constResponses.json');
const fileHelper = require('../utils/fileHelpers');

const register = async (request, response) => {
    const usersData = fileHelper.readFileHelper('./assets/users.json');
    let index = -1;
    index = usersData.findIndex(user => user.id === request.body.id);
    if(index !== -1) {
        responses.body.status = 409;
        responses.body.data.push(request.body);
        responses.body.message = responses.messages.fail.register.conflict;
        response.status(409).send(responses.body);
    } else {
        let hashedPassword;
        hashedPassword = await hash(request.body.password, parseInt(process.env.SALTROUNDS));
        const encryptedData = {
            id: request.body.id,
            username: request.body.username,
            password: hashedPassword
        }
        usersData.push(encryptedData);
        if(fileHelper.writeFileHelper('./assets/users.json', usersData)) {
            responses.body.status = 200;
            responses.body.data.push(request.body);
            responses.body.message = responses.messages.succeess.register;
            response.status(200).send(responses.body);
        } else {
            responses.body.status = 400;
            responses.body.data.push(request.body);
            responses.body.message = responses.messages.fail.file.write;
            response.status(400).send(responses.body);
        }
    }
}

const login = async (request, response) => {
    const usersData = fileHelper.readFileHelper('./assets/users.json');
    let index = -1;
    index = usersData.findIndex(user => user.userId === request.body.userId);
    if(index !== -1) {
        if(request.body.username == usersData[index].username && await compare(request.body.password, usersData[index].password)) {
            const token = sign(usersData[index], process.env.JWTSECRETKEY, { expiresIn: "24h" });
            responses.body.status = 200;
            responses.body.data.push({
                userId: usersData[index].id,
                username: usersData[index].username,
                token: token
            });
            responses.body.message = responses.messages.succeess.login;
            response.status(200).send(responses.body);
        } else {
            responses.body.status = 409;
~~                userId: usersData[index].id,
                username: usersData[index].username
            });
            responses.body.message = responses.messages.fail.login.validation;
            response.status(409).send(responses.body); 
        }
    } else {
        responses.body.status = 400;
        responses.body.data.push({
            userId: usersData[index].id,
            username: usersData[index].username
        });
        responses.body.message = responses.messages.fail.login.unkown;
        response.status(400).send(responses.body); 
    }
}

module.exports = { 
    register, 
    login 
};