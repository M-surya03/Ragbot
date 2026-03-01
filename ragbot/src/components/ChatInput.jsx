import { TextField, IconButton, Box } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <TextField
        fullWidth
        multiline
        maxRows={4}
        placeholder="Message assistant..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 3,
            bgcolor: "#0B1120",
          },
        }}
      />
      <IconButton
        onClick={send}
        sx={{
          bgcolor: "#6366F1",
          color: "#fff",
          "&:hover": { bgcolor: "#5855eb" },
          borderRadius: 2,
        }}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
}