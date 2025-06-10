"use client";
import React, { useState } from "react";
import { ToggleButtonGroup, Box, Typography, ToggleButton, styled, InputLabel } from "@mui/material";

interface ButtonLabelProps {
  label: string;
  name: string;
  options: string[];
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: { message?: string } | string;
  defaultValue?: string;
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

export default function ButtonLabel({ 
  label, 
  name, 
  options, 
  disabled, 
  value: propValue, 
  onChange: propOnChange, 
  error: propError,
  defaultValue,
  ...props 
}: ButtonLabelProps) {
  // Estado interno para uso não controlado
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue || null);

  // Determina se o componente é controlado ou não
  const isControlled = propValue !== undefined;
  const value = isControlled ? propValue : internalValue;

  // Manipula mudanças de estado
  const handleChange = (_: React.MouseEvent<HTMLElement>, newValue: string | null) => {
    if (newValue === null) return;

    if (isControlled) {
      // Componente controlado - chama o onChange passado via props
      propOnChange?.(newValue);
    } else {
      // Componente não controlado - atualiza estado interno
      setInternalValue(newValue);
      propOnChange?.(newValue); // Ainda chama onChange se fornecido
    }
  };

  // Formata mensagem de erro
  const errorMessage = propError
    ? typeof propError === 'string'
      ? propError
      : propError.message
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
            className={!!propError ? "error" : ""}
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