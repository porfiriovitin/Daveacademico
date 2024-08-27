const chamados = JSON.parse(localStorage.getItem('chamados')) || [];

function carregarChamados() {
    const chamadosLista = document.getElementById('chamados');
    chamadosLista.innerHTML = '';

    chamados.forEach((chamado, index) => {
        const chamadoItem = document.createElement('div');
        chamadoItem.classList.add('p-3', 'text-center', 'chamado-item');
        chamadoItem.style.cursor = 'pointer';
        chamadoItem.textContent = chamado.titulo;
        chamadoItem.addEventListener('click', () => mostrarDetalhesChamado(index));
        chamadosLista.appendChild(chamadoItem);
    });
}

function mostrarDetalhesChamado(index) {
    const chamado = chamados[index];
    const detalhe = document.getElementById('detalhe');
    detalhe.innerHTML = `
        <p class="chamado-titulo fs-3 text-light"><strong class="fw-bold">Título:</strong> ${chamado.titulo}</p>
        <p class="chamado-descricao fs-5 text-light"><strong class="fw-bold">Descrição:</strong> ${chamado.descricao}</p>
        <p class="chamado-sistema fs-5 text-light"><strong class="fw-bold">Sistema:</strong> ${chamado.sistema}</p>
        <p class="chamado-anexo fs-5 text-light"><strong class="fw-bold">Anexo:</strong> ${chamado.anexo ? chamado.anexo : 'Nenhum anexo'}</p>
    `;
}

document.getElementById('abrir-chat').addEventListener('click', function() {
    // Chat em pop-up
    const chatPopup = document.createElement('div');
    chatPopup.style.position = 'fixed';
    chatPopup.style.bottom = '0';
    chatPopup.style.right = '0';
    chatPopup.style.width = '400px';
    chatPopup.style.height = '600px';
    chatPopup.style.backgroundColor = '#151515';
    chatPopup.style.border = '1px solid #fff';
    chatPopup.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
    chatPopup.id = 'chat-popup';

    const chatHeader = document.createElement('div');
    chatHeader.style.backgroundColor = '#19456A';
    chatHeader.style.color = 'white';
    chatHeader.style.padding = '1em';
    chatHeader.style.borderBottom = '1px solid #fff';
    chatHeader.style.textAlign = 'center';
    chatHeader.style.fontFamily = 'Inter, sans-serif';
    chatHeader.textContent = 'Dav-e';

    const closeBtn = document.createElement('span');
    closeBtn.textContent = 'X';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.float = 'right';
    closeBtn.style.marginRight = '10px';
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(chatPopup);
    });

    chatHeader.appendChild(closeBtn);

    const chatBody = document.createElement('div');
    chatBody.style.height = 'calc(100% - 40px)';
    chatBody.style.overflowY = 'auto';
    chatBody.style.padding = '10px';
    chatBody.innerHTML = `
        <div id="chat-box" class="mb-3" style="height: calc(100% - 60px); overflow-y: auto;"></div>
        <div class="input-group">
            <input id="user-input" type="text" class="form-control" placeholder="Digite sua mensagem...">
            <button id="send-btn" class="send-btn">Enviar</button>
        </div>
    `;

    chatPopup.appendChild(chatHeader);
    chatPopup.appendChild(chatBody);
    document.body.appendChild(chatPopup);

    // Evento de envio de mensagem
    document.getElementById('send-btn').addEventListener('click', () => {
        sendMessage();
    });

    document.getElementById('user-input').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    function sendMessage() {
        const userInput = document.getElementById('user-input').value;
        if (userInput) {
            addMessageToChat(userInput, 'user');
            document.getElementById('user-input').value = '';
            fetchResponse(userInput);
        }
    }

    function addMessageToChat(message, sender) {
        const chatBox = document.getElementById('chat-box');
        const messageElement = document.createElement('div');
        messageElement.classList.add(sender);

        const messageContent = document.createElement('div');
        messageContent.classList.add(sender === 'user' ? 'usuario-msg' : 'bot-message');
        messageContent.textContent = message;

        messageElement.appendChild(messageContent);
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function showTypingIndicator() {
        const chatBox = document.getElementById('chat-box');
        const typingIndicator = document.createElement('div');
        typingIndicator.id = 'typing-indicator';
        typingIndicator.classList.add('bot');
        
        const typingMessage = document.createElement('div');
        typingMessage.classList.add('bot-message');

        const typingDots = document.createElement('div');
        typingDots.classList.add('typing-dots');
        typingDots.innerHTML = '<div></div><div></div><div></div>';

        typingMessage.appendChild(typingDots);
        typingIndicator.appendChild(typingMessage);
        chatBox.appendChild(typingIndicator);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    async function fetchResponse(userInput) {
        showTypingIndicator();
        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer chavedaAPI` //  chave da API
                },
                body: JSON.stringify({
                    model: "gpt-4",  
                    messages: [{ role: "user", content: userInput }],
                    max_tokens: 1000
                })
            });

            if (!response.ok) {
                throw new Error(`Erro na resposta da API: ${response.statusText}`);
            }

            const data = await response.json();
            const messageContent = data.choices[0].message.content;
            addMessageToChat(messageContent, 'bot'); // Mostra a resposta do bot no chat
        } catch (error) {
            console.error('Erro ao obter resposta:', error);
            addMessageToChat('Desculpe, algo deu errado. Tente novamente mais tarde.', 'bot');
        } finally {
            removeTypingIndicator();
        }
    }
});

carregarChamados();
