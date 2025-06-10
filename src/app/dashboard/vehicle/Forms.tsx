"use client"
import React from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { zodResolver } from '@hookform/resolvers/zod';

// Esquema de usuário para validação
const vehicleSchema = z.object({
  id: z.string().optional(),
  make: z.string().min(1, { message: "Este campo é obrigatório" }),
  model: z.string().min(1, { message: "Este campo é obrigatório" }),
  year: z.string().min(4, { message: "Formato invalido!" }),
  eixo: z.string().min(1, { message: "Este campo é obrigatório" }),
  plate: z.string().min(7, { message: "Este campo é obrigatório" }).max(7, { message: "Este campo é obrigatório" }),
  tacografo: z.boolean({ message: "Este campo é obrigatório" }),
  fixo: z.boolean({ message: "Este campo é obrigatório" }).optional().nullable(),
  cidadeBase: z.string({ message: "Este campo é obrigatório" }).optional().nullable(),
});
export type vehicleFormData = z.infer<typeof vehicleSchema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: vehicleFormData | null;
  onSubmit: (data?: vehicleFormData) => Promise<void>;
}

export default function VehicleModal({ isOpen, onClose, data, onSubmit }: UserModalProps) {

  const { watch, control, handleSubmit, reset, setValue,formState: { errors } } = useForm<vehicleFormData>({
    resolver: zodResolver(vehicleSchema)
  });

  const fixo = watch('fixo');
  React.useEffect(() => { reset(data || {}); }, [isOpen, data, reset]);
  React.useEffect(() => { setValue('cidadeBase',!fixo?null:data?.cidadeBase); }, [setValue, fixo, reset, data?.cidadeBase]);

  const handleFormSubmit = async (data: vehicleFormData) => {
    try {

      const method = data.id ? axios.put : axios.post; // Determine o método baseado na presença de `id`
      const response = await method('/api/v2/dashboard/vehicles', { ...data }); // Chame o método apropriado
      await onSubmit(response.data); // Lidar com a resposta
      onClose(); // Feche o formulário
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || 'Erro ao salvar'; // Obtenha a mensagem de erro
      Swal.fire({ icon: "error", title: "Oops...", text: errorMessage });
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth keepMounted={false} disablePortal={false} aria-labelledby={`vehicle`}>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogTitle>
          {data ? "Editar" : "Adicione"}
        </DialogTitle>
        <DialogContent>

          <Stack spacing={2} sx={{ mt: 2 }}>
            <Controller
              name="tacografo"
              control={control}
              defaultValue={data?.fixo||false}
              render={({ field }) => (
                <FormControl fullWidth>
                  <FormControlLabel control={<Checkbox checked={field.value} {...field} />} label="Possui Tacografo?" />
                </FormControl>
              )}
            />

            <Controller
              name="fixo"
              control={control}
              defaultValue={data?.fixo}
              render={({ field }) => (
                <FormControl fullWidth>
                  <FormControlLabel control={<Checkbox checked={field?.value||false} {...field} />} label="Veiculo de base?" />
                </FormControl>
              )}
            />

            {fixo && <Controller
              name="cidadeBase"
              defaultValue={data?.cidadeBase}
              control={control}
              rules={{ required: 'Campo obrigatório' }}
              render={({ field: { onChange, value, ...rest } }) => (
                <TextField
                  {...rest}
                  value={value || ''}
                  onChange={(e) => {
                    const uppercaseValue = e.target.value.toUpperCase();
                    onChange(uppercaseValue);
                  }}
                  fullWidth
                  label="Qual Cidade"
                  error={!!errors.plate}
                  helperText={errors.plate?.message}
                />
              )}
            />}

            <Controller
              name="plate"
              defaultValue=""
              control={control}
              rules={{
                required: 'Placa é obrigatória',
                pattern: {
                  value: /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/,
                  message: 'Placa inválida (formato: ABC1234)'
                }
              }}
              render={({ field: { onChange, value, ...rest } }) => (
                <TextField
                  {...rest}
                  value={value || ''}
                  onChange={({target}) => {
                    onChange(target.value.toUpperCase());
                  }}
                  slotProps={{ htmlInput: { maxLength: 7 } }}
                  fullWidth
                  label="Placa"
                  error={!!errors.plate}
                  helperText={errors.plate?.message}
                />
              )}
            />

            <Controller
              name="make"
              control={control}
              defaultValue=""
              rules={{ required: 'Campo obrigatório' }}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant='outlined'
                  label="Fabricante"
                  placeholder="Fabricante"
                  fullWidth
                  error={!!errors.make}
                  helperText={errors.make?.message}
                />)}
            />

            <Controller
              name="model"
              control={control}
              defaultValue=""
              rules={{ required: 'Campo obrigatório' }}
              render={({ field }) => (
                <TextField
                  variant='outlined'
                  label="Modelo" {...field}
                  placeholder="Modelo"
                  fullWidth
                  error={!!errors.model}
                  helperText={errors.model?.message}
                />)}
            />

            <Controller
              name="year"
              defaultValue={new Date().getFullYear().toString()}
              control={control}
              rules={{
                required: 'Ano é obrigatório',
                min: { value: 1900, message: 'Ano inválido' },
                max: { value: new Date().getFullYear(), message: 'Ano inválido' }
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="number"
                  label="Ano"
                  error={!!errors.year}
                  helperText={errors.year?.message}
                />
              )}
            />

            <Controller
              name="eixo"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel size="small" error={!!errors.eixo}>Eixos</InputLabel>
                  <Select {...field} label="Eixos">
                    <MenuItem value="1">Dianteira</MenuItem>
                    <MenuItem value="2">Tração</MenuItem>
                    <MenuItem value="3">Truck</MenuItem>
                    <MenuItem value="4">4 Eixo</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button id="cancel-button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">{data ? "Atualizar" : "Criar"}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}