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



export function Call({ closeModal, userCall, callEvents }) {

	const { authState } = useAuth();

	useEffect(() => {


	}, [])


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