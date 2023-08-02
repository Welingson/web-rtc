import fs from 'fs';

export async function listUsers() {

    try {

        const data = await fs.promises.readFile(process.env.JSON_USERS, 'utf8');

        const jsonData = JSON.parse(data);

        //retorna apenas usuários logados
        const loggedUsers = jsonData.data.filter((user) => user.isLogged);

        return loggedUsers.length ? loggedUsers : false;


    } catch (error) {
        console.log('Erro ao ler arquivo json!', error);
        throw error;

    }

}