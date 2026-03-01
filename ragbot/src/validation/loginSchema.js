  import * as yup from "yup";

  export const loginSchema = yup.object({
    email: yup.string().email("Invalid email").required("Email required"),
    password: yup.string().min(6).required("Password required"),
  });
