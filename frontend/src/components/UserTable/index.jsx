import { React} from 'react'

import { useAuth } from "../../context/authContext";


export function UsersTable({ users, handleCallNotification }) {
	const { authState} = useAuth();

	return (
		<>
			<table>
				<thead>
					<tr>
						<th>Usuário</th>
						<th>Status</th>
						<th>Ação</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user, index) => {
						if (user.user !== authState.user) {
							return (
								<tr key={index}>
									<td>{user.user}</td>
									<td>Online</td>
									<td><button onClick={() => { handleCallNotification(user.user) }}>Ligar</button></td>
								</tr>
							)
						}
					})}

				</tbody>

			</table>
		</>
	)
}