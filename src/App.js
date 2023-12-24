import { Route,Routes } from "react-router-dom";
import "./index.css"

// Pages
import Login from "./Pages/Login"
import SignUp from "./Pages/SignUp"
import VerifyEmail from "./Pages/VerifyEmail";

// components

function App() {
  return (
    <main className=" overflow-hidden">
          <Routes>
            <Route path="/" element={<SignUp/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/verify-email" element={<VerifyEmail/>} />
          </Routes>

    </main>
  );
}

export default App;
