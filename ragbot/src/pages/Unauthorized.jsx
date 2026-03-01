import { Typography, Box } from "@mui/material";

export default function Unauthorized() {
  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h4">403</Typography>
      <Typography>You are not authorized.</Typography>
    </Box>
  );
}
