"use client"
import React from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, Stack, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';

// User schema for validation
const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  username: z.string().min(3, { message: "Username deve ter pelo menos 3 caracteres" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }).optional(),
  role: z.enum(['ADMIN', 'USER', 'DRIVER'], {
    errorMap: () => ({ message: "Selecione um perfil válido" })
  }),
  isActive: z.any().optional()
});

export type UserFormData = z.infer<typeof userSchema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserFormData | null;
  onSubmit: (data?: UserFormData) => Promise<void> | void;
}

export default function UserModal({
  isOpen,
  onClose,
  user,
  onSubmit
}: UserModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: user || {
      name: '',
      username: '',
      password: '',
      role: 'USER',
      isActive: 'true'
    }
  });

  React.useEffect(() => {
    if (isOpen) {
      if (user) {
        reset({ ...user, isActive: user?.isActive ? 'true' : 'false' });
      } else {
        reset({
          name: '',
          username: '',
          password: '',
          role: 'USER',
          isActive: 'true'
        });
      }
    }
  }, [isOpen, user, reset]);

  const handleFormSubmit = async (data: UserFormData) => {
    try {
      let response;
      const isActive = data.isActive === "true" ? true : false;
      if (!data.id) {
        response = await axios.post('/api/v2/dashboard/users', { ...data, isActive });
      } else {
        response = await axios.put('/api/v2/dashboard/users', { ...data, isActive });
      }
      await onSubmit(response.data);
      reset();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar usuário', error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>
          {user ? "Editar usuário" : "Adicione novo usuário"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (<TextField variant='outlined' label="Nome" {...field} placeholder="Nome completo" fullWidth />)}
            />
            {errors.name && (<Typography color="error">{errors.name.message}</Typography>)}

            <Controller
              name="username"
              control={control}
              render={({ field }) => (<TextField variant='outlined' label="Usuario" {...field} placeholder="Usuário para login" fullWidth />)}
            />
            {errors.username && (<Typography color="error">{errors.username.message}</Typography>)}

            <Controller
              name="password"
              control={control}
              render={({ field }) => (<TextField variant='outlined' label="Senha" {...field} placeholder="********" fullWidth helperText={user ? "Deixe em branco para manter a senha atual" : ""} />)}
            />
            {errors.password && (<Typography color="error">{errors.password.message}</Typography>)}

            <Controller
              name="role"
              control={control}
              render={({ field }) => (<>
                <Typography variant='body2'>Perfil</Typography>
                <Select {...field} fullWidth>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="USER">Usuário</MenuItem>
                  <MenuItem value="DRIVER">Motorista</MenuItem>
                </Select>
              </>)}
            />
            {errors.role && (<Typography color="error">{errors.role.message}</Typography>)}
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <>
                  <Typography  variant='body2'>Status</Typography>
                  <Select {...field} fullWidth>
                    <MenuItem value="true">Ativo</MenuItem>
                    <MenuItem value="false">Inativo</MenuItem>
                  </Select>
                  {errors.role && (<Typography color="error">{errors.role.message}</Typography>)}
                </>
              )}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">{user ? "Atualizar" : "Criar"}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}