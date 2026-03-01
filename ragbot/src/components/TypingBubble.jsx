import { Box, Paper } from "@mui/material";

export default function TypingBubble() {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-start", my: 1 }}>
      <Paper
        sx={{
          px: 2,
          py: 1.2,
          backgroundColor: "#1E293B",
          borderRadius: 3,
          display: "flex",
          gap: 0.6,
        }}
      >
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
        <style>
          {`
            .dot {
              width:6px;
              height:6px;
              background:#fff;
              border-radius:50%;
              animation: blink 1.4s infinite both;
            }
            .dot:nth-child(2){ animation-delay: .2s }
            .dot:nth-child(3){ animation-delay: .4s }

            @keyframes blink {
              0% { opacity: .2 }
              20% { opacity: 1 }
              100% { opacity: .2 }
            }
          `}
        </style>
      </Paper>
    </Box>
  );
}