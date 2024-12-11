const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.listTests = async (req, res) => {
    const userId = req.user.id;

    try {
        const { data: meusTestes, error: errorMeusTestes } = await supabase
            .from('testes')
            .select('*')
            .eq('criado_por', userId)
            .order('criado_em', { ascending: false });

        if (errorMeusTestes) {
            console.error('Erro ao buscar testes do usuário:', errorMeusTestes);
            throw errorMeusTestes;
        }

        const { data: testesDisponiveis, error: errorTestesDisponiveis } = await supabase
            .from('testes')
            .select('*')
            .neq('criado_por', userId)
            .order('criado_em', { ascending: false });

        if (errorTestesDisponiveis) {
            console.error('Erro ao buscar testes disponíveis:', errorTestesDisponiveis);
            throw errorTestesDisponiveis;
        }

        const ultimoTeste = meusTestes.length > 0 ? meusTestes[0] : null;

        res.status(200).json({
            ultimoTeste,
            meusTestes: meusTestes.slice(1), // Exclui o último da lista de "meus testes"
            testesDisponiveis,
        });
    } catch (err) {
        console.error('Erro interno ao listar testes:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor.', detalhes: err.message });
    }
};

exports.createTest = async (req, res) => {
    const { titulo, descricao } = req.body;
    const criado_por = req.user.id;

    if (!titulo || !descricao) {
        return res.status(400).json({ error: 'Título e descrição são obrigatórios.' });
    }

    try {
        // Insere o teste na tabela `testes`
        const { data, error } = await supabase
            .from('testes')
            .insert([{ titulo, descricao, criado_por }])
            .select();

        if (error) {
            console.error('Erro ao criar teste:', error);
            return res.status(500).json({ error: 'Erro ao criar teste.', detalhes: error.message });
        }

        res.status(201).json(data[0]); // Retorna o teste criado
    } catch (err) {
        console.error('Erro interno ao criar teste:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor.', detalhes: err.message });
    }
};

exports.searchModules = async (req, res) => {
    const { search } = req.query;

    if (!search) {
        return res.status(400).json({ error: 'O parâmetro de busca é obrigatório.' });
    }

    try {
        const { data, error } = await supabase
            .from('modulos')
            .select('id, name')
            .ilike('name', `%${search}%`)
            .limit(10);

        if (error) {
            console.error('Erro ao buscar módulos:', error);
            return res.status(500).json({ error: 'Erro ao buscar módulos.', details: error });
        }

        res.status(200).json(data);
    } catch (err) {
        console.error('Erro interno ao buscar módulos:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor.', details: err.message });
    }
};

exports.addQuestionsToTest = async (req, res) => {
    const { testId } = req.params;
    const { questoes } = req.body;

    // Valida se as questões foram enviadas
    if (!questoes || !Array.isArray(questoes) || questoes.length === 0) {
        return res.status(400).json({ error: 'Nenhuma questão fornecida.' });
    }

    try {
        // Verifica se todas as questões existem na tabela de questões
        const { data: questoesExistentes, error: errorQuestoesExistentes } = await supabase
            .from('questoes')
            .select('id')
            .in('id', questoes); // Busca todas as questões com os IDs fornecidos

        if (errorQuestoesExistentes) {
            console.error('Erro ao verificar questões existentes:', errorQuestoesExistentes);
            return res.status(500).json({ error: 'Erro ao verificar questões existentes.', detalhes: errorQuestoesExistentes.message });
        }

        // Se a quantidade de questões encontradas não for igual ao número de questões enviadas
        if (questoesExistentes.length !== questoes.length) {
            return res.status(400).json({ error: 'Algumas questões fornecidas não existem.' });
        }

        // Busca questões já existentes no teste para evitar duplicações
        const { data: existentes, error: errorExistentes } = await supabase
            .from('test_questoes')
            .select('id_questao')
            .eq('id_test', testId);

        if (errorExistentes) {
            console.error('Erro ao verificar questões existentes no teste:', errorExistentes);
            throw errorExistentes;
        }

        // Filtra as novas questões que ainda não estão no teste
        const existentesIds = existentes.map((e) => e.id_questao);
        const novasQuestoes = questoes.filter((questaoId) => !existentesIds.includes(questaoId));

        // Insere as novas questões no teste
        const { error: errorInsercao } = await supabase
            .from('test_questoes')
            .insert(
                novasQuestoes.map((questaoId) => ({
                    id_test: testId,
                    id_questao: questaoId,
                }))
            );

        if (errorInsercao) {
            console.error('Erro ao inserir questões no teste:', errorInsercao);
            throw errorInsercao;
        }

        res.status(200).json({ message: 'Questões adicionadas com sucesso!' });
    } catch (err) {
        console.error('Erro interno ao adicionar questões ao teste:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor.', detalhes: err.message });
    }
};


exports.addRandomQuestionsToSimulation = async (req, res) => {
    const { simuladoId } = req.params;
    const { quantidade, idModulo } = req.body;

    if (!quantidade || !idModulo) {
        return res.status(400).json({ error: 'Quantidade e ID do módulo são obrigatórios.' });
    }

    try {
        const { data: questoes, error: errorQuestoes } = await supabase
            .from('questoes')
            .select('id, pergunta')
            .eq('id_modulo', idModulo)
            .order('criado_em', { ascending: false })
            .limit(quantidade);

        if (errorQuestoes) {
            console.error('Erro ao buscar questões aleatórias:', errorQuestoes);
            throw errorQuestoes;
        }

        if (questoes.length === 0) {
            return res.status(404).json({ error: 'Nenhuma questão encontrada para o módulo.' });
        }

        const { error: errorInsercao } = await supabase
            .from('simulado_questoes')
            .insert(questoes.map(questao => ({
                id_test: simuladoId,
                id_questao: questao.id,
            })));

        if (errorInsercao) {
            console.error('Erro ao inserir questões no simulado:', errorInsercao);
            throw errorInsercao;
        }

        res.status(200).json({ message: 'Questões adicionadas com sucesso!', questoes });
    } catch (err) {
        console.error('Erro interno ao adicionar questões ao simulado:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor.', detalhes: err.message });
    }
};

