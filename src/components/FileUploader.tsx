import React, { ChangeEvent, useState } from "react";
import { styled } from "@mui/system";
import { Box, Chip, Typography } from "@mui/material";
import Image from "next/image";

// Styled components
const Container = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  border: "2px dashed #1976d2",
  borderRadius: "8px",
  backgroundColor: "#f5f5f5",
  transition: "border-color 0.3s",
  "&:hover": {
    borderColor: "#1565c0",
  },
});

const Input = styled("input")({
  display: "none",
});

const UploadButton = styled("label")({
  padding: "10px 20px",
  backgroundColor: "#1976d2",
  color: "#fff",
  borderRadius: "4px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#1565c0",
  },
});

interface Props {
  label: string | React.ReactNode | null;
  name: string;
  value?: string | null;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void | null;
  error?: boolean | string | null;
  helperText?: string | null;
  disabled?: boolean;
}

const FileUploader = ({ label, name, value, error, helperText, onChange, disabled }: Props) => {
  const [base64String, setBase64String] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Get the first file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string; // Cast result to string
        setBase64String("data:image/png;base64," + base64.split(",")[1]); // Remove the data URL part
        setFileName(file.name); // Store the file name
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  React.useEffect(()=>{
    if (onChange) {
      onChange({
        target: {
          name,
          value: base64String ?? null,
          type: 'text',
          checked: false,
          valueAsNumber: 0,
          valueAsDate: null
        }
      } as ChangeEvent<HTMLInputElement>);
    }
  },[base64String, fileName])

  React.useMemo(()=>{
    if (value) {
      setBase64String(value);
    }
  },[value])

  return (
    <Container>
      <Input accept="image/*" id={"fileUpload"+name||""} capture type="file" onChange={handleFileChange}/>
      <UploadButton htmlFor={"fileUpload"+name||""}>{label}</UploadButton>
      {!!value && (
        <div style={{ position: "relative" }}>
          <Image
            height={100}
            width={100}
            src={value}
            alt={name}
          />
        </div>
      )}
      {error && <Typography color="error" variant="caption">{helperText}</Typography>}
    </Container>
  );
};

export default FileUploader;