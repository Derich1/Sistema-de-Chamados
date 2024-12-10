import Header from "../../components/Header"
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from "react-icons/fi"
import Title from "../../components/Title"
import { Link } from "react-router-dom"
import "./dashboard.css"
import { useEffect, useState } from "react"
import { db } from "../../services/firebaseConnection"
import { collection, getDoc, getDocs, limit, orderBy, query, startAfter } from "firebase/firestore"
import { format } from "date-fns"
import Modal from "../../components/Modal"

const listaRef = collection(db, "chamados")

export default function Dashboard(){

    const [chamados, setChamados] = useState([])
    const [loading, setLoading] = useState(true)
    const [isEmpty, setIsEmpty] = useState(false)
    const [lastDoc, setLastDoc] = useState()
    const [loadingMore, setLoadingMore] = useState(false)
    const [detailChamado, setDetailChamado] = useState()
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {

        async function loadData() {
            const q = query(listaRef, orderBy("created", "desc"), limit(5))

            const querySnapshot = await getDocs(q)

            // Evita duplicidade caso o useEffect bug e rode 2x
            setChamados([])

            await loadContent(querySnapshot)
            setLoading(false)
        }

        loadData()

        return () => {}
    }, [])

    async function loadContent(querySnapshot) {
        const isCollectionEmpty = querySnapshot.size === 0

        if (!isCollectionEmpty) {
            let lista = []

            querySnapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    created: doc.data().created,
                    createdFormated: format(doc.data().created.toDate(), "dd/MM/yyyy"),
                    cliente: doc.data().cliente,
                    clienteId: doc.data().clienteId,
                    status: doc.data().status,
                    complemento: doc.data().complemento
                })
            })
            const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1]
            setChamados(chamados => [...chamados, ...lista])
            setLastDoc(lastDocument)
        } else {
            setIsEmpty(true)
        }
        setLoadingMore(false)
    }

    async function handleMore() {
        setLoadingMore(true)
        const q = query(listaRef, orderBy("created", "desc"), startAfter(lastDoc), limit(5))

        const querySnapshot = await getDocs(q)

        await loadContent(querySnapshot)
    }

    function handleModal(item) {
        setShowModal(true)
        setDetailChamado(item)
    }

    if (loading) {
        return (
            <div>
                <Header/>

                <div className="content">
                    <Title nomePagina="Chamados">
                        <FiMessageSquare size={25} />
                    </Title>

                    <div className="container dashboard">
                        <span>Buscando chamados...</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
        <Header/>
            
            <div className="content">
                <Title nomePagina="Chamados">
                    <FiMessageSquare size={25} />
                </Title>
                <>

                    {chamados.length === 0 ? (
                        <div className="container dashboard">
                            <span>Nenhum chamado encontrado!</span>
                            <Link to="/new" className="new">
                                <FiPlus color="#FFF" size={25} />
                                Novo chamado
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link to="/new" className="new">
                                <FiPlus color="#FFF" size={25} />
                                Novo chamado
                            </Link>
                            
                            <table>
                                <thead>
                                    <tr>
                                        <th scope="col">Cliente</th>
                                        <th scope="col">Assunto</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Cadastrado</th>
                                        <th scope="col">#</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {chamados.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td data-label="Cliente">{item.cliente}</td>
                                                <td data-label="Assunto">{item.assunto}</td>
                                                <td data-label="Status">
                                                    <span className="badge" style={{backgroundColor: item.status === "Em Aberto" ? "#5cb85c" : "#999"}}>{item.status}</span>
                                                </td>
                                                <td data-label="Cadastrado">{item.createdFormated}</td>
                                                <td data-label="#">
                                                    <button className="action" style={{backgroundColor: '#3583f6'}} onClick={() => handleModal(item)}>
                                                        <FiSearch color="#FFF" size={17} />
                                                    </button>
                                                    <Link to={`/new/${item.id}`} className="action" style={{backgroundColor: '#f6a935'}}>
                                                        <FiEdit2 color="#FFF" size={17} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })}       
                                </tbody>
                            </table>
                        </>
                    )}
                </>

                {loadingMore && <h3>Carregando mais chamados...</h3>}
                {!loadingMore && !isEmpty && <button onClick={handleMore} className="btn-more">Buscar mais chamados</button>}
                
            </div>

            {showModal && (
                <Modal
                chamado = {detailChamado}
                close = {() => setShowModal(false)}
                />
            )}
        </div>
    )
}