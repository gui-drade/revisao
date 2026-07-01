const express = require('express')
const exphbs = require('express-handlebars')
const sequelize = require('./config/bd')
const Estudante = require('./models/estudante')
const methodOverride = require('method-override')
const app = express()

app.use(methodOverride('_method'));

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use(methodOverride('_method'));

app.engine('handlebars',exphbs.engine({defaultLayout: false}))

app.set('view engine', 'handlebars');

async function conectarBD (){
    try {
        await sequelize.authenticate();
        console.log('conexão bem sucedida')

        await sequelize.sync();
        console.log('modelos sincronizados')

        app.listen(3000,() => {
            console.log('servidor rodando na porta 3000')
        })
    }
    catch (erro) {
        console.log('erro ao conectar')
    }

}


conectarBD()

app.get('/', async(req,res) => {
    const todosEstudantes = await Estudante.findAll({raw: true});
    res.render('listarEstudantes', {estudantes: todosEstudantes})

    })


app.get('/estudantes/create', (req,res) => {
    res.render('cadastrarEstudantes')
})

app.post('/estudantes',async (req,res) => {
    const nomeRecebido = req.body.nome;
    const idadeRecebida = req.body.idade;
    await Estudante.create({
        nome: nomeRecebido,
        idade: idadeRecebida
    })

    res.redirect('/')
})

app.delete('/estudantes/:id', async(req,res) => {
    const idRecebido = req.params.id;
    await Estudante.destroy({
        where: {
            id: idRecebido
        }
    })
    res.redirect('/')
})

app.get('/estudantes/:id/edit', async(req,res) => {
    const idRecebido = req.params.id;
    const estudante = await Estudante.findByPk(idRecebido, {raw: true});
    res.render('editarEstudante', {estudante: estudante})
})

app.put('/estudantes/:id', async(req,res) => {
    const nomeRecebido = req.body.nome;
    const idadeRecebida = req.body.idade;
    await Estudante.update({
        nome: nomeRecebido,
        idade:idadeRecebida

    },
{      
    where:{
        id: req.params.id,
    }
})
res.redirect('/')

})
