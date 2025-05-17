"use client";
import React, { useState } from "react";
import { ToggleButtonGroup, Box, Typography, ToggleButton, styled, InputLabel } from "@mui/material";
import { useController, Control } from "react-hook-form";

interface ButtonLabelProps {
  label: string;
  name: string;
  options: string[];
  control?: Control<any>;
  rules?: Record<string, any>;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: { message?: string } | string;
}

const StyledToggleButton = styled(ToggleButton)({
  padding: "5px",
  width: "100%",
  "&.error": {
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

export default function ButtonLabel({ label, name, options, control, rules, disabled, value: propValue, onChange: propOnChange, error: propError, ...props }: ButtonLabelProps) {
  // Internal state for uncontrolled usage
  const [internalValue, setInternalValue] = useState<string | null>(null);

  // Use react-hook-form if control is provided
  const hookFormData = control ? useController({ name, control, rules }) : null;

  // Determine which values to use based on whether we're using react-hook-form or direct props
  const value = hookFormData ? hookFormData.field.value : propValue !== undefined ? propValue : internalValue;
  const error = hookFormData ? hookFormData.fieldState.error : propError;

  // Handle state change
  const handleChange = (_: React.MouseEvent<HTMLElement>, newValue: string | null) => {
    if (newValue === null) return;

    // Handle different update scenarios
    if (hookFormData) {
      hookFormData.field.onChange(newValue);
    } else if (propOnChange) {
      propOnChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  // Format error message correctly
  const errorMessage = error
    ? typeof error === 'string'
      ? error
      : error.message
    : null;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }} {...props}>
      <InputLabel>{label}</InputLabel>
      <ToggleButtonGroup
        disabled={disabled}
        value={value}
        exclusive
        onChange={handleChange}
        aria-label={label}
      >
        {options.map(option => (
          <StyledToggleButton
            className={!!error ? "error" : ""}
            disabled={disabled}
            key={option}
            value={option}
          >
            {option}
          </StyledToggleButton>
        ))}
      </ToggleButtonGroup>
      {errorMessage && <Typography color="error" variant="caption">{errorMessage}</Typography>}
    </Box>
  );
}