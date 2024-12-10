import { useContext, useState } from "react"
import Header from "../../components/Header"
import Title from "../../components/Title"
import { FiSettings, FiUpload } from "react-icons/fi"
import { AuthContext } from "../../contexts/auth"
import avatar from "../../assets/avatar.png"
import "./profile.css"
import { doc, updateDoc } from "firebase/firestore"
import { db, storage } from "../../services/firebaseConnection"
import { toast } from "react-toastify"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"

function Profile() {

    const {user, setUser, storageUser, logout} = useContext(AuthContext)
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
    const [imagemPerfil, setImagemPerfil] = useState(null)
    const [nome, setNome] = useState(user && user.nome)
    const [email, setEmail] = useState(user && user.email)

    function handleFile(e){
        // Pegar a primeira imagem da lista (que vai ser sempre a ultima q o usuario der upload)
        if (e.target.files[0]){
            const img = e.target.files[0]
            if (img.type === "image/png" || img.type === "image/jpeg"){
                setImagemPerfil(img)
                setAvatarUrl(URL.createObjectURL(img))
            } else {
                alert("Por favor escolha um arquivo .png ou .jpeg")
                setImagemPerfil(null)
                return
            }
        }
    }

    async function handleSubmit(e){
        e.preventDefault()

        if (imagemPerfil === null && nome !== ''){
            const docRef = doc(db, "usuarios", user.uid)
            await updateDoc(docRef, {
                nome: nome
            })
            .then(() => {
                let data = {
                    ...user,
                    nome: nome
                }

                setUser(data)
                storageUser(data)
                toast.success("Atualizado com sucesso!")
            })
        } else if (imagemPerfil !== null && nome !== ''){
            handleUpload()
        }
    }

    async function handleUpload(){
        const currentUid = user.uid

        // Criando referência da foto que usuário quer trocar 
        const uploadRef = ref(storage, `images/${currentUid}/${imagemPerfil.name}`)

        const uploadTask = uploadBytes(uploadRef, imagemPerfil)
        .then((snapshot) => {
            // Como o que temos é o arquivo e não url, usamos esse comando para conseguir uma url
            getDownloadURL(snapshot.ref)
            .then(async (downloadURL)=>{
                let urlFoto = downloadURL

                const docRef = doc(db, "usuarios", user.uid)
                await updateDoc(docRef, {
                    // No db ele recebe uma url, então a url setada anteriormente passamos agora para atualizar
                    avatarUrl: urlFoto,
                    nome: nome
                })
                .then(() => {
                    let data = {
                        ...user,
                        nome: nome,
                        avatarUrl: urlFoto
                    }
                    setUser(data)
                    storageUser(data)
                    toast.success("Atualizado com sucesso!")
                })
            })
        })
    }

    return (
        <div>
            <Header/>
            
            <div className="content">
                <Title nomePagina="Meu perfil">
                    <FiSettings size={25} />
                </Title>
                <div className="container">
                    <form className="form-profile" onSubmit={handleSubmit}>
                        <label className="label-avatar">
                            <span>
                                <FiUpload color="#FFF" size={25}/>
                            </span>

                            <input type="file" accept="image/*" onChange={handleFile}/>

                            {avatarUrl === null ? (
                                <img src={avatar} alt="Foto de perfil padrão" width={250} height={250} />
                            ) : (
                                <img src={avatarUrl} alt="Foto de perfil" width={250} height={250} />
                            ) }
                        </label>

                        <label>Nome</label>
                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />

                        <label>Email</label>
                        <input type="text" value={email} disabled={true} />

                        <button type="submit">Salvar</button>
                    </form>
                </div>
                <div className="container">
                    <button className="logout-btn" onClick={() => logout()}>Sair</button>
                </div>
            </div>
        </div>
    )
}

export default Profile