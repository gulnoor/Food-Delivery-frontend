export { cn } from "cn"

export const assertNever = (value: never): never => {
  throw new Error(`Unhandled cart action: ${JSON.stringify(value)}`);
};