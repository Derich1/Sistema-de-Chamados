import "./signin.css"
import logo from "../../assets/logo.png"
import { useState, useContext } from "react"
import { Link } from "react-router-dom"
import { AuthContext } from "../../contexts/auth"


export default function SignIn() {

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    // Instanciando uma função do contexto
    const {signIn, loading} = useContext(AuthContext)

    // Todo: redirecionar para o xesq
    async function handleSignIn(e){
        e.preventDefault()

        if (email !== '' && senha !== ''){
            await signIn(email, senha)
        }
    }

    return(
        <div className="container-center">
            <div className="login">
                <div className="login-area">
                    <img src={logo} alt="Logo do sistema de chamados" />
                </div>

                <form onSubmit={handleSignIn}>
                    <h1>Sistema de Chamados</h1>
                    <input type="email" value={email} placeholder="Digite seu email" onChange={(e)=> setEmail(e.target.value)} />
                    <input type="password" value={senha} placeholder="Digite sua senha" onChange={(e)=> setSenha(e.target.value)} />
                    <button type="submit">
                        {loading ? "Carregando..." : "Entrar"}
                    </button>
                </form>

                <Link to="/register">Ainda não possui uma conta?</Link>
            </div>
        </div>
    )
}