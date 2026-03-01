import { Container, Divider, Typography } from "@mui/material";
import LoginForm from "../components/LoginForm";
import GoogleButton from "../components/GoogleButton";

export default function LoginPage() {
  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: 10,
        animation: "fadeIn 0.6s ease",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Portal Login
      </Typography>

      <LoginForm />

      <Divider sx={{ my: 3 }}>Students</Divider>

      <GoogleButton />
    </Container>
  );
}
