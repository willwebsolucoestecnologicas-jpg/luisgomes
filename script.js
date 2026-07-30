// 1. Banco de Dados Local (Simulando seu futuro banco externo)
const dbLuisGomes = {
    "igreja matriz": "A Igreja Matriz de Senhora Santana teve sua origem em 1806, através de uma promessa do Padre Anacleto. A capela inicial foi elevada à paróquia em 1886 e a construção atual ganhou forma a partir de 1914.",
    "mirante": "O Complexo Turístico Mirante Alto Serrano foi inaugurado em 2005. É o ponto mais alto da região, oferecendo uma vista incrível do Planalto da Borborema.",
    "padre osvaldo": "Padre Raimundo Osvaldo Rocha foi pároco da cidade por 28 anos e um dos prefeitos mais influentes da história do município. Faleceu em 2018 e hoje dá nome ao tradicional Colégio Municipal.",
    "coronel fernandes": "O Coronel Fernandes pertencia à oligarquia tradicional da cidade. O Grupo Escolar com seu nome foi fundado em 1912, sendo o pioneiro no ensino estadual na região.",
    "piozão": "A praça 'O Piozão' é o centro de eventos da cidade. Seu nome é uma homenagem ao Dr. Pio X Fernandes, médico e histórico ex-prefeito. É o principal palco da Festa de Sant'Ana em julho.",
    "default": "Que interessante! Ainda estou aprendendo sobre todos os detalhes da nossa serra. Você pode me perguntar sobre a Igreja Matriz, o Mirante, o Piozão, ou figuras como Padre Osvaldo."
};

// 2. Consumindo API do IBGE ao carregar a página
window.onload = function() {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios/2406606')
        .then(response => response.json())
        .then(data => {
            const ibgeHeader = document.getElementById('ibge-info');
            ibgeHeader.innerText = `${data.nome} - ${data.microrregiao.mesorregiao.UF.sigla} | Região: ${data.microrregiao.nome}`;
        })
        .catch(error => {
            console.error('Erro ao buscar dados do IBGE:', error);
            document.getElementById('ibge-info').innerText = "Luís Gomes, RN";
        });
};

// 3. Lógica do Chat
function sendMessage() {
    const inputField = document.getElementById('user-input');
    const userText = inputField.value.trim();
    
    if (userText === "") return;

    // Adiciona mensagem do usuário na tela
    addMessage(userText, 'user');
    inputField.value = "";

    // Simula o tempo de digitação do assistente
    setTimeout(() => {
        const botResponse = getBotResponse(userText.toLowerCase());
        addMessage(botResponse, 'bot');
    }, 500);
}

function addMessage(text, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.innerText = text;
    chatBox.appendChild(messageDiv);
    
    // Rola o chat para o final
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 4. Mecanismo simples de busca de palavras-chave
function getBotResponse(input) {
    for (const key in dbLuisGomes) {
        if (input.includes(key)) {
            return dbLuisGomes[key];
        }
    }
    return dbLuisGomes["default"];
}

// Permite enviar com a tecla Enter
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}
