import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";
import { BASE_URL } from "../configs";

const zodInputSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "must be at least 8 characters")
    .regex(/[a-z]/, "must include a lowercase letter")
    .regex(/[A-Z]/, "must include an uppercase letter")
    .regex(/[^A-Za-z0-9]/, "must include a special character"),
});
type FormInputs = z.infer<typeof zodInputSchema>;

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(zodInputSchema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    console.log(data);
    axios.post(`${BASE_URL}/login`);
  };

  return (
    /* "handleSubmit" will validate inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Email
        <input {...register("email")} />
      </label>
      {errors.email && <p>{errors.email.message}</p>}
      <label>
        Password
        <input {...register("password")} />
      </label>
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
