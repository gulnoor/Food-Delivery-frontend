import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";
import { UserContext } from "../context/contexts";
import { useContext, useState } from "react";
import { $ZodError } from "zod/v4/core";

const zodInputSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8, "must be at least 8 characters")
    .regex(/[a-z]/, "must include a lowercase letter")
    // .regex(/[A-Z]/, "must include an uppercase letter")
    .regex(/[^A-Za-z0-9]/, "must include a special character"),
});

const zodResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  token: z.string(),
});

type FormInputs = z.infer<typeof zodInputSchema>;

const LoginForm = () => {
  console.log("Rendering LoginForm...");
  const [submitError, setSubmitError] = useState("");
  const context = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(zodInputSchema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    console.log(data);
    try {
      const response = await axios.post(`/api/login`, data);
      const user = zodResponseSchema.parse(response.data);
      setUserContext(user);
      // todo: name change for security???
      // ! how to reduce XSS risk???
      window.localStorage.setItem("loggedInUser", JSON.stringify(user));
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof $ZodError) {
        setSubmitError(error.message);
      }
      // todo: better typescript usage and error handling
      else if (axios.isAxiosError(error)) {
        setSubmitError(
          error.response ? error.response.data.message : error.message,
        );
      } else {
        console.log("unknown error: ", error);
      }
    }
  };
  if (!context || context === null) {
    console.error("User Context unavailable");
    return null;
  }
  const { setUser: setUserContext } = context;
  return (
    /* "handleSubmit" will validate inputs before invoking "onSubmit" */
    <form
      onSubmit={(event) => {
        void handleSubmit(onSubmit)(event);
      }}
    >
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
      {/* {errors.form && <p>errors.form.message</p>} */}
      {submitError && <p>{submitError}</p>}
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
