"use client";
import React from "react";
import { ToggleButtonGroup, Box, Typography, ToggleButton, styled, InputLabel } from "@mui/material";
import { useController, Control } from "react-hook-form";

interface ButtonLabelProps {
  label: string;
  name: string;
  options: string[];
  control?: Control<any>;
  rules?: Record<string, any>;
  disabled?: boolean;
}

const StyledToggleButton = styled(ToggleButton)({
  padding: "5px",
  width: "100%",
  "&.error":{
    color: 'red',
    border: `1px solid red`,
  },
  "&:hover": {
    backgroundColor: "#999",
    color: "#fff",
    fontWeight: "bold",
  },
  "&.Mui-selected": {
    backgroundColor: "#0070f3",
    color: "white",
    "&:hover": {
      backgroundColor: "#0070f3",
    },
  },
});

export default function ButtonLabel({ label, name, options, control, rules, disabled, ...props }: ButtonLabelProps) {
  const { field: { value, onChange }, fieldState: { error }} = useController({ name, control, rules});
  const handleChange = (_: React.MouseEvent<HTMLElement>, newValue: string | null) => {
    if (newValue !== null) onChange(newValue);
  };
  
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }} {...props}>
      <InputLabel>{label}</InputLabel>
      <ToggleButtonGroup disabled={disabled} value={value} exclusive onChange={handleChange} aria-label={label}>
        {options.map(option => (
          <StyledToggleButton className={!!error?"error":""} disabled={disabled} key={option} value={option}>{option}</StyledToggleButton>
        ))}
      </ToggleButtonGroup>
      {error && <Typography color="error" variant="caption">{error.message}</Typography>}
    </Box>
  );
}