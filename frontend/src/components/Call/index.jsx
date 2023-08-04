import { Section } from './style'

/**
 * EXIBE INFORMAÇÕES DA CHAMADA (tempo, usuários da chamada, audio etc)
 */
export function Call({ closeCall, userCall }) {

  return (
    <>
      <Section>
        <div>Chamada em andamento com {userCall}</div>
        <div>
          <button onClick={closeCall}>Desconectar</button>
        </div>
      </Section>

    </>
  )
}

/**
 * EXIBE UMA MENSAGEM DE ESPERA
 */
export function WaitingReply({userCall}) {

  return (<>
    <div>
      <div>Aguardando resposta de {userCall}</div>
    </div>
  </>)
}

/**
 * EXIBE UMA MENSAGEM CASO UM USUÁRIO SE DISCONNECT 
 */
export function DisconnectCall({userCall, closeDisconnecModal}) {
  return (<>
    <div>
      <div>{userCall} desconectou</div>
      <button onClick={closeDisconnecModal}>Fechar</button>
    </div>
  </>)
}