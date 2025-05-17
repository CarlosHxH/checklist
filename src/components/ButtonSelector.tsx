import React, { FC } from "react";
import { Box, Button, Typography } from "@mui/material";

interface ButtonSelectorProps {
  title: string;
  options: string[];
  onChange: (option: string) => void;
}

const ButtonSelector: FC<ButtonSelectorProps> = ({
  title,
  options,
  onChange,
}) => {
  const [selectedOption, setSelectedOption] = React.useState<string>("");

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    onChange(selectedOption);
  };

  return (
    <>
      <Typography>{title}</Typography>
      <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
        {options.map((option, i) => (
          <Button
            key={i}
            fullWidth
            variant={selectedOption === option ? "contained" : "outlined"}
            color={selectedOption === option ? "primary" : "inherit"}
            onClick={() => handleOptionChange(option)}
            sx={{ minWidth: 100, borderColor: "#ccc", p: 1 }}
          >
            {option}
          </Button>
        ))}
      </Box>
    </>
  );
};

export default ButtonSelector;