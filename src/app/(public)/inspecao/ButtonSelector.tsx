import React from 'react';
import { Box, Button } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';

const ButtonSelector = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      client: ''
    }
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex', 
        gap: 2, 
        alignItems: 'center',
        width: '100%'
      }}
    >
      <Controller
        name="client"
        control={control}
        render={({ field }) => (
          <Button
            {...field}
            value="NATURA"
            variant="contained"
            color="primary"
            sx={{
              flex: 1, 
              backgroundColor: field.value === 'NATURA' ? '#6A5ACD' : undefined
            }}
          >
            NATURA
          </Button>
        )}
      />
      <Controller
        name="client"
        control={control}
        render={({ field }) => (
          <Button
            {...field}
            value="AVON"
            variant="contained"
            color="secondary"
            sx={{
              flex: 1,
              backgroundColor: field.value === 'AVON' ? '#6A5ACD' : undefined
            }}
          >
            AVON
          </Button>
        )}
      />
    </Box>
  );
};

export default ButtonSelector;