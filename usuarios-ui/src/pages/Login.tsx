import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginSchema } from '../dto/user.dto';
import type { LoginDTO } from "../dto/user.dto";
import { loginUser } from "../services/user.service";
import styles from './Login.module.scss';
import { SquareUserRound, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState<LoginDTO>({ email: "", password: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof LoginDTO, string>>>({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (field: keyof LoginDTO, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof LoginDTO, string>> = {};
      result.error.issues.forEach(issue => {
        const field = issue.path[0] as keyof LoginDTO;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const { token } = await loginUser(result.data);
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } catch {
      setError("Credenciais inválidas");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.icon}>
          <SquareUserRound />
        </div>
        <h1 className={styles.title}>Bem-vindo</h1>

        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label>Senha</label>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
            />
            <button
              type="button"
              className={styles.eyeButton}
              onClick={() => setShowPassword(prev => !prev)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>

        {error && <p className={styles.formError}>{error}</p>}

        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? "Entrando..." : "Entrar"}
        </button>

        <p className={styles.switchText}>
          Não tem conta?{" "}
          <button type="button" onClick={() => navigate("/cadastro")} className={styles.link}>
            Cadastre-se
          </button>
        </p>
      </form>
    </div>
  );
}
