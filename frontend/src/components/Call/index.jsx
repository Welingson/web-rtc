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
 * EXIBE UMA MENSAGEM DE 'AGUARDANDO RESPOSTA'
 */
export function WaitingReply({ userCall }) {

  return (<>
    <div>
      <div>Aguardando resposta de {userCall}</div>
    </div>
  </>)
}

/**
 * EXIBE UMA MENSAGEM CASO UM USUÁRIO SE DESCONECTE OU REJEITE A CHAMADA
 */
export function DisconnectCall({message, closeDisconnecModal }) {
  return (<>
    <div>
      <div>{message}</div>
      <button onClick={closeDisconnecModal}>Fechar</button>
    </div>
  </>)
}

/**
 * EXIBE UM ELEMENTO COM BOTÕES DE ACEITAR OU RECUSAR CHAMADA
 */
export function IncomingCall({ userCall, handleIncomingCall }) {

  return (<>
    <div>
      <div>Chamada recebida de {userCall}</div>
      <button onClick={()=> handleIncomingCall(true)}>Aceitar</button>
      <button onClick={()=> handleIncomingCall(false)}>Recusar</button>
    </div>
  </>)

}