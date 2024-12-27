import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

const steps = ['Signup', 'Verify'];

export default function HorizontalStepper({ activeStepNo=0  }) {
  return (
    <Box sx={{ width: '50%' }}>
      <Stepper activeStep={activeStepNo}>
        {steps.map((_, i) => (
          <Step key={i} >
            <StepLabel></StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}