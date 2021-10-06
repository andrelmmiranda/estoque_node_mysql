module.exports = server =>{
    const { keys } = require('../../../6-node/password');
    const responseError = require('../utils/responseError');

    const mysql= require('mysql2');

    const connection = mysql.createConnection({
        host: keys.host,
        user: keys.user,
        password: keys.password,
        database: keys.database
    });

    connection.connect((error)=>{
        if(error) console.error('No funfs ' + error);
        return;
    });

    server.get('/', (_, response)=>{
        response.redirect('/cadastrar');
    });

    server.get('/cadastrar', (_, response)=>{
        response.render('pages/formCadastro');
    });

    server.post('/cadastrar', (request, response)=>{
        const { codigo_produto, nome_produto, quantidade_produto } = request.body;
      
        connection.query(`INSERT INTO estoque (codigo_produto, nome_produto, quantidade_produto) VALUES ('${ codigo_produto }', '${ nome_produto }', ${ quantidade_produto })`, (error, _)=>{
            responseError(error, response, 'Erro de cadastro');

            response.render('pages/formCadastro');
        });
    });

    server.get('/listar', (_, response)=>{
        connection.query("SELECT * FROM estoque", (error, produtos)=>{
            responseError(error, response, "Erro ao consultar livros");

            response.render('pages/listaProdutos', { produtos });
        });
    });

    server.get('/deletar:id', (request, response)=>{
        const { id } = request.params;

        connection.query(`DELETE FROM estoque WHERE id_produto = ${ id }`, (error, _)=>{
            responseError(error, response, 'Erro ao deletar produto');

            response.redirect('/listar');
        });
    });

    server.get('/atualizar:id', (request, response)=>{
        const { id } = request.params;

        connection.query(`SELECT * FROM estoque WHERE id_produto = ${ id }`, (error, produto)=>{
            responseError(error, response, "Erro ao consultar produto");

            const [produtoParams] = produto;

            response.render('pages/editarProduto',  produtoParams);
        });
    });

    server.post('/atualizar', (request, response)=>{
        const { codigo_produto, nome_produto, quantidade_produto, id_produto } = request.body;

        console.log(request.body)

        connection.query(`UPDATE estoque SET codigo_produto = ${ codigo_produto }, nome_produto = '${ nome_produto }', quantidade_produto = ${ quantidade_produto } WHERE id_produto=${id_produto}`, (error, _)=>{
            responseError(error, response, "Erro ao atualizar produto");

            response.redirect('/listar');
        });
    });


    server.get('/pesquisar', (request, response)=>{
        const { pesquisar } = request.query;
   
        connection.query(`SELECT * FROM estoque WHERE codigo_produto = ${ pesquisar } OR nome_produto = "${ pesquisar }" OR quantidade_produto = ${ pesquisar }`, (error, produtos)=>{
            responseError(error, response, "Erro ao filtrar produto");

            response.render('pages/listaProdutos', { produtos });
        })
    })
}