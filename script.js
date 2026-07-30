// Variável global para armazenar os dados carregados do JSON
let dbLuisGomes = [];

// 1. Inicialização: Consumindo API do IBGE e o arquivo JSON local
window.onload = function() {
    // Busca dados do IBGE
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

    // Busca o banco de dados de conhecimento local (o arquivo JSON)
    fetch('dados.json')
        .then(response => response.json())
        .then(data => {
            dbLuisGomes = data;
            console.log("Banco de dados histórico carregado!");
        })
        .catch(error => console.error("Erro ao carregar dados.json:", error));
};

// 2. Função para remover acentos e padronizar o texto
function normalizeText(text) {
    return text
        .normalize('NFD')                     // Separa os acentos das letras
        .replace(/[\u0300-\u036f]/g, "")      // Remove os acentos
        .replace(/[^\w\s]/gi, '')             // Remove pontuações
        .toLowerCase();                       // Transforma em minúsculo
}

// 3. O Novo Motor de Busca Inteligente com Scoring
function getBotResponse(input) {
    const normalizedInput = normalizeText(input);
    
    let bestMatch = null;
    let maxScore = 0;

    // Percorre cada item do nosso banco de dados
    for (const item of dbLuisGomes) {
        let score = 0;
        
        // Verifica as tags do item contra a frase do usuário
        for (const tag of item.tags) {
            const normalizedTag = normalizeText(tag);
            if (normalizedInput.includes(normalizedTag)) {
                score += 1; 
            }
        }

        // Atualiza a melhor resposta se a pontuação for maior
        if (score > maxScore) {
            maxScore = score;
            bestMatch = item.response;
        }
    }

    // Se encontrou alguma correspondência, retorna. Se não, fallback.
    if (maxScore > 0) {
        return bestMatch;
    } else {
        return "Que interessante! Ainda estou aprendendo sobre todos os detalhes da nossa serra. Tente perguntar usando outras palavras sobre a Igreja Matriz, o Mirante, o Dubas ou o Piozão.";
    }
}

// 4. Lógica de Interface do Chat
function sendMessage() {
    const inputField = document.getElementById('user-input');
    const userText = inputField.value.trim();
    
    if (userText === "") return;

    addMessage(userText, 'user');
    inputField.value = "";

    // Simula o tempo de digitação (processamento) do assistente
    setTimeout(() => {
        // Se os dados não carregaram ainda por algum motivo
        if (dbLuisGomes.length === 0) {
            addMessage("Ainda estou carregando meus livros de história. Tente de novo em um segundo!", 'bot');
            return;
        }

        const botResponse = getBotResponse(userText);
        addMessage(botResponse, 'bot');
    }, 500);
}

function addMessage(text, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender);
    messageDiv.innerText = text;
    chatBox.appendChild(messageDiv);
    
    chatBox.scrollTop = chatBox.scrollHeight;
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}
