import { Box, Paper, Typography } from "@mui/material";
import { useRef, useEffect, useState } from "react";
import ChatInput from "../components/ChatInput";
import MessageBubble from "../components/MessageBubble";
import TypingBubble from "../components/TypingBubble";

export default function ChatPage({
  chats = [],
  setChats = () => {},
  activeChatId = null,
}) {
  const bottomRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const activeChat = chats.find((c) => c.id === activeChatId);
  const messages = activeChat?.messages || [];

  // 🎯 Attractive Welcome Quotes
  const quotes = [
    "How can I help you today? 🚀",
    "Ask me anything — I’m ready!",
    "Let’s build something amazing together.",
    "Got a question? I’ve got answers.",
    "Curious about something? Let’s explore.",
    "Your AI assistant is listening 👀",
    "Let’s solve your problem step by step.",
    "Ideas start here 💡",
  ];

  const randomQuote =
    quotes[Math.floor(Math.random() * quotes.length)];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim() || !activeChatId) return;

    const isFirstMessage = activeChat?.messages.length === 0;


    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: [...chat.messages, { sender: "user", text }],
            }
          : chat
      )
    );

    setLoading(true);

    try {
      if (isFirstMessage) {
        const titleRes = await fetch(
          "http://localhost:8000/generate-title",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: text }),
          }
        );

        const titleData = await titleRes.json();

        setChats((prev) =>
          prev.map((chat) =>
            chat.id === activeChatId
              ? { ...chat, title: titleData.title }
              : chat
          )
        );
      }

      const response = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botText = "";


      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: [...chat.messages, { sender: "bot", text: "" }],
              }
            : chat
        )
      );

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        botText += decoder.decode(value);

        setChats((prev) =>
          prev.map((chat) => {
            if (chat.id === activeChatId) {
              const updated = [...chat.messages];
              updated[updated.length - 1].text = botText;
              return { ...chat, messages: updated };
            }
            return chat;
          })
        );
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  if (!activeChat) return null;

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: messages.length === 0 ? "center" : "flex-start",
          px: 3,
          pt: 4,
          pb: 6,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 850 }}>
          {messages.length === 0 ? (
            <Box textAlign="center" sx={{ opacity: 0.9 }}>
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ mb: 2 }}
              >
                {randomQuote}
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
              >
                Start a conversation and let’s explore together.
              </Typography>
            </Box>
          ) : (
            <>
              {messages.map((msg, i) => (
                <MessageBubble key={i} message={msg} />
              ))}
              {loading && <TypingBubble />}
              <div ref={bottomRef} />
            </>
          )}
        </Box>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          p: 2,
          bgcolor: "#020617",
        }}
      >
        <Box sx={{ maxWidth: 850, margin: "auto" }}>
          <ChatInput onSend={sendMessage} />
        </Box>
      </Paper>
    </Box>
  );
}