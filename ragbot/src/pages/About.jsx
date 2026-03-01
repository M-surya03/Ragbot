import { Box, Typography, Container, Grid, Paper } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PsychologyIcon from "@mui/icons-material/Psychology";
import VerifiedIcon from "@mui/icons-material/Verified";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const cards = [
  {
    icon: <PsychologyIcon sx={{ fontSize: 40 }} />,
    title: "AI-Powered Learning",
    text: "Uses intelligent AI to simplify complex academic concepts for better understanding.",
  },
  {
    icon: <MenuBookIcon sx={{ fontSize: 40 }} />,
    title: "Syllabus-Based Support",
    text: "Provides explanations strictly from approved academic materials.",
  },
  {
    icon: <SchoolIcon sx={{ fontSize: 40 }} />,
    title: "Concept Clarity",
    text: "Focuses on understanding rather than memorization or direct answers.",
  },
  {
    icon: <VerifiedIcon sx={{ fontSize: 40 }} />,
    title: "Academic Integrity",
    text: "Promotes ethical learning while preventing misuse of AI tools.",
  },
];

export default function About() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: 10,
          textAlign: "center",
        }}
      >
       <Typography
          variant="h4"
          fontWeight={700}
          gutterBottom
          sx={{
            background: "linear-gradient(135deg,#6366F1,#8B5CF6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          About the Platform
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 6 }}>
          A controlled AI assistant designed to support ethical and effective learning.
        </Typography>

        <Grid container spacing={4}>
          {cards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  textAlign: "center",
                  borderRadius: 3,
                  background: "rgba(17,24,39,0.85)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  transition: "0.3s",
                  animation: "fadeUp 0.6s ease",
                  "@keyframes fadeUp": {
                    from: { opacity: 0, transform: "translateY(20px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 30px rgba(99,102,241,0.25)",
                  },
                }}
              >
                <Box sx={{ color: "#8B5CF6", mb: 1 }}>{card.icon}</Box>

                <Typography variant="h6" fontWeight={600} gutterBottom>
                  {card.title}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {card.text}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}
