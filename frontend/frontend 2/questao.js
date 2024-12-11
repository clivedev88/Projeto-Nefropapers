const answerButtons = document.querySelectorAll('.option-button');

answerButtons.forEach(button => {
    button.addEventListener('click', () => {
        answerButtons.forEach(btn => btn.parentElement.classList.remove('selected'));

        button.parentElement.classList.add('selected');
    });
});

const imageButton = document.querySelector('.image-button');
const warningIcon = document.querySelector('.warning-icon');
const questionButton = document.querySelector('.question-button'); 
const popupImage = document.getElementById('popup-image');
const popupForm = document.getElementById('popup-form');
const popupGabarito = document.getElementById('popup-gabarito'); 

// Função para mostrar o pop-up de imagem
imageButton.addEventListener('click', () => {
    popupImage.style.display = 'flex'; 
});

// Função para mostrar o pop-up de reportar
warningIcon.addEventListener('click', () => {
    popupForm.style.display = 'flex'; 
});

// Função para mostrar o pop-up de gabarito 
questionButton.addEventListener('click', () => {
    popupGabarito.style.display = 'flex'; 
});

popupImage.addEventListener('click', (e) => {
    if (e.target === popupImage) {
        popupImage.style.display = 'none'; 
    }
});

popupForm.addEventListener('click', (e) => {
    if (e.target === popupForm) {
        popupForm.style.display = 'none'; 
    }
});

popupGabarito.addEventListener('click', (e) => {
    if (e.target === popupGabarito) {
        popupGabarito.style.display = 'none'; 
    }
});

// Responder a questão
const submitButton = document.querySelector('.submit-button');
let selectedAnswer = null;
const correctAnswer = 'B';

// Desativa o botão de questão inicialmente
questionButton.disabled = true;
questionButton.style.backgroundColor = '#F5F5F5'; 
questionButton.style.color = '#858585';

// // Função para selecionar resposta
// answerButtons.forEach(button => {
//     button.addEventListener('click', () => {
//         // Permite selecionar apenas se o botão "Responder" ainda não foi pressionado
//         if (!submitButton.disabled) {
//             // Remove a classe 'selected' de todos os botões e aplica à opção selecionada
//             answerButtons.forEach(btn => btn.classList.remove('selected'));
//             button.classList.add('selected');
//             selectedAnswer = button.textContent.trim(); // captura a letra da resposta selecionada

//             // Ativa o botão "Responder"
//             submitButton.style.backgroundColor = '#FF9600'; 
//             submitButton.style.color = '#ffffff';
//             submitButton.disabled = false;
//         }
//     });
// });

// // Função para validar a resposta
// submitButton.addEventListener('click', () => {
//     if (!selectedAnswer) return; // não faz nada se nenhuma resposta foi selecionada
    
//     // Desativa o botão "Responder" e muda a cor para cinza
//     submitButton.style.backgroundColor = '#F5F5F5'; 
//     submitButton.style.color = '#858585';
//     submitButton.disabled = true;
    
//     // Valida a resposta e altera as cores
//     answerButtons.forEach(button => {
//         const answer = button.textContent.trim();
//         if (answer === correctAnswer) {
//             button.style.backgroundColor = '#00C851';
//             button.style.color = '#ffffff';
//             button.style.border = '#00C851';
//         } else if (answer === selectedAnswer) {
//             button.style.backgroundColor = '#FF4444'; 
//             button.style.color = '#ffffff';
//             button.style.border = '#FF4444';
//         }
//         // Desabilita todos os botões de resposta após a submissão
//         button.disabled = true;
//         button.style.cursor = 'not-allowed'; // Alterar o cursor para indicar que está desabilitado
//     });
    
//     // Ativa o botão "?" e altera a cor
//     questionButton.style.backgroundColor = '#FF9600'; 
//     questionButton.style.color = '#ffffff';
//     questionButton.disabled = false;
// });


