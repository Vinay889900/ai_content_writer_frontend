import {
  Container,
  Typography,
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import ContentGenerator from "./components/ContentGenerator";
import { useState } from "react";

function App() {
  const steps = [
    "Enter Seed Keyword",
    "Select Keyword",
    "Select Title",
    "Choose Topic",
    "Generate Content",
  ];

  const [activeStep, setActiveStep] = useState(0);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #fdfbfb, #ebedee)",
        py: 6,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography
            variant="h3"
            component="h1"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#333" }}
          >
            ✨ AI Blog Writer
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ my: 4 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Pass activeStep and setter so ContentGenerator controls the flow */}
          <ContentGenerator activeStep={activeStep} setActiveStep={setActiveStep} />
        </Paper>
      </Container>
    </Box>
  );
}

export default App;