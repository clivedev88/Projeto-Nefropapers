document.addEventListener('DOMContentLoaded', async () => {
    const apiKey = localStorage.getItem('apiKey');
    const urlParams = new URLSearchParams(window.location.search);
    const simuladoId = urlParams.get('id'); 

    if (!apiKey || !simuladoId) {
        console.error('API Key ou ID do teste não fornecido.');
        window.location.href = '/login.html'; 
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/simulados/${simuladoId}/detalhes`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
            },
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar os detalhes do teste.');
        }

        const teste = await response.json();
        console.log('Detalhes do teste recebidos:', teste);

        document.querySelector('header h1').textContent = teste.titulo || 'Título não disponível';
        document.querySelector('header p').textContent = `${teste.porcentagemAcerto || '0%'} de acerto`;

        const ratingContainer = document.querySelector('.rating');
        ratingContainer.innerHTML = ''; 
        for (let i = 1; i <= 5; i++) {
            const starIcon = document.createElement('i');
            starIcon.className = 'material-icons';
            starIcon.textContent = i <= teste.rating ? 'star' : 'star_border';
            ratingContainer.appendChild(starIcon);
        }

        document.querySelector('.creator-info p').innerHTML = `<strong>Criado por:</strong> ${teste.criador || 'Desconhecido'}`;

        if (teste.modulos && teste.modulos.length > 0) {
            const modulosNomes = teste.modulos.join(', ');
            document.querySelector('.topics p').textContent = modulosNomes || 'Nenhum tópico encontrado.';
        } else {
            document.querySelector('.topics p').textContent = 'Nenhum tópico encontrado.';
        }

        const performanceItens = document.querySelectorAll('.performance-itens .performance-item h3');
        if (performanceItens.length === 4) {
            performanceItens[0].textContent = `${teste.porcentagemAcerto || '0%'}`;
            performanceItens[1].textContent = `${teste.totalResolucoes || 0} tentativas`;
            performanceItens[2].textContent = `${teste.minhaMaiorPontuacao || 0} Questões`;
            performanceItens[3].textContent = `${teste.maiorPontuacao || 0} Questões`;
        }

    } catch (error) {
        console.error('Erro ao carregar os detalhes do teste:', error);
        alert('Erro ao carregar os detalhes do teste. Tente novamente mais tarde.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.querySelector('.back-button .back-arrow');
    if (backButton) {
        backButton.addEventListener('click', () => {

            document.getElementById('inputScreen').style.display = 'none';
            document.querySelector('.container').style.display = 'none';
            document.querySelector('.userHome').style.display = 'flex';
        });
        // REDIRECIONAMENTO A SER CORRIGIDO
    }

    
    const startButton = document.querySelector('.start-button');
    if (startButton) {
        startButton.addEventListener('click', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const simuladoId = urlParams.get('id');
            if (simuladoId) {
                window.location.href = `questao.html?id=${simuladoId}`;
            } else {
                alert('Erro: ID do teste não encontrado.');
            }
        });
    }

});
