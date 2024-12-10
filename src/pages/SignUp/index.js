import "../SignIn/signin.css"
import logo from "../../assets/logo.png"
import { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../contexts/auth"


export default function SignUp() {

    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const {signUp, loading} = useContext(AuthContext)

    async function handleSubmit(e){
        e.preventDefault()

        if (nome !== '' && email !== '' && senha !== ''){
            await signUp(nome, email, senha)
        }
    }

    return(
        <div className="container-center">
            <div className="login">
                <div className="login-area">
                    <img src={logo} alt="Logo do sistema de chamados" />
                </div>

                <form onClick={handleSubmit}>
                    <h1>Cadastrar</h1>
                    <input type="text" value={nome} placeholder="Digite seu nome" onChange={(e)=> setNome(e.target.value)} />
                    <input type="email" value={email} placeholder="Digite seu email" onChange={(e)=> setEmail(e.target.value)} />
                    <input type="password" value={senha} placeholder="Digite sua senha" onChange={(e)=> setSenha(e.target.value)} />
                    <button type="submit">
                        {loading ? "Carregando..." : "Cadastrar"}
                    </button>
                </form>

                <Link to="/">Já possui uma conta?</Link>
            </div>
        </div>
    )
}