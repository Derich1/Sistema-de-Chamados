import { useState } from "react"
import Header from "../../components/Header"
import Title from "../../components/Title"
import { FiSettings } from "react-icons/fi"
import { addDoc, collection } from "firebase/firestore"
import { db } from "../../services/firebaseConnection"
import { toast } from "react-toastify"

function Customers(){

    const [nome, setNome] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [endereco, setEndereco] = useState('')

    async function handleRegister(e){
        e.preventDefault()

        if (nome !== null && cnpj !== null && endereco !== null){
            await addDoc(collection(db, "customers"), {
                nomeFantasia: nome,
                cnpj: cnpj,
                endereco: endereco
            })
            .then(() => {
                toast.success("Empresa cadastrada com sucesso!")
                setNome('')
                setCnpj('')
                setEndereco('')
            })
        } else {
            toast.error("Preencha todos os campos.")
        }
    }

    return (
        <div>
        <Header/>
            
            <div className="content">
                <Title nomePagina="Clientes">
                    <FiSettings size={25} />
                </Title>
                <div className="container">
                    <form className="form-profile" onSubmit={handleRegister}>
                        <label>Nome fantasia</label>
                        <input type="text" placeholder="Nome da empresa" value={nome} onChange={(e) => setNome(e.target.value)} />

                        <label>CNPJ</label>
                        <input 
                        type="text" placeholder="CNPJ da empresa" value={cnpj} onChange={(e) => setCnpj(e.target.value)} />

                        <label>Endereço</label>
                        <input type="text" placeholder="Endereço da empresa" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                        <button type="submit">Cadastrar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Customers