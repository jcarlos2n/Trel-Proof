import { emailExists } from "./queries";

export async function validate(email: string, password: string) {
  let errors: { email?: string; password?: string } = {};

  if (!email) {
    errors.email = "Email is required.";
  } else if (!email.includes("@")) {
    errors.email = "Introduce una email valido";
  }

  if (!password) {
    errors.password = "Contraseña requerida";
  }

  if (password.length < 6) {
    errors.password = "La contraseña tiene que tener al menos 6 carácteres";
  }

  if (!errors.email && (await emailExists(email))) {
    errors.email = "Este email ya existe";
  }

  return Object.keys(errors).length ? errors : null;
}