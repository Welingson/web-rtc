import { login, logout } from "../models/auth.js"
import { getIO } from "../services/socket.js";

export const authController = {

    login: async (req, res) => {

        const user = await login(req.body);

        if (!user) {
            res.status(401).send({ msg: 'Usuário ou senha inválidos!' })
            return;
        }

        const loginNotify = {
            id: user.id,
            user: user.user,
            level: user.level
        }

        getIO().emit('login', { data: loginNotify });

        res.send({ data: user })
    },

    logout: async (req, res) => {
        const result = await logout(req.body);

        if (!result) {
            res.status(404).send({ data: [] })
            return;
        }

        getIO().emit("logout", {
            id: result
        })

        res.send({ message: "Logout realizado!" });
    }
}