//  ------------------------------ INTEGRAÇÃO -------------------------------------

    let questoes = [];
    let questaoAtualIndex = 0;
    const apiKey = localStorage.getItem('apiKey');
    const urlParams = new URLSearchParams(window.location.search);
    const simuladoId = urlParams.get('id');

    // DADOS DOS TESTES
    document.addEventListener('DOMContentLoaded', async () => {
        if (!apiKey || !simuladoId) {
            alert('Você precisa estar logado e selecionar um teste.');
            window.location.href = '/frontend/index.html';
            return;
        }

        try {
            const testeResponse = await fetch(`http://localhost:3000/simulados/${simuladoId}/detalhes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                },
            });

            if (!testeResponse.ok) {
                throw new Error('Erro ao buscar os detalhes do teste.');
            }

            const teste = await testeResponse.json();
            console.log('Teste carregado:', teste);

            document.querySelector('header h1').textContent = teste.titulo;

            questoes = teste.questoes;
            if (questoes.length > 0) {
                carregarQuestao(questoes[questaoAtualIndex].id_questao);
                configurarBotaoResponder();
            } else {
                alert('Nenhuma questão disponível para este teste.');
            }
        } catch (error) {
            console.error('Erro ao carregar os dados do teste:', error);
        }
    });

    // DADOS DAS QUESTÕES
    async function carregarQuestao(questaoId) {
        try {
            const questaoResponse = await fetch(`http://localhost:3000/questoes/${questaoId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                },
            });

            if (!questaoResponse.ok) {
                throw new Error('Erro ao buscar os dados da questão.');
            }

            const questao = await questaoResponse.json();
            console.log('Dados da questão:', questao);

            document.querySelector('.question-body p').textContent = questao.pergunta;

            const alternativas = [questao.opcao_a, questao.opcao_b, questao.opcao_c, questao.opcao_d, questao.opcao_e];
            const answersContainer = document.querySelector('.answers');
            answersContainer.innerHTML = '';

            alternativas.forEach((alternativa, index) => {
                const alternativaElement = document.createElement('div');
                alternativaElement.classList.add('answer');
                alternativaElement.innerHTML = `
                    <button class="option-button" data-option="${String.fromCharCode(65 + index)}">${String.fromCharCode(65 + index)}</button>
                    <p>${alternativa}</p>
                `;
                answersContainer.appendChild(alternativaElement);
            });

            configurarSelecaoResposta();
        } catch (error) {
            console.error('Erro ao carregar a questão:', error);
        }
    }

    // SELEÇÃO DE RESPOSTA
    function configurarSelecaoResposta() {
        const answerButtons = document.querySelectorAll('.option-button');
        const submitButton = document.querySelector('.submit-button');

        submitButton.disabled = true;

        answerButtons.forEach(button => {
            button.addEventListener('click', () => {
                answerButtons.forEach(btn => btn.parentElement.classList.remove('selected'));
                button.parentElement.classList.add('selected');
                submitButton.disabled = false;
            });
        });
    }

    // SALVAR RESPOSTA
    async function salvarResposta(questaoId, respostaSelecionada) {
        try {
            const response = await fetch('http://localhost:3000/questoes/respostas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                },
                body: JSON.stringify({
                    questao_id: questaoId,
                    resposta: respostaSelecionada,
                }),
            });

            if (!response.ok) {
                throw new Error('Erro ao salvar a resposta.');
            }

            console.log('Resposta salva com sucesso.');
        } catch (error) {
            console.error('Erro ao salvar a resposta:', error);
            alert('Erro ao salvar a resposta. Tente novamente.');
        }
    }

    // CONFIGURAR BOTÃO DE RESPOSTA
    function configurarBotaoResponder() {
        const submitButton = document.querySelector('.submit-button');
        submitButton.addEventListener('click', async () => {
            try {
                const respostaSelecionada = document.querySelector('.answers .selected button')?.getAttribute('data-option');

                if (!respostaSelecionada) {
                    alert('Por favor, selecione uma resposta antes de prosseguir.');
                    return;
                }

                const idQuestao = questoes[questaoAtualIndex]?.id_questao;
                await salvarResposta(idQuestao, respostaSelecionada);

                exibirResultado(respostaSelecionada);
            } catch (error) {
                console.error('Erro ao salvar a resposta ou carregar a próxima questão:', error);
            }
        });
    }

    // EXIBIR RESULTADO DA RESPOSTA
    // function exibirResultado(respostaSelecionada) {
    //     const questao = questoes[questaoAtualIndex];
    //     const respostaCorreta = questao.resposta_correta;
    //     const answerButtons = document.querySelectorAll('.option-button');

    //     answerButtons.forEach(button => {
    //         const letra = button.getAttribute('data-option');
    //         if (letra === respostaCorreta) {
    //             button.parentElement.classList.add('correct');
    //         } else if (letra === respostaSelecionada) {
    //             button.parentElement.classList.add('incorrect');
    //         }
    //     });

    //     setTimeout(() => carregarProximaQuestao(), 2000);
    // }

    function exibirResultado(respostaSelecionada) {
        const questao = questoes[questaoAtualIndex];
        const respostaCorreta = questao.resposta_correta;
        const answerButtons = document.querySelectorAll('.option-button');
      
        // Marcar as alternativas como corretas ou incorretas
        answerButtons.forEach(button => {
          const letra = button.getAttribute('data-option');
          if (letra === respostaCorreta) {
            button.parentElement.classList.add('correct');
          } else if (letra === respostaSelecionada) {
            button.parentElement.classList.add('incorrect');
          }
        });
      
        // Verificar se é a última questão
        if (questaoAtualIndex === questoes.length - 1) {
          // É a última questão, finalizar o teste
          console.log("É a última questão, finalizando o teste"); // Para debugar
          finalizarTeste();
        } else {
          // Não é a última questão, carregar a próxima
          setTimeout(() => carregarProximaQuestao(), 2000);
        }
      }

    // CARREGAR PRÓXIMA QUESTÃO
    function carregarProximaQuestao() {
        if (questaoAtualIndex < questoes.length - 1) {
            questaoAtualIndex++;
            carregarQuestao(questoes[questaoAtualIndex]?.id_questao);
        } else {
            finalizarTeste();
        }
    }

    // FINALIZAR TESTE
    async function finalizarTeste() {
        const apiKey = localStorage.getItem('apiKey');
        const simuladoId = new URLSearchParams(window.location.search).get('id'); 
    
        if (!apiKey || !simuladoId) {
            alert('Você precisa estar logado e selecionar um teste.');
            return;
        }
    
        try {
            
            const response = await fetch(`http://localhost:3000/simulados/${simuladoId}/finalizar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey, 
                },
            });
    
            
            if (!response.ok) {
                throw new Error('Erro ao finalizar o teste.');
            }
    
            
            const result = await response.json();
            alert(result.message || 'Teste finalizado com sucesso!');
    
            
            window.location.href = `/frontend/frontend%202/testdetails.html?id=${simuladoId}`;
    
        } catch (error) {
            
            console.error('Erro ao finalizar o teste:', error);
            alert('Não foi possível finalizar o teste. Tente novamente.');
        }
    }
    