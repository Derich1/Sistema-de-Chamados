import { useContext } from "react"
import { AuthContext } from "../../contexts/auth"
import avatar from "../../assets/avatar.png"
import {FiHome, FiUser, FiSettings} from "react-icons/fi"
import { Link } from "react-router-dom"
import "./header.css"

function Header(){
    const {user} = useContext(AuthContext)

    return (
        <div className="sidebar">
            <div>
                <img /* se o usuario não tiver foto aparece a padrão, do contrário mostra a dele */ 
                src={user.avatarUrl === null ? avatar : user.avatarUrl} alt="Foto de perfil" />
            </div>
            <Link to="/dashboard">
                <FiHome color="#FFF" size={24}/>
                    Chamados
            </Link>
            <Link to="/customers">
                <FiUser color="#FFF" size={24}/>
                    Clientes
            </Link>
            <Link to="/profile">
                <FiSettings color="#FFF" size={24}/>
                    Perfil
            </Link>
        </div>
    )
}

export default Header