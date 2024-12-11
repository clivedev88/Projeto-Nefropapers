const supabase = require('../supabase');

// async function validateApiKey(req, res, next) {
//     const apiKey = req.headers['x-api-key'];

//     console.log("API Key recebida:", apiKey);

//     if (!apiKey) {
//         console.log("API Key não fornecida");
//         return res.status(401).json({ error: 'API Key não fornecida.' });
//     }

//     try {
//         const { data, error } = await supabase
//             .from('api_keys')
//             .select('*')
//             .eq('api_key', apiKey)
//             .single();

//         if (error || !data) {
//             console.log("Erro ou chave inválida:", error);
//             return res.status(403).json({ error: 'API Key inválida ou inexistente.' });
//         }

//         console.log("API Key válida, associada ao usuário:", data.user_id);
//         req.user = { id: data.user_id };
//         next();
//     } catch (err) {
//         console.log("Erro interno ao validar API Key:", err.message);
//         return res.status(500).json({ error: 'Erro interno ao validar API Key.' });
//     }
// }


async function validateApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ error: 'API Key não fornecida.' });
    }

    try {
        const { data, error } = await supabase
            .from('api_keys')
            .select('*')
            .eq('api_key', apiKey)
            .single();

        if (error || !data) {
            return res.status(403).json({ error: 'API Key inválida ou inexistente.' });
        }

        if (process.env.NODE_ENV === 'development') {
            console.log("API Key válida, associada ao usuário:", data.user_id);
        }

        req.user = { id: data.user_id };
        next();
    } catch (err) {
        return res.status(500).json({ error: 'Erro interno ao validar API Key.' });
    }
}


module.exports = { validateApiKey };
