import { login, logout } from "../models/auth.js"

import { io } from "../services/socket.js";

export async function authRoutes(app) {
    app.post('/auth/login', async (req, res) => {

        try {
            const user = await login(req.body)

            if (!user) return res.status(401).send({ message: "Usuário ou senha inválidos!" })

            const token = await res.jwtSign({}, {
                sign: {
                    sub: user.user
                }
            })

            io.emit('logged', {
                user: user
            });

            res.status(200).send({ data: user, token: token });

        } catch (error) {

            res.status(500).send({ message: "Erro ao fazer login: " + error })

        }
    })

    app.post('/auth/logout', async (req, res) => {

        try {
            const result = await logout(req.body)

            if (!result) res.status(401).send({ message: "Usuário não encontrado" });

            io.emit('loggedOut', {
                id: result
            })

            res.status(200).send({ message: "Deslogado" });

        } catch (error) {
            res.status(500).send({ message: "Falha no logout: " + error })

        }
    })

}