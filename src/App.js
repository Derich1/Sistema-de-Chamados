import { BrowserRouter } from "react-router-dom";
import RoutesApp from "./routes";
import AuthProvider from "./contexts/auth";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



function App() {
  return (
    <BrowserRouter>
      <AuthProvider /* Contexto em volta das rotas para espalhar o necessário para todas páginas */>
        <ToastContainer autoClose = {3000}/>
          <RoutesApp/>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
