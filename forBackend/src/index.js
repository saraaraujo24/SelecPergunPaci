const express = require("express")
const morgan = require("morgan");
const app = express();
const mongoose = require('mongoose')
const cors = require("cors");

const bodyParser= require("body-parser");

app.use(morgan("dev"));
app.use(express.json())
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())


// Conexão com o banco de dados MongoDB
mongoose.connect('mongodb://0.0.0.0:27017/questions', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Model do documento
const Posts = mongoose.model('Cadastro', {
  _id: String,
  name: String,
  cpf:String,
  dataN:String,
  sexo:String,
  naturalidade:Array,
  celular:String,
  telefone:String,
  uf:String,
  cidade:String,
  bairro:String,
  lagradouro:String,
  numero:String,
  complemento:String,
 
});

const Post = mongoose.model('Perguntas', {
  perguntas: String,
});

const Perguntas = mongoose.model('PergSelecPaci', {
  _id:String,
  infoPaciente:Array,
  selectedQuestions: [{
    perguntaId: String,
    pergunta: String,
  }],

});

app.post('/selecao', async (req, res) => {
  try {
    const {selectedQuestions,infoPaciente,_id} = req.body;
   
    console.log('Perguntas recebidas:', selectedQuestions);

    const posts = new Perguntas({ selectedQuestions,infoPaciente,_id });

    await posts.save();

    res.status(200).send('Perguntas recebidas com sucesso!');
  } catch (error) {
    console.error('Erro ao receber perguntas:', error);
    res.status(500).send('Erro ao receber perguntas. Tente novamente mais tarde.');
  }
});

app.get('/questions', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao obter dados' });
  }
});

app.get('/cadastro', async (req, res) => {
  try {
    const posts = await Posts.find();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao obter dados' });
  }
});

function isValidCPF(cpf) {
  
  return true;
}

// Rota para salvar os dados
app.post('/Cadastro', async (req, res) => {
  try {

    const { _id, cpf,name,dataN,sexo,naturalidade,
      celular,telefone,uf,cidade,bairro,lagradouro,
      numero,complemento} = req.body;
    
      if (!isValidCPF(_id)) {
        res.status(400).json({ error: "CPF inválido." });
        return;
      }

    const post = new Posts({  _id,cpf,name,dataN,sexo,naturalidade,
      celular,telefone,uf,cidade,bairro,lagradouro,numero,complemento,});

    await post.save();

    res.json({ message: 'Dados salvos com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(409).json({ error: "CPF já cadastrado." });
  }
});





app.listen(8004, ()=> {
    console.log("Rodando");
})






