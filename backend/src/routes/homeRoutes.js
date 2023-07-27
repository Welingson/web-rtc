import { users } from "../models/user.js";

export async function homeRoutes(app) {
    app.get('/', async (req, res) => {

        try {
            const data = await users();
            res.status(200).send(data);

        } catch (error) {
            res.status(500).send({ message: "Erro ao buscar dados!" })
        }
    })


}