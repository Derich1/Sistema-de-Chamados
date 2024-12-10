import { FiX } from "react-icons/fi"
import "./modal.css"

function Modal({chamado, close}) {
    return (
        <div className="modal">
            <div className="container">
                <button className="close" onClick={close}>
                    <FiX size={25} color="#FFF" />
                    Fechar
                </button>

                <main>
                    <h2>Detalhes do chamado</h2>

                    <div className="row">
                        <span>
                            Cliente: <i>{chamado.cliente}</i>
                        </span>
                    </div>

                    <div className="row">
                        <span>
                            Assunto: <i>{chamado.assunto}</i>
                        </span>
                    </div>

                    <div className="row">
                        <span>
                            Cadastrado em: <i>{chamado.createdFormated}</i>
                        </span>
                    </div>

                    <div className="row">
                        <span>
                            Status: 
                            <i className="status-badge" style={{color: "#FFF", backgroundColor: chamado.status === "Em Aberto" ? "#5cb85c" : "#999"}}>
                                {chamado.status}
                            </i>
                        </span>
                    </div>

                    {chamado.complemento !== '' && (
                        <>
                            <h3>Complemento</h3>
                            <p>
                                {chamado.complemento}
                            </p>
                        </>
                    )}
                </main>
            </div>
        </div>
    )
}

export default Modal