import { Route,Routes } from "react-router-dom";
import "./index.css"

// Pages
import Login from "./Pages/Login"
import SignUp from "./Pages/SignUp"
import VerifyEmail from "./Pages/VerifyEmail";
import CreateProfile from "./components/core/Profile/CreateProfile";
import Chat from "./Pages/Chat";

// components

function App() {
  return (
    <main className=" overflow-hidden h-full w-full">
          <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/signup" element={<SignUp/>}/>
            <Route path="/chat" element={<Chat/>}/>
            <Route path="/create-profile/:id" element={<CreateProfile/>} />
            <Route path="/verify-email" element={<VerifyEmail/>} />
          </Routes>

    </main>
  );
}

export default App;
