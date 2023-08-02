import { listUsers } from "../models/user.js"

export const userController = {

    list: async (req, res) => {

        const users = await listUsers();
        if (!users) {
            res.status(204).send({ data: [] })
            return;
        }

        res.status(200).send({ data: users })

    }

}