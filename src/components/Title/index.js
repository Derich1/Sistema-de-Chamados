import "./title.css"

function Title({children, nomePagina}){
    return (
        <div className="title">
            {children}
            <span>{nomePagina}</span>
        </div>
    )
}

export default Title