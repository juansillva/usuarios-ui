import { z } from "zod";

// Cadastro
export const createUserSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;

// Login
export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});
export type LoginDTO = z.infer<typeof loginSchema>;

// Usuário retornado pela API
export type UserDTO = {
  id: string;
  name: string;
  email: string;
};
