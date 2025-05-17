// types/user.ts
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Nome é obrigatório'),
  username: z.string().min(3,'Usuário é obrigatorio'),
  email: z.string().email('Email inválido').optional().nullable(),
  role: z.enum(['USER', 'ADMIN', 'DRIVER']),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  createdAt: z.date(),
  image: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

export type UserCreateInput = Omit<User, 'id' | 'createdAt'>;
export type UserUpdateInput = Partial<Omit<User, 'id' | 'createdAt'>> & { id: string };