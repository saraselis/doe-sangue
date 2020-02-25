const express = require("express")
const server = express()

// configurar o servidor para apresentar arquivos estáricos
server.use(express.static('public'))

// recebendo os dados do body 
// habilitar body do formulario
server.use(express.urlencoded({extended: true}))

// configura conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '0000',
    host: 'localhost',
    port: 5432,
    database: 'donation'
})

// configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./",{
    express: server,
    noCache: true
}) 

// configura a prensentacao da pagina e rota
server.get("/", function(req, res){ //requisicao e resposta
    db.query('SELECT * FROM "donors"', function(err, result){
        if (err) return res.send("Erro no banco de dados2.")
        const donors_ = result.rows // linhas do pg
        return res.render( "index.html", { donors_ }) // trocando o res.send por .render    
    })  
})

server.post("/", function(req, res){
    // pegar dadods no formulário
    const name = req.body.name // body.name é o nome da classe do input
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios.")
    }

    // colocando valores dentro do db
    const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`

    const values = [name, email, blood]
    db.query(query, values, function(err){
        if (err) return res.send("Erro no banco de dados.")
        return res.redirect("/")
    })
    
})

// ligar o servidor e permitir o acesso na porta 3000
server.listen(3003, function(){
    console.log("Iniciando o servidor...")
})
