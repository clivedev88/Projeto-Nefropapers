    // CHAMANDO FUNÇÕES DE LOGIN & CADASTRO

    document.querySelector('#form-Regist').addEventListener('submit', (e) => {
        e.preventDefault();
        const nome = document.querySelector('#name').value.trim();
        const email = document.querySelector('#Email').value.trim();
        const senha = document.querySelector('#senha').value.trim();
        
        if (nome === '' || email === '' || senha === '') {
            alert('Por favor, preencha todos os campos antes de continuar.');
            return;
        }
        
        cadastrarUsuario(nome, email, senha);
    });
    
    document.querySelector('#form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.querySelector('#inputEmail').value.trim();
        const senha = document.querySelector('#inputPass').value.trim();
        
        if (email === '' || senha === '') {
            alert('Por favor, preencha seu e-mail e senha.');
            return;
        }
        
        loginUsuario(email, senha);
        console.log('Dados recebidos da API:', simulados);

    });
    
    
        // PÁGINA "Criar Questão"

    function obterRespostaCorreta() {
        const checkbox = document.querySelector('.question input[type="checkbox"]:checked');
        if (checkbox) {
            // Retorna o valor do checkbox selecionado, convertendo para o formato esperado (ex: 'opcao_a')
            return `opcao_${checkbox.value.toLowerCase()}`;
        }
        return null; // Caso nenhum checkbox esteja selecionado
    }
    
    document.getElementById('searchModulo').addEventListener('keyup', async (e) => {
        const searchTerm = e.target.value.trim();
        const apiKey = localStorage.getItem('apiKey');
    
        if (searchTerm === '') {
            document.getElementById('moduloSugestoes').innerHTML = ''; // Limpa sugestões
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3000/modulos/search?search=${searchTerm}`, {
                headers: {
                    'x-api-key': apiKey,
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) throw new Error('Erro ao buscar módulos.');
    
            const modulos = await response.json();
            const suggestionsContainer = document.getElementById('moduloSugestoes');
            suggestionsContainer.innerHTML = '';
    
            modulos.forEach((modulo) => {
                const li = document.createElement('li');
                li.textContent = modulo.nome;
                li.dataset.id = modulo.id;
                li.addEventListener('click', () => adicionarModulo(modulo));
                suggestionsContainer.appendChild(li);
            });
        } catch (error) {
            console.error(error);
        }
    });
    
    const modulosSelecionados = [];
    

    function adicionarModulo(modulo) {
        if (modulosSelecionados.length >= 3) {
            alert('Você pode selecionar no máximo 3 módulos.');
            return;
        }
    
        if (modulosSelecionados.some((m) => m.id === modulo.id)) {
            alert('Esse módulo já foi selecionado.');
            return;
        }
    
        modulosSelecionados.push(modulo);
    
        const categoriaContainer = document.querySelector('.categoria');
        categoriaContainer.innerHTML = ''; // Limpa categorias fixas (se necessário)
    
        modulosSelecionados.forEach((modulo) => {
            const group = document.createElement('div');
            group.classList.add('group');
            group.innerHTML = `
                <p>${modulo.nome} <span class="remove-modulo" data-id="${modulo.id}"><i class='bx bx-x'></i></span></p>
            `;
            categoriaContainer.appendChild(group);
    
            // Adicionar funcionalidade de remoção
            const removeButton = group.querySelector('.remove-modulo');
            removeButton.addEventListener('click', () => {
                modulosSelecionados.splice(modulosSelecionados.findIndex((m) => m.id === modulo.id), 1);
                group.remove();
            });
        });
    }
    

        // PÁGINAS "Home" & "Todos os testes"
                    
async function initializePage() {
    const apiKey = localStorage.getItem('apiKey');
    if (!apiKey) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const simulados = await carregarTestes(apiKey);
        if (!simulados) {
            console.error('Erro ao carregar os dados dos testes');
            return;
        }

        console.log('Dados recebidos da API:', simulados);

        if (document.querySelector('.userHome')) {
            exibirUltimoTeste(simulados.ultimoTeste, '.homeTests .last-teste'); 
            exibirTodosOsTestes(simulados.testesDisponiveis, '#testes-disponiveis');
            aplicarFuncionalidadeEstrelasECoracoes();
        }

        else if (document.querySelector('.all-tests')) {
            exibirMeusTestes(simulados.meusTestes, '#feitos-por-mim .all-histor');
            exibirTodosOsTestes(simulados.testesDisponiveis, '#todos-os-testes .all-histor');
            aplicarFuncionalidadeEstrelasECoracoes();
        }
    } catch (error) {
        console.error('Erro ao inicializar a página:', error);
    }
}

function exibirUltimoTeste(teste, containerSelector) {
    const containerUltimoTeste = document.querySelector(containerSelector);
    if (!containerUltimoTeste) {
        console.error(`Container não encontrado para o seletor: ${containerSelector}`);
        return;
    }

    if (teste) {
        containerUltimoTeste.innerHTML = `
            <a href="/frontend/frontend 2/testdetails.html?id=${teste.id}" class="last-teste">
                <div class="prime-teste">
                    <h2>${teste.titulo || 'Título não disponível'}</h2>
                    <p>${teste.descricao || 'Descrição não disponível'}</p>
                </div>
                <div class="image-teste">
                    <img src="${teste.imagem_url || 'https://diariodonordeste.verdesmares.com.br/image/contentid/policy:1.3313916:1671446099/concurso-publico.jpg?f=4x3&$p$f=ebf9819'}" alt="Imagem do Teste ${teste.titulo}">
                </div>
            </a>
        `;
    } else {
        containerUltimoTeste.innerHTML = `
            <div class="prime-teste">
                <h2>Nenhum teste recente encontrado</h2>
                <p>Realize um teste para que ele apareça aqui.</p>
            </div>
        `;
    }
}


function exibirMeusTestes(testes, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error(`Container não encontrado para o seletor: ${containerSelector}`);
        return;
    }

    container.innerHTML = ''; // Limpa o container antes de adicionar novos testes

    if (!testes || testes.length === 0) {
        container.innerHTML = '<p>Nenhum teste criado por você no momento.</p>';
        return;
    }

    testes.forEach((teste) => {
        const testeElement = document.createElement('div');
        // testeElement.classList.add('historicos');
        testeElement.classList.add('all-histor');

        testeElement.innerHTML = `
            <div class= "historicos">
                <a href="/frontend/frontend 2/testdetails.html?id=${teste.id}" class="teste-link">
                    <div class="imgCurso">
                        <img src="${teste.imagem_url || 'https://diariodonordeste.verdesmares.com.br/image/contentid/policy:1.3313916:1671446099/concurso-publico.jpg?f=4x3&$p$f=ebf9819'}" alt="Imagem do Teste ${teste.titulo}">
                    </div>
                    <div class="texts">
                        <div class="stars">
                            <h2>${teste.titulo}</h2>
                            ${renderStars(teste.rating || 0)} <!-- Função que renderiza as estrelas -->
                        </div>
                        <div class="porcetagem">
                            <p>${teste.porcentagemAcerto || '0%'} de acerto</p>
                        </div>
                    </div>
                    <div class="iconHeart">
                        <span><i class="fa-solid fa-heart ${teste.favorite ? 'select' : ''}" data-value="${teste.id}"></i></span>
                    </div>
                </a>
            </div>
        `;

        container.appendChild(testeElement); 
    });

    aplicarFuncionalidadeEstrelasECoracoes(); 
}

function exibirTodosOsTestes(testes, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        console.error('Container não encontrado:', containerSelector);
        return;
    }

    container.innerHTML = ''; 

    if (!testes || testes.length === 0) {
        container.innerHTML = '<p>Nenhum teste disponível no momento.</p>';
        return;
    }

    testes.forEach((teste) => {
        const testeElement = document.createElement('div');
        testeElement.classList.add('historicos');
        testeElement.innerHTML = `
            <div class="imgCurso">
                <img src="${teste.imagem_url || 'https://diariodonordeste.verdesmares.com.br/image/contentid/policy:1.3313916:1671446099/concurso-publico.jpg?f=4x3&$p$f=ebf9819'}" alt="Imagem do Teste ${teste.titulo}">
            </div>
            <div class="texts">
                <div class="stars">
                    <a href="/frontend/frontend 2/testdetails.html?id=${teste.id}" class="historicos"><h2>${teste.titulo}</h2></a>
                    ${renderStars(teste.rating || 0)} <!-- Renderiza estrelas -->
                </div>
                <div class="porcetagem">
                    <p>${teste.porcentagemAcerto || '0%'} de acerto</p>
                </div>
            </div>
            <div class="iconHeart">
                <span><i class="fa-solid fa-heart ${teste.favorite ? 'select' : ''}" data-value="${teste.id}"></i></span>
            </div>
        `;
        container.appendChild(testeElement);
    });

    console.log(`Testes exibidos em ${containerSelector}`);
    aplicarFuncionalidadeEstrelasECoracoes();
}

function renderStars(rating = 0) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        starsHTML += `<span><i class="fa-solid fa-star ${i <= rating ? 'select' : ''}" data-value="${i}"></i></span>`;
    }
    return starsHTML;
}

function aplicarFuncionalidadeEstrelasECoracoes() {

    const starsRating = document.querySelectorAll('.fa-star');
    starsRating.forEach((star) => {
        star.addEventListener('click', function () {
            const ratingContainer = this.closest('.stars');
            const starValue = parseInt(this.getAttribute('data-value'), 10);
            ratingContainer.querySelectorAll('.fa-star').forEach((s, index) => {
                s.classList.toggle('select', index < starValue);
            });
            console.log(`Estrelas selecionadas: ${starValue}`);
        });
    });

    const heartRating = document.querySelectorAll('.fa-heart');
    heartRating.forEach((heart) => {
        heart.addEventListener('click', function () {
            const isFavorited = this.classList.contains('select');
            this.classList.toggle('select'); 
            console.log(`Coração clicado. Favorito: ${!isFavorited}`);
        });
    });
}

    // Termina AQUI  
    
function toggleModal() {
    const modal = document.querySelector('.modalCreate');
    if (modal) {
        modal.classList.toggle('active'); 
    } else {
        console.error("Elemento 'modalCreate' não encontrado.");
    }
}
    
    
document.addEventListener('DOMContentLoaded', () => {
    const creationIcon = document.querySelector('.creationIcon');
    if (creationIcon) {
        creationIcon.addEventListener('click', toggleModal);
    }
    initializePage();
});
