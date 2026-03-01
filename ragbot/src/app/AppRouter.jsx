import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import LoginPage from "../pages/LoginPage";
import ChatPage from "../pages/ChatPage";
import SetPassword from "../components/SetPassword";
import ProtectedRoute from "../components/ProtectedRoute";
import About from "../pages/About";
import ChatLayout from "../pages/ChatLayout";
import Profile from "../pages/Profile";
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatLayout>
                {({ chats, setChats, activeChatId }) => (
                  <ChatPage
                    chats={chats}
                    setChats={setChats}
                    activeChatId={activeChatId}
                  />
                )}
              </ChatLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
