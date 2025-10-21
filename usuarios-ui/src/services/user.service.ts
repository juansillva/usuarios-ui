import  api  from "./api";
import type { CreateUserDTO, LoginDTO, UserDTO } from "../dto/user.dto";

// Cadastro
export const cadastrarUsuario = async (data: CreateUserDTO) => {
  const response = await api.post("/cadastro", data);
  return response.data;
};


// Login
export const loginUser = async (data: LoginDTO): Promise<{ token: string }> => {
  const response = await api.post("/login", data);
  return response.data;
};

// Listar todos usuários
export const getUsers = async (): Promise<UserDTO[]> => {
  const response = await api.get("/usuarios");
  return response.data;
};
