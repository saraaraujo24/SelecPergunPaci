import {Box,HStack,Input, Alert} from "@chakra-ui/react";
import React, { useEffect, useState} from "react";
import axios from "axios";
import CadastroPaciente from "./CadastroP/cadasPaciente";
import './CadastroP/cadasPac.css';
import "./App.css"


function App(){

  const url = "http://localhost:8004/questions";
  
  const [posts, setPosts] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [cpfInput, setCpfInput] = useState("");
  const [infoPaciente, setInfoPaciente] = useState();
  const [showError, setShowError] = useState(false);

  function searchByCpf(cpf) {
    setShowError(false);
  
    axios
      .get(`http://localhost:8004/cadastro?cpf=${cpf}`)
      .then((response) => {
        const data = response.data;
        if (data.length > 0) {
          const matchingResult = data.find((item) => item.cpf === cpf)
          if (matchingResult) {
            setInfoPaciente(matchingResult); 
           
          } else {
            setShowError(true); 
          }
        } else {
          setShowError(true); 
        }
      })
      .catch((error) => {
        console.error(error);
        setShowError(true);
      });
  }
  
  useEffect(() => {
    if (cpfInput) {
      searchByCpf(cpfInput);
    }
  }, [cpfInput]);

  const handlePergunta = (e) => {
    const isChecked = e.target.checked;
    const questionId = e.target.value;
    
    setSelectedQuestions(
      isChecked
        ? [...selectedQuestions, questionId,]
        : selectedQuestions.filter((id) => id !== questionId,)
    );
  };

  function getUser() {
    axios.get(url)
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    getUser()
  }, []);

  async function sendDataToBackend() {

    if (!cpfInput || selectedQuestions.length === 0) {
      // **Improved error message:**
      alert("Selecione um CPF e marque pelo menos uma pergunta antes de finalizar.");
      return;
    }
    try { 
      const cpf = infoPaciente
      const dataToSend = selectedQuestions.map((questionId) => ({
        perguntaId: questionId,
        pergunta: posts.find((post) => post._id === questionId).perguntas,
        
      }));
      
      const response = await axios.post("http://localhost:8004/selecao", {
        selectedQuestions: dataToSend,
        infoPaciente:cpf,
        _id:cpfInput
      });
      
      console.log("Data sent to backend:", response.data);
      alert("Perguntas enviadas com sucesso!");
      setSelectedQuestions([]);
      setCpfInput("");
      setInfoPaciente(null); 
    } catch (error) {
      console.error("Error sending questions:", error);
      
      alert("Cpf já foi selecionado...Por favor informe outro!");
    }
  }

  return(
    <div className="App" >  
      <div  className="Colum"> 
        <div className="cont">
          <center><h2  >Selecionar Pergunta</h2></center>
            <HStack spacing="150">
              <Box w="100%" ml="5%" mt="5%">
                <h4>Buscar Paciente</h4>      
                <Input
                  className="wrap-input" id="cpfInput" value={cpfInput}
                    onChange={(e) => setCpfInput(e.target.value)}
                />                
                <p>
                  {showError && (
                    <Alert className="alert" status="error">*Usuário não encontrado no banco de dados.</Alert>
                  )}
                </p>
                {infoPaciente && (
                  <div key={infoPaciente._id}>
                    <p>CPF: {infoPaciente.cpf}</p>
                    <p>Nome: {infoPaciente.name}</p>
                  </div>
                )} 
              </Box>
              <Box w="60%"  mr="3%" mt="3%">
                <center><h4 >Cadastrar Paciente</h4></center>
                  <CadastroPaciente/>
              </Box>
            </HStack>
        </div><br></br><br></br>
        <div className="perguntas">
          {posts.length === 0 ? (
            <p>Carregando...</p>
          ) : (
            posts.map((post) => (
              <div className="perguntas" key={post._id}>
                <p>{post.perguntas}</p>
                <input type="checkbox"
                  id={post._id} value={post._id}
                  checked={selectedQuestions.includes(post._id)}
                  onChange={handlePergunta}
                />
              </div>
            ))
          )}
        </div>
        <div className="container-Finalizar-form-btn">
          <button className="Finalizar-form-btn"onClick={sendDataToBackend} >
            Finalizar
          </button>
        </div>
      </div>
    </div>
  )
}

export default App



