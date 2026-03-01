import { Box, Paper, Typography } from "@mui/material";

export default function MessageBubble({ message }) {
  const isUser = message.sender === "user";

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        my: 1.2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 1.8,
          px: 2.2,
          maxWidth: "75%",
          backgroundColor: isUser ? "#6366F1" : "#1E293B",
          color: "#fff",
          borderRadius: 3,
          wordBreak: "break-word",
          overflowWrap: "anywhere",
          whiteSpace: "pre-wrap",
          lineHeight: 1.6,
        }}
      >
        <Typography variant="body2">
          {message.text}
        </Typography>
      </Paper>
    </Box>
  );
}