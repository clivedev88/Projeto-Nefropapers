document.addEventListener("DOMContentLoaded", function() {

    async function fetchQuestions() {
        const apiKey = localStorage.getItem("apiKey");

        try {
            const response = await fetch("http://localhost:3000/questoes/todas", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey
                }
            });

            if (response.ok) {
                const questions = await response.json();
                console.log("Questões carregadas:", questions);
                displayQuestions(questions);
            } else {
                console.error("Erro ao buscar questões");
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
        }
    }

    function displayQuestions(questions) {
        const questionListContainer = document.querySelector(".question-list");
        questionListContainer.innerHTML = "";

        questions.forEach(question => {
            const truncatedText = question.pergunta ? question.pergunta.slice(0, 10) + "..." : "Pergunta não disponível";
            const questionItem = document.createElement("div");
            questionItem.classList.add("question-item");

            questionItem.innerHTML = `
                <div class="question-data">
                    <input type="checkbox" class="question-checkbox" data-question-id="${question.id}">
                    <div class="question-info">
                        <h3>${truncatedText}</h3>
                        <p>${question.percent_acerto || 0}% de acerto</p>
                    </div>
                    <div class="rating">
                        ${generateStars(question.rating || 0)}
                    </div>
                    <div class="arrow" onclick="toggleExpand(this)">
                        <i class="material-icons" id="arrow-icon">keyboard_arrow_down</i>
                    </div>
                </div>
                <div class="expanded-content">
                    <div class="expanded-text">
                        ${question.pergunta || "Detalhes não disponíveis"}
                    </div>
                </div>
            `;

            questionListContainer.appendChild(questionItem);
        });

        console.log("Questões exibidas na interface");
    }

    function generateStars(rating) {
        let stars = "";
        for (let i = 0; i < 5; i++) {
            stars += i < rating 
                ? `<i class="material-icons" id="star-icon">star</i>`
                : `<i class="material-icons" id="star-icon-none">star</i>`;
        }
        return stars;
    }

    fetchQuestions();

    document.querySelector(".save-button").addEventListener("click", async function() {
        console.log("Botão Salvar clicado");

        const apiKey = localStorage.getItem("apiKey");
        const titulo = document.getElementById("nome-teste").innerText.trim();
        const descricao = document.getElementById("descricao-teste").value.trim();

        if (!titulo || !descricao) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        try {
            const testeId = await createTest(apiKey, titulo, descricao);

            if (testeId) {

                const selectedQuestions = getSelectedQuestions();
                if (selectedQuestions.length > 0) {
                    await addQuestionsToTest(testeId, selectedQuestions);
                } else {
                    alert("Por favor, selecione pelo menos uma questão para adicionar ao teste.");
                }
            }
        } catch (error) {
            console.error("Erro ao processar a criação do teste e a adição de questões:", error);
        }
    });


    async function createTest(apiKey, titulo, descricao) {
        try {
            const payload = { titulo, descricao };
            const response = await fetch("http://localhost:3000/simulados", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const data = await response.json();
                const testeId = data[0]?.id || data.id;
                console.log("Teste criado com sucesso, ID:", testeId);
                alert("Teste criado com sucesso!");
                
                return testeId;
            } else {
                const errorData = await response.json();
                console.error("Erro ao criar teste:", errorData.error);
                alert("Erro ao criar teste: " + errorData.error);
                return null;
            }
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            alert("Erro ao conectar com o servidor. Verifique sua conexão.");
            return null;
        }
    }

    function getSelectedQuestions() {
        const selectedQuestions = [];
        document.querySelectorAll(".question-checkbox:checked").forEach(checkbox => {
            selectedQuestions.push(checkbox.getAttribute("data-question-id"));
        });
        return selectedQuestions;
    }


    async function addQuestionsToTest(testeId, selectedQuestions) {
        const apiKey = localStorage.getItem("apiKey");
        const payloadQuestions = { questoes: selectedQuestions };
    
        console.log("Enviando payload para adicionar questões:", JSON.stringify(payloadQuestions));
    
        try {
            const response = await fetch(`http://localhost:3000/simulados/${testeId}/questoes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey,
                },
                body: JSON.stringify(payloadQuestions),
            });
    
            // Verificando a resposta
            console.log("Resposta da requisição:", response);
    
            // Verificando se a resposta foi bem-sucedida
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Erro ao adicionar questões ao teste:", errorData);
                alert("Erro ao adicionar questões ao teste: " + errorData.error);
                return;
            }
    
            // Caso as questões sejam adicionadas com sucesso
            const data = await response.json();
            console.log("Questões adicionadas ao teste com sucesso", data);
    
            alert("Questões adicionadas ao teste com sucesso!");
    
            // Tentar redirecionar para a seção 'userHome'
            // const userHomeSection = document.querySelector('.userHome');
            // if (userHomeSection) {
            //     console.log('Redirecionando para a userHome...');
            //     document.getElementById('inputScreen').style.display = 'none';
            //     document.querySelector('.container').style.display = 'none';
            //     document.querySelector('.userHome').style.display = 'flex';     
            //     document.querySelector('.container').style.display = 'none';  // Oculta a seção atual
            //     userHomeSection.style.display = 'flex';  // Exibe a seção 'userHome'
            // } else {
            //     console.error('Elemento ".userHome" não encontrado.');
            // }
    
            document.addEventListener('DOMContentLoaded', () => {
                const userHomeSection = document.querySelector('.userHome');
                if (userHomeSection) {
                    console.log('Redirecionando para a userHome...');
                    window.location.href = 'index.html';
                    document.querySelector('.container').style.display = 'none';  // Oculta a seção atual
                    userHomeSection.style.display = 'flex';  // Exibe a seção 'userHome'
                } else {
                    console.error('Elemento ".userHome" não encontrado.');
                }
            });

            // Desmarcar as questões selecionadas
            document.querySelectorAll(".question-checkbox:checked").forEach(checkbox => {
                checkbox.checked = false;
            });
    
        } catch (error) {
            console.error("Erro ao conectar com o servidor:", error);
            alert("Erro ao conectar com o servidor. Verifique sua conexão.");
        }
    }
            
document.getElementById("search-input").addEventListener("input", function() {
        const searchValue = this.value.toLowerCase();
        const questions = document.querySelectorAll(".question-item");

        questions.forEach(function(question) {
            const questionText = question.querySelector('h3').textContent.toLowerCase();
            question.style.display = questionText.includes(searchValue) ? 'block' : 'none';
        });
    });
});


// ------------------------------------------------------- INTEGRAÇÃO ---------------------------------------------------------


// NAVEGAÇÃO
function configurarNavegacao(questoes, apiKey) {
    let questaoAtualIndex = 0;

    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');

    prevButton.addEventListener('click', () => {
        if (questaoAtualIndex > 0) {
            questaoAtualIndex--;
            carregarQuestao(questoes[questaoAtualIndex].id_questao, apiKey);
        }
    });

    nextButton.addEventListener('click', () => {
        if (questaoAtualIndex < questoes.length - 1) {
            questaoAtualIndex++;
            carregarQuestao(questoes[questaoAtualIndex].id_questao, apiKey);
        } else {
            finalizarTeste();
        }
    });
}

// ENVIO DA RESPOSTA
function configurarSelecaoResposta() {
    const answerButtons = document.querySelectorAll('.option-button');

    answerButtons.forEach(button => {
        button.addEventListener('click', () => {
            answerButtons.forEach(btn => btn.parentElement.classList.remove('selected'));
            button.parentElement.classList.add('selected');
        });
    });

    const submitButton = document.querySelector('.submit-button');
    submitButton.addEventListener('click', () => {
        const respostaSelecionada = document.querySelector('.answers .selected button').textContent.trim();
        salvarResposta(respostaSelecionada);
    });
}

async function salvarResposta(respostaSelecionada) {
    const apiKey = localStorage.getItem('apiKey');
    const questaoId = document.querySelector('.question-body').getAttribute('data-id');

    try {
        const response = await fetch(`http://localhost:3000/respostas`, {
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
    }
}


// FINALIZANDO O TESTE
function finalizarTeste() {
    if (confirm('Você deseja finalizar o teste?')) {
        window.location.href = `http://127.0.0.1:5500/frontend/frontend%202/resultados.html`;
    }
}
