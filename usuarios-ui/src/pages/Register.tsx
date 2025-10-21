// src/components/Register.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserSchema, type CreateUserDTO } from "../dto/user.dto";
import { cadastrarUsuario } from "../services/user.service";
import styles from './Register.module.scss';

export default function Register() {
  const [formData, setFormData] = useState<CreateUserDTO>({
    name: "",
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateUserDTO, string>>>({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (field: keyof CreateUserDTO, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = createUserSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CreateUserDTO, string>> = {};
      result.error.issues.forEach(issue => {
        const field = issue.path[0] as keyof CreateUserDTO;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await cadastrarUsuario(result.data);
      navigate("/");
    } catch {
      setError("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.registerWrapper}>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        <h1 className={styles.title}>Criar Conta</h1>

        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Nome completo"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>

        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Senha"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>

        {error && <p className={styles.formError}>{error}</p>}

        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? "Criando conta..." : "Cadastrar"}
        </button>

        <p className={styles.switchText}>
          Já tem conta?{" "}
          <button type="button" onClick={() => navigate("/")} className={styles.link}>
            Faça login
          </button>
        </p>
      </form>
    </div>
  );
}
