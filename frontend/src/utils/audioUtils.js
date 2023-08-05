let intervalId;

export const playAudio = (audioUrl, interval) => {
    const audioElement = new Audio(audioUrl);
  
    const playAudioOnce = () => {
      audioElement.play().catch((e) => {
        console.error(e);
      });
    };
  
    playAudioOnce();
  
    // Configurar o intervalo para reprodução repetida
    intervalId = setInterval(playAudioOnce, interval);
  
    // Retornar o ID do intervalo para que possa ser gerenciado externamente
  };

  export const pauseAudio = ()=>{ clearInterval(intervalId) }
  