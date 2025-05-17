// components/InputFile.js
import React, { useRef, useState } from 'react';
import { Button, Box, Typography } from '@mui/material';
import Image from 'next/image';

interface InputFileProps {
    name?: string;
    label?: string | React.ReactNode | null;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean | string | null;
    helperText?: string | null;
    value?: string | null;
}

const InputFile: React.FC<InputFileProps> = ({ label, name, error, helperText, value, onChange }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [image, setImage] = useState<string | ArrayBuffer | null>(value ?? null);

    const handleCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0]) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result);
            reader.readAsDataURL(file);
            onChange(event)
        }
    };

    return (
        <Box mt={2}>
            <input
                name={name}
                type="file"
                accept="image/*"
                capture={true}
                ref={fileInputRef}
                onChange={handleCapture}
                style={{ display: 'none' }}
            />
            <Button variant="contained" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
                {label}
            </Button>
            {image && (
                <Box mt={2} sx={{maxHeight:100, textAlign:'center'}}>
                    {typeof image === 'string' && (
                        <Image src={image} alt="Captured" layout="responsive" width={50} height={50} style={{borderRadius: '8px',maxHeight:"100px", maxWidth:'100px' }} />
                    )}
                </Box>
            )}
            {error && <Typography color="error" variant="caption">{helperText}</Typography>}
        </Box>
    );
};

export default InputFile;