import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export default function ChatLayout({ children }) {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("chats")) || [];
    if (saved.length) {
      setChats(saved);
      setActiveChatId(saved[0].id);
    } else {
      const firstChat = { id: Date.now().toString(), title: "New Chat", messages: [] };
      setChats([firstChat]);
      setActiveChatId(firstChat.id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats));
  }, [chats]);

  const createNewChat = () => {
    const newChat = { id: Date.now().toString(), title: "New Chat", messages: [] };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const deleteChat = (id) => {
    const filtered = chats.filter(c => c.id !== id);
    setChats(filtered);
    if (filtered.length) setActiveChatId(filtered[0].id);
    else setActiveChatId(null);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        createNewChat={createNewChat}
        deleteChat={deleteChat}
      />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", bgcolor: "#020617" }}>
        {children({ chats, setChats, activeChatId })}
      </Box>
    </Box>
  );
}