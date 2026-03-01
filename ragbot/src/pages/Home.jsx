import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Box
      sx={{
        textAlign: "center",
        mt: 14,
        animation: "fadeIn 0.8s ease-in",
        "@keyframes fadeIn": {
          from: { opacity: 0, transform: "translateY(20px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      <Typography variant="h3" fontWeight={600}>
        AI Academic Assistant
      </Typography>

      <Typography color="gray" mt={2}>
        Intelligent academic support powered by AI
      </Typography>

      <Button
        variant="contained"
        size="large"
        sx={{
          mt: 4,
          px: 5,
          py: 1.5,
          background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
          boxShadow: "0 10px 25px rgba(99,102,241,0.35)",
          "&:hover": {
            transform: "translateY(-2px)",
          },
        }}
        component={Link}
        to="/chat"
      >
        Start Chat
      </Button>
    </Box>
  );
}
