import fs from 'fs';

export async function listUsers() {

    try {

        const data = await fs.promises.readFile(process.env.JSON_USERS, 'utf8');

        const jsonData = JSON.parse(data);

        //retorna apenas usuários logados
        const loggedUsers = jsonData.data.filter((user) => user.isLogged);

        if (!loggedUsers.length) {
            return false;
        }

        const listUsers = loggedUsers.map((user)=>({
            id: user.id,
            user: user.user,
            level: user.level
        }))

        return listUsers;


    } catch (error) {
        console.log('Erro ao ler arquivo json!', error);
        throw error;

    }

}