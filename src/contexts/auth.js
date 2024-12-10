import { createContext, useEffect, useState } from "react";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth"
import {setDoc, doc, getDoc} from "firebase/firestore"
import { auth, db } from "../services/firebaseConnection";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify';

export const AuthContext = createContext({});

function AuthProvider({children}){

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loadingUser, setLoadingUser] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const usuario = localStorage.getItem("@detailUser")

        if (usuario){
            setUser(JSON.parse(usuario))
            setLoadingUser(false)
        }

        setLoadingUser(false)

    }, [])


    async function signIn(email, senha){
        setLoading(true)

        await signInWithEmailAndPassword(auth, email, senha)
        .then( async (value) => {
            const uid = value.user.uid
            const docRef = doc(db, "usuarios", uid)
            const docSnap = await getDoc(docRef)

            let data = {
                uid: uid,
                // o docSnap pega o que tem no banco de dados
                nome: docSnap.data().nome,
                // Como não tem email no banco é necessário usar value
                email: value.user.email,
                avatarUrl: docSnap.data().avatarUrl
            }

            setUser(data)
            setLoading(false)
            storageUser(data)
            toast.success("Bem vindo(a) ao Sistema de Chamados!")
            navigate("/dashboard")
        })
        .catch((error) => {
            console.log(error)
            toast.error("Algo deu errado!")
            setLoading(false)
        })
    }

    async function signUp(nome, email, senha){
        setLoading(true)

        await createUserWithEmailAndPassword(auth, email, senha)
        .then( async (value) => {
            let uid = value.user.uid

            // Criando colecao no banco db chamado usuarios e com documento chamado uid (do usuario)
            await setDoc(doc(db, "usuarios", uid), {
                nome: nome,
                // Foto
                avatarUrl: null
            })
            .then(() => {

                // Salvando dados do usuário cadastrado
                let data = {
                    uid: uid,
                    nome: nome,
                    email: value.user.email,
                    avatarUrl: null
                }

                setUser(data)
                setLoading(false)
                // Passando a variavel data pra receber na função e salvar no localStorage
                storageUser(data)
                toast.success("Bem vindo(a) ao Sistema de Chamados!")
                navigate("/dashboard")

            })
        })
        .catch((error) => {
            console.log(error)
            setLoading(false)
        })
    }

    // Salvando no localStorage com a tag de detailUser
    function storageUser(data) {
        localStorage.setItem("@detailUser", JSON.stringify(data))
    }

    async function logout(){
        await signOut(auth)
        setUser(null)
        localStorage.removeItem("@detailUser")
    }

    return (
        // Enviando os seguintes valores para todos children
        <AuthContext.Provider value={{
            signed: !!user, // "!!" converte em boolean, verificando se existe ou não.
            user,
            setUser,
            signIn, 
            signUp,
            logout,
            loading,
            loadingUser,
            storageUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider