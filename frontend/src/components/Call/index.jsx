import { socket } from "../../services/socket";

import { Section } from './style'

import {
	getUserMedia,
	createPeerConnection,
	initCreateOffer,
	initCreateAnswer,
	initIceCandidate,
	setCaller,
	setIsCaller,
	setReceiver,
	initSetRemoteDescription
} from "../../services/call";
import { useEffect, useState } from "react";

import { useAuth } from "../../context/authContext";

const callEventsMsg = {
	waitingReply: "Aguardando resposta",
	callDeclined: "Chamada recusada",
}

/**
 *  EXIBE INFORMAÇÕES DA CHAMADA (tempo, usuários da chamada, audio etc)
 * 
 * closeModal = função do componente home que oculta esse componente
 * userCall = usuário da chamada
 * callEvents = eventos e status da chamada, exemplo: 
 * 'Aguardando resposta', 'Chamda recusada' etc
 *
 */
export function Call({ closeModal, userCall, callEvents }) {

	const { authState } = useAuth();


	return (
		<>
			<Section>

				<div>{userCall}</div> 
				<div>{callEvents !== '' ? callEventsMsg[callEvents] : ''}</div>
				<div>
					<button>Ações da chamada</button>
					<button onClick={closeModal}>Cancelar</button>
				</div>
			</Section>

		</>
	)
}