import fs from 'fs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'

function generateToken(userId) {
    const bytes = crypto.randomBytes(16);

    const payload = {
        userId: userId,
        randomData: bytes.toString('hex') //exadecimal
    }

    return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_TOKEN_EXPIRE
    })
}

async function setLogged(userId, userData, logged = true) {

    userData = JSON.parse(userData);

    const userIndex = userData.data.findIndex((u) => u.id === userId);

    if (userIndex === -1) return false;

    userData.data[userIndex].isLogged = logged;

    fs.writeFile(process.env.JSON_USERS, JSON.stringify(userData), 'utf8', (err) => {

        if (err) {
            console.log('Falha ao alterar json: ' + err);
        } else {
            console.log('Alterado com sucesso!');
        }
    })

    return true;
}


export async function login({ user, password }) {

    try {

        const data = await fs.promises.readFile(process.env.JSON_USERS, 'utf8');
        const userData = JSON.parse(data).data;
        const userFound = userData.find((u) => u.user === user && u.password === password);

        if (!userFound) return false;

        if (!setLogged(userFound.id, data)) return false;

        return {
            user: userFound.user,
            id: userFound.id,
            level: userFound.level,
            token: generateToken(userFound.id)
        }


    } catch (error) {
        console.error('Erro ao ler arquivo JSON:', error);
        throw error;
    }

}

export async function logout({ id }) {
    try {

        const data = await fs.promises.readFile(process.env.JSON_USERS, 'utf8');
        const userData = JSON.parse(data).data;
        const userFound = userData.find((u) => u.id === id);

        if (!userFound) return false;

        if (!setLogged(id, data, false)) return false;

        return id;

    } catch (error) {
        console.log('Erro ao ler arquivo json: ' + error);

    }
}