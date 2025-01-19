import express from 'express';
import { engine } from 'express-handlebars'; // Alteração na importação
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

// App
const app = express();

// Body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Template
app.engine('handlebars', engine({ defaultLayout: 'principal' })); // Alteração aqui
app.set('view engine', 'handlebars');

// Especificar arquivos estáticos
app.use(express.static(__dirname + '/publico'));

// Rotas
app.get('/', async (req, res) => {
    try {
        const resposta = await fetch('http://localhost:3000/clientes', { method: 'GET' });
        const dados = await resposta.json();
        res.render('inicio', { dados: dados });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar dados.');
    }
});

app.post('/cadastrar', async (req, res) => {
    const nome = req.body.nome;
    const idade = req.body.idade;

    const dados = { 'nome': nome, 'idade': idade };

    try {
        await fetch('http://localhost:3000/clientes', {
            method: 'POST',
            body: JSON.stringify(dados),
            headers: { 'Content-Type': 'application/json' }
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao cadastrar cliente.');
    }
});

app.get('/selecionar/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const resposta = await fetch('http://localhost:3000/clientes/' + id, { method: 'GET' });
        const dados = await resposta.json();
        res.render('selecionar', { dados: dados });
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao buscar cliente.');
    }
});

app.post('/editar', async (req, res) => {
    const nome = req.body.nome;
    const idade = req.body.idade;
    const id = req.body.id;

    try {
        await fetch('http://localhost:3000/clientes/' + id, {
            method: 'PUT',
            body: JSON.stringify({ 'nome': nome, 'idade': idade }),
            headers: { 'Content-Type': 'application/json' }
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao editar cliente.');
    }
});

app.get('/remover/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await fetch('http://localhost:3000/clientes/' + id, { method: 'DELETE' });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao remover cliente.');
    }
});

// Servidor
app.listen(8080, () => {
    console.log('Servidor rodando na porta 8080');
});
