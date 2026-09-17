import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm, type SubmitHandler } from "react-hook-form";
import z from "zod";

const FormInputsSchema = z.object({
  email: z.email("email is required"),
  firstName: z
    .string()
    .nonempty("first name cannot be empty")
    .min(2, "min lengh 2"),
  lastName: z
    .string()
    .nonempty("last name cannot be empty")
    .min(2, "min lengh 2"),
  password: z.string(),
  phoneNumber: z.union([z.string(), z.null()]).optional(),
});

type FormInputs = z.infer<typeof FormInputsSchema>;
const RegistrationForm = () => {
  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      const response = await axios.post("/api/customer", data);
      console.log(response.data);
    } catch (error) {
      // todo:
      console.log(error);
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    mode: "onBlur",
    resolver: zodResolver(FormInputsSchema),
  });
  return (
    <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
      <label>
        First Name
        <input {...register("firstName")} />
      </label>
      {errors.firstName && <p>{errors.firstName.message}</p>}
      <label>
        Last Name
        <input {...register("lastName")} />
      </label>
      <label>
        Email
        <input {...register("email")} />
      </label>
      <label>
        Password
        <input {...register("password")} />
      </label>
      <label>
        Phone Number
        <input {...register("phoneNumber")} />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default RegistrationForm;