exports.getTestDetails = async (req, res) => {
    const { testId } = req.params; // ID do teste passado na URL
    const userId = req.user.id; // ID do usuário autenticado

    try {
        // Obtém os detalhes do teste
        const { data: teste, error: testeError } = await supabase
            .from('testes') // Tabela 'testes'
            .select('*')
            .eq('id', testId)
            .single();

        if (testeError || !teste) {
            console.error('Erro ao buscar detalhes do teste:', testeError);
            throw testeError || new Error('Teste não encontrado.');
        }

        // Obtém o nome do criador do teste
        const { data: criador, error: criadorError } = await supabase
            .from('usuarios') // Tabela 'usuarios'
            .select('nome')
            .eq('id', teste.criado_por)
            .single();

        if (criadorError) {
            console.error('Erro ao buscar criador do teste:', criadorError);
            throw criadorError;
        }

        // Obtém as questões relacionadas ao teste
        const { data: questoes, error: questoesError } = await supabase
            .from('test_questoes') // Tabela 'test_questoes'
            .select('id_questao')
            .eq('id_test', testId);

        if (questoesError) {
            console.error('Erro ao buscar questões do teste:', questoesError);
            throw questoesError;
        }

        const questaoIds = questoes.map(q => q.id_questao);

        // Obtém os módulos relacionados às questões na tabela questao_modulo
        const { data: questaoModulos, error: questaoModulosError } = await supabase
            .from('questao_modulo') // Tabela 'questao_modulo'
            .select('modulo_id, questao_id')
            .in('questao_id', questaoIds);

        if (questaoModulosError) {
            console.error('Erro ao buscar módulos das questões:', questaoModulosError);
            throw questaoModulosError;
        }

        // Filtra os IDs únicos dos módulos relacionados às questões
        const moduloIds = [...new Set(questaoModulos.map(qm => qm.modulo_id))];

        // Busca os nomes dos módulos usando os IDs coletados
        const { data: modulos, error: modulosError } = await supabase
            .from('modulos') // Tabela 'modulos'
            .select('id, nome')
            .in('id', moduloIds);

        if (modulosError) {
            console.error('Erro ao buscar nomes dos módulos:', modulosError);
            throw modulosError;
        }

        // Monta a resposta com os dados necessários
        res.status(200).json({
            titulo: teste.titulo,
            descricao: teste.descricao,
            rating: teste.rating || 0,
            porcentagemAcerto: teste.porcentagem_acerto || '0%',
            totalResolucoes: 0, // Simulação de total de resoluções
            minhaMaiorPontuacao: 0, // Simulação de pontuação do usuário
            maiorPontuacao: 0, // Simulação de maior pontuação geral
            criador: criador.nome || 'Desconhecido', // Nome do criador
            modulos: modulos.map(modulo => modulo.nome), // Lista de nomes dos módulos relacionados
            totalQuestoes: questoes.length, // Total de questões relacionadas
            questoes: questoes, // IDs das questões relacionadas
        });
    } catch (err) {
        console.error('Erro ao buscar detalhes do teste:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor.', detalhes: err.message });
    }
};




exports.updateTest = async (req, res) => {
    const { testId } = req.params;
    const { titulo, descricao } = req.body;

    if (!titulo || !descricao) {
        return res.status(400).json({ error: 'Título e descrição são obrigatórios.' });
    }

    try {
        const { data, error } = await supabase
            .from('testes')
            .update({ titulo, descricao })
            .eq('id', testId)
            .select();

        if (error) {
            console.error('Erro ao atualizar teste:', error);
            throw error;
        }

        res.status(200).json(data);
    } catch (err) {
        console.error('Erro interno ao atualizar teste:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor.', detalhes: err.message });
    }
};

exports.deleteTest = async (req, res) => {
    const { testId } = req.params;

    try {
        const { error } = await supabase
            .from('testes')
            .delete()
            .eq('id', testId);

        if (error) {
            console.error('Erro ao excluir teste:', error);
            throw error;
        }

        res.status(200).json({ message: 'Teste excluído com sucesso.' });
    } catch (err) {
        console.error('Erro interno ao excluir teste:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor.', detalhes: err.message });
    }
};





exports.finalizeTest = async (req, res) => {
    try {
        const { testId } = req.params;

        console.log('Tentando finalizar o teste com ID:', testId);


        const { data, error } = await supabase
            .from('testes')  
            .update({ status: 'finalizado' })  
            .eq('id', testId)  
            .select('status');  


            if (error) {
            console.error('Erro ao atualizar o status do teste:', error);
            return res.status(500).json({ message: 'Erro ao finalizar o teste.', error: error.message });
        }

        console.log('Dados retornados após a atualização:', data);


        if (!data.length) {
            console.error('Teste não encontrado com o ID:', testId);
            return res.status(404).json({ message: 'Teste não encontrado.' });
        }



        if (data[0].status !== 'finalizado') {
            console.error('Falha ao atualizar o status do teste para "finalizado". Status atual:', data[0].status);
            return res.status(500).json({ message: 'Erro ao atualizar o status do teste para "finalizado".' });
        }

        console.log('Teste finalizado com sucesso. Status do teste:', data[0].status);


        res.status(200).json({ message: 'Teste finalizado com sucesso.' });
    } catch (error) {

        console.error('Erro inesperado:', error);
        res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
    }
};
