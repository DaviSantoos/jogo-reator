document.addEventListener('DOMContentLoaded', () => {
    const statusText = document.getElementById('status-text');
    const buttonGrid = document.getElementById('button-grid');
    const startButton = document.getElementById('start-button');
    const buttons = document.querySelectorAll('.game-button');

    // Variáveis do Jogo
    const TOTAL_BUTTONS = 5;
    let sequence = []; // Armazena a sequência a ser repetida
    let playerSequence = []; // Armazena os cliques do jogador
    let level = 1;
    let isPlayerTurn = false;
    let canStartNewGame = true;

    // --- FUNÇÕES DE LÓGICA DO JOGO ---

    /** Gera uma nova sequência com base no nível atual. */
    function generateSequence() {
        sequence = [];
        for (let i = 0; i < level; i++) {
            // Adiciona um índice aleatório (0 a 4) à sequência
            const randomIndex = Math.floor(Math.random() * TOTAL_BUTTONS);
            sequence.push(randomIndex);
        }
        playerSequence = [];
    }

    /** Mostra visualmente a sequência ao jogador. */
    function showSequence() {
        startButton.disabled = true; // Desabilita o botão INICIAR
        isPlayerTurn = false;
        statusText.textContent = `Nível ${level}: Observe...`;

        let i = 0;
        const interval = setInterval(() => {
            if (i < sequence.length) {
                const buttonIndex = sequence[i];
                flashButton(buttonIndex);
                i++;
            } else {
                clearInterval(interval);
                // Após mostrar a sequência, é a vez do jogador
                isPlayerTurn = true;
                statusText.textContent = `Sua vez! Repita a sequência de ${level} botões.`;
            }
        }, 800); // 800ms entre cada flash
    }

    /** Faz um botão piscar (adiciona/remove a classe 'active'). */
    function flashButton(index) {
        const button = buttons[index];
        button.classList.add('active');
        setTimeout(() => {
            button.classList.remove('active');
        }, 400); // 400ms de duração do flash
    }

    /** Inicia o próximo nível do jogo. */
    function nextLevel() {
        level++;
        generateSequence();
        setTimeout(showSequence, 1000); // Dá um pequeno delay antes de mostrar a nova sequência
    }

    /** Verifica se o último clique do jogador está correto. */
    function checkPlayerInput(index) {
        if (!isPlayerTurn) return;

        playerSequence.push(index);
        flashButton(index); // Faz o botão do jogador piscar

        const currentStep = playerSequence.length - 1;

        // 1. Verifica se o clique está correto na sequência
        if (playerSequence[currentStep] !== sequence[currentStep]) {
            // Erro na sequência
            statusText.textContent = `❌ Reator Explodiu! Você chegou ao Nível ${level}. Clique em INICIAR para tentar novamente.`;
            isPlayerTurn = false;
            level = 1;
            canStartNewGame = true;
            startButton.textContent = "INICIAR";
            startButton.disabled = false;
            return;
        }

        // 2. Verifica se a sequência inteira foi concluída
        if (playerSequence.length === sequence.length) {
            statusText.textContent = "✅ Sequência Correta! Próximo Nível...";
            nextLevel();
        }
        // Se ainda faltam cliques, o jogo continua no 'playerTurn'
    }

    // --- EVENT LISTENERS ---

    // Listener para os cliques nos botões do jogo
    buttons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const index = parseInt(event.target.getAttribute('data-index'));
            checkPlayerInput(index);
        });
    });

    // Listener para o botão de iniciar/reiniciar
    startButton.addEventListener('click', () => {
        if (canStartNewGame) {
            level = 1; // Reinicia o nível
            startButton.textContent = "AGUARDE...";
            canStartNewGame = false;
            generateSequence();
            showSequence();
        }
    });

    // Estado inicial
    statusText.textContent = "Clique em INICIAR para começar o mini-jogo.";
});