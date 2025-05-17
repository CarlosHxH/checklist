"use client";
import React from "react";
import { ToggleButtonGroup, Box, ToggleButton, styled, InputLabel, Typography } from "@mui/material";
import { Control, Controller } from "react-hook-form";

interface ButtonOptionsProps {
  label: string;
  name: string;
  options: { label: string, value: string | number | boolean }[];
  control: Control<any>;
  rules?: Record<string, any>;
  disabled?: boolean;
  defaultValue?: any;
}

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: "8px",
  padding: "5px",
  width: "100%",
  "&.error": {
    color: 'red',
    border: `1px solid red`,
  },
  "&:hover": {
    backgroundColor: theme.palette.grey[700],
    color: theme.palette.common.white,
    fontWeight: "bold",
  },
  "&.Mui-selected": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

export default function ButtonOptions({ label, name, options, control, disabled, defaultValue, ...props }: ButtonOptionsProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }} {...props}>
      <InputLabel>{label}</InputLabel>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field: { onChange, value, ...others }, fieldState: { error } }) => (
          <>
            <ToggleButtonGroup 
              color="primary" 
              {...others}
              onChange={(e, i) => onChange(i)} 
              value={value} 
              disabled={disabled} 
              exclusive 
              aria-label={label}
            >
              {options.map(({ label, value }, i) => (
                <StyledToggleButton 
                  key={label} 
                  className={error ? "error" : ""} 
                  value={value} 
                  aria-label={label}
                >
                  {label}
                </StyledToggleButton>
              ))}
            </ToggleButtonGroup>
            {error && <Typography color="error" variant="caption">{error.message}</Typography>}
          </>
        )}
      />
    </Box>
  );
}

/*



            <ToggleButtonGroup color="primary" {...others} onChange={(e, i) => {
              onChange(i);
              handleChange(e, i)
            }} value={alignment} disabled={disabled} exclusive aria-label={label}>
              {options.map(({ label, value }, i) => (
                <StyledToggleButton key={i} className={!!error?"error":""} value={value} aria-label={label}>{label}</StyledToggleButton>
              ))}
            </ToggleButtonGroup>

*/