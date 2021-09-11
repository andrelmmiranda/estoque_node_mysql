module.exports = server =>{
    const mongoose = require('mongoose');
    const dbAccess = require('../utils/dbAccess');
    const { readFileSync } = require('fs');
    const responseError = require('../utils/responseError');

    mongoose.connect(dbAccess(readFileSync('../access-mongodb.txt', { encoding:'utf8', flag:'r' }), 'biblioteca'), { useNewUrlParser: true, useUnifiedTopology: true });

    const Livros = mongoose.model('livros', {
        titulo: String,
        autor: String,
    });

    server.get('/', (_, response)=>{
        response.redirect('/cadastrar');
    });

    server.get('/cadastrar', (_, response)=>{
        response.render('formCadastro');
    })

    server.post('/cadastrar', (request, response)=>{
        const livro = new Livros();

        livro.titulo = request.body.titulo;
        livro.autor = request.body.autor;

        livro.save(error =>{
            responseError(error, response, 'Erro de cadastro');

            response.render('formCadastro');
        })
    });

    server.get('/listar', (_, response)=>{
        Livros.find({}, (error, livros) => {
            responseError(error, response, "Erro ao consultar livros");
            
            response.render('listaLivros', { livros });
        });
    })

    server.get('/deletar:id', (request, response)=>{
        Livros.deleteOne({_id: request.params.id}, (error, response)=>{
            responseError(error, response, 'Erro ao deletar livro');
        });

        response.redirect('/listar');
    });

    server.get('/deletar:id', (request, response)=>{
        Livros.deleteOne({_id: request.params.id}, (error, response)=>{
            responseError(error, response, 'Erro ao deletar livro');
        });

        response.redirect('/listar');
    });

    server.get('/atualizar:id', (request, response)=>{
        Livros.findById(request.params.id, (error, livro)=> {
            responseError(error, response, "Erro ao consultar livro");
    
            response.render('editarLivro', { livro });
        });
    });

    server.post('/atualizar', (request, response)=>{
        Livros.findById(request.body.id, (error, livro)=>{
            responseError(error, response, "Erro ao atualizar livro");

            livro.titulo = request.body.titulo
            livro.autor = request.body.autor

            livro.save(error =>{
                responseError(error, response, "Erro ao atualizar livro");
        
                return response.redirect('/listar');
            });

        });
    });

    server.get("/pesquisar",(request,response)=>{
        const busca = request.query.pesquisar;
        Livros.find({$or:[{titulo:busca},{autor:busca}]},(error, livros)=>{
            responseError(error, response, "erro ao pesquisar");
            response.render("listaLivros", { livros });
        })
    });
}