import { useContext } from "react"
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth";

function Private({children}){
    const {signed, loadingUser} = useContext(AuthContext);

    if (!signed){
        return <Navigate to="/" />
    } 
    if (loadingUser){
        return (
            <div></div>
        )
    }
    return children
}

export default Private