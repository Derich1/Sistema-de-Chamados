import { FiPlusCircle } from "react-icons/fi";
import Header from "../../components/Header"
import Title from "../../components/Title"
import "./new.css"
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

function New() {

    const {user} = useContext(AuthContext)
    const {id} = useParams()
    const navigate = useNavigate()

    const [customer, setCustomer] = useState([])
    // Posição 0 do array
    const [customerSelected, setCustomerSelected] = useState(0)
    const [complemento, setComplemento] = useState('')
    const [status, setStatus] = useState('Em Aberto')
    const [assunto, setAssunto] = useState("Suporte")
    const [loadCustomer, setLoadCustomer] = useState(true)
    const [idCustomer, setIdCustomer] = useState(false)

    const dbRef = collection(db, "customers")

    useEffect(() => {
        async function handleAssuntoChange() {
            const query = await getDocs(dbRef)
            .then((snapshot) => {
                let lista = []

                snapshot.forEach((doc) => {
                    lista.push({
                        id: doc.id,
                        nomeFantasia: doc.data().nomeFantasia
                    })
                })
                if (snapshot.empty) {
                    console.log("Nenhuma empresa encontrada")
                    setCustomer([{id: '1', nomeFantasia: "Freelance"}])
                    setLoadCustomer(false)
                    return
                }

                setCustomer(lista)
                setLoadCustomer(false)
                
                if (id) {
                    loadChamado(lista)
                }

            })
            .catch((error) => {
                console.log(error)
                setLoadCustomer(false)
                setCustomer([{id: '1', nomeFantasia: "Freelance"}])
            })
        }

        handleAssuntoChange()
        
    }, [id])

    function handleOptionChange(e) {
        setStatus(e.target.value)
    }

    function handleSelectionChange(e) {
        setAssunto(e.target.value)
    }

    // Passa o número que aquele item está no array criado na função "handleAssuntoChange"
    function handleCustomerChange(e) {
        setCustomerSelected(e.target.value)
    }

    async function handleRegister(e) {
        e.preventDefault()

        // Caso tenha um Id quer dizer que quer editar um chamado
        if (idCustomer) {
            const docRef = doc(db, "chamados", id)
            await updateDoc(docRef, {
                cliente: customer[customerSelected].nomeFantasia,
                clienteId: customer[customerSelected].id,
                assunto: assunto,
                complemento: complemento,
                status: status,
                userUid: user.uid
            })
            .then(() => {
                toast.success("Chamado editado com sucesso!")
                navigate("/dashboard")
            })
            .catch((error) => {
                console.log(error)
                toast.error("Ocorreu um erro ao editar o chamado!")
            })

            // Retornar antes para que execute somente essa parte do código e não o que está embaixo que seria para adicionar um novo chamado
            return;
        }

        await addDoc(collection(db, "chamados"), {
            created: new Date(),
            cliente: customer[customerSelected].nomeFantasia,
            clienteId: customer[customerSelected].id,
            assunto: assunto,
            complemento: complemento,
            status: status,
            userUid: user.uid
        })
        .then(() => {
            setComplemento('')
            toast.success("Registrado com sucesso!")
            customerSelected(0)
        })
        .catch((error) => {
            console.log(error)
            toast.error("Ocorreu um erro ao registrar!")
        })
    }
    
    // Carregando um chamado na página /new/id do chamado
    async function loadChamado(lista) {

        const dbRef = doc(db, "chamados", id)
        await getDoc(dbRef)
        .then((snapshot) => {
            // Preenchendo todos os campos com os respectivos dados
            setAssunto(snapshot.data().assunto)
            setStatus(snapshot.data().status)
            setComplemento(snapshot.data().complemento)

            // Encontrando o id que bate com o chamado que quer alterar
            let index = lista.findIndex(item => item.id === snapshot.data().clienteId)

            // Sinalizando que quer editar um chamado
            setIdCustomer(true)

            setCustomerSelected(index)
        })
        .catch((error) => {
            console.log(error)
            setIdCustomer(false)
        })
    }

    return (
        <div>
            <Header/>

            <div className="content">
                <Title nomePagina={id ? "Editando chamado" : "Novo chamado"}>
                    <FiPlusCircle size={25}/>
                </Title>

                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>

                        <label>Cliente</label>
                        {loadCustomer ? (
                            <input type="text" disabled={true} value="Carregando..." />
                        ) : (
                            <select value={customerSelected} onChange={handleCustomerChange}>
                               {customer.map((item, index) => {
                                return (
                                    <option key={index} value={index} >
                                        {item.nomeFantasia}
                                    </option>
                                )
                               }) }
                            </select>
                        )}

                        <label>Assunto</label>
                        <select value={assunto} onChange={handleSelectionChange}>
                            <option value="Suporte">Suporte</option>
                            <option value="Visita técnica">Visita técnica</option>
                            <option value="Financeiro">Financeiro</option>
                        </select>

                        <label>Satus</label>
                        <div className="status">
                            <input type="radio" name="radio" value="Em Aberto" onChange={handleOptionChange} checked={status === 'Em Aberto'}/>
                            <span>Em aberto</span>

                            <input type="radio" name="radio" value="Em progresso" onChange={handleOptionChange} checked={status === 'Em progresso'}/>
                            <span>Em progresso</span>

                            <input type="radio" name="radio" value="Atendido" onChange={handleOptionChange} checked={status === 'Atendido'}/>
                            <span>Atendido</span>
                        </div>

                        <textarea placeholder="Descreva seu problema... (opcional)" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
                        <button type="submit">{id ? "Atualizar chamado" : "Cadastrar chamado"}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default New