const express = require('express')
const cors = require('cors')
const mysql = require('mysql')


//criado app com todos os metodos do express
const app = express()
//aplicar cors ao app para que seja possível acesso ao banco 
//de dados por uma url de dominio diferente
app.use(cors())

//config de conexão com o mySQL
const conn = mysql.createConnection({
    host:'localhost',
    user:'xxx',
    password:'xxx',
    database: 'xxx'
})

//executando a conexão
conn.connect(function(err){
    if(err) throw err;
    console.log("Banco de dados conectado")
})

app.get('/',(req,res)=>{
    res.send('Servidor rodando aqui na porta 4400');
    conn.query("CREATE DATABASE IF NOT EXISTS epbwe109_todolist", function (err){
        if(err) throw err;
        console.log("Banco de dados epbwe109_todolist OK")
    })
    conn.query("CREATE TABLE IF NOT EXISTS tarefas (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, tarefa VARCHAR(255), concluida boolean DEFAULT false, deletada boolean DEFAULT false)", function (err){
        if(err) throw err;
        console.log("Tabela tarefas OK")
    })
})

app.get('/tarefas', (req,res)=>{
    conn.query("SELECT * FROM tarefas",(err,result)=>{
        return res.json({
            data: result
        })
    })
})

app.get('/tarefas/add',(req,res)=>{
    const { tarefa, concluida } = req.query
    //na linha acima, usamos o objeto req.query que reune todos os parametros em
    //string que usmaos na URL do get. Por exemplo url/add?nome=pier&sobrenome=bottero
    //e criamos variaveis const com o mesmo nome dos parametros para quais apontam
    //dentro do obj req.query. Ex: const tarefa = req.query.tarefa.
    //https://expressjs.com/pt-br/4x/api.html#req.query
    const ADD_DADOS = `INSERT INTO tarefas(tarefa,concluida) VALUES('${tarefa}',${concluida})`
    conn.query(ADD_DADOS,(err,res)=>{
        if(res){
            console.log('dados inseridos')
        }
    })
})

app.get('/tarefas/update',(req,res)=>{
    const { id_tarefa, concluida } = req.query    
    const UPDATE_DADOS = 'UPDATE tarefas SET concluida='+concluida+' WHERE id='+id_tarefa
    conn.query(UPDATE_DADOS,(err,res)=>{
        if(res){
            console.log('dados atualizados')
        }
    })
})

app.get('/tarefas/delete',(req,res)=>{
    const { id_tarefa } = req.query    
    const UPDATE_DADOS = 'UPDATE tarefas SET deletada=true WHERE id='+id_tarefa
    conn.query(UPDATE_DADOS,(err,res)=>{
        if(res){
            console.log('tarefa deletada')
        }
    })
})

app.listen(4400, () => {
    console.log('o servidor está rodando na porta 4400')
})



