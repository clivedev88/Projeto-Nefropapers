const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.listUsers = async (req, res) => {
    try {
        const { data, error } = await supabase.from('usuarios').select('*'); 
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
};

exports.getHistorico = async (req, res) => {
    const userId = req.user.id;
    try {
        const { data, error } = await supabase
            .from('user_history')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            return res.status(500).json({ error: 'Erro ao buscar histórico do usuário.' });
        }

        res.status(200).json({ historico: data });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
};
