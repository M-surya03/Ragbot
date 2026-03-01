import {
  Box,
  Typography,
  List,
  ListItemButton,
  IconButton,
  Divider,
  Avatar,
  TextField,
  InputAdornment,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Sidebar({
  chats = [],
  activeChatId,
  setActiveChatId,
  createNewChat,
  deleteChat,
}) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [searchTerm, setSearchTerm] = useState("");

  const name = user?.name || user?.email?.split("@")[0] || "User";
  const email = user?.email || "";

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        width: 270,
        bgcolor: "#0B1120",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6">Chats</Typography>
          <IconButton onClick={createNewChat}>
            <AddIcon />
          </IconButton>
        </Box>

        <TextField
          fullWidth
          size="small"
          placeholder="Search chats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              bgcolor: "#020617",
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Box sx={{ height: "65vh", overflowY: "auto", pr: 1 }}>
          <List>
            {filteredChats.map((chat) => (
              <ListItemButton
                key={chat.id}
                selected={chat.id === activeChatId}
                onClick={() => setActiveChatId(chat.id)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <ChatIcon sx={{ mr: 1 }} />
                  {chat.title}
                </Box>

                <DeleteOutlineIcon
                  fontSize="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        <Divider sx={{ mb: 2 }} />

        <Box
          onClick={() => navigate("/profile")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1,
            borderRadius: 2,
            cursor: "pointer",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.05)" },
          }}
        >
          <Avatar sx={{ width: 34, height: 34, bgcolor: "#6366F1" }}>
            {name.charAt(0).toUpperCase()}
          </Avatar>

          <Box>
            <Typography variant="body2" fontWeight={500}>
              {name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {email}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}