import { createContext } from "react";
import z from "zod";
import { zodMenuItemSchema } from "../types";

export const CART_ACTIONS = {
  increment: "increment",
  decrement: "decrement",
  removeItem: "delete",
  load: "load",
  add:"addToCart"
} as const;

export type CartActionType = (typeof CART_ACTIONS)[keyof typeof CART_ACTIONS];

export interface CartAction {
  type: CartActionType;
  cartItem?: CartItem;
  cart?: CartState;
}
const zodCartItemSchema = z.object({
  menuItem: zodMenuItemSchema,
  quantity: z.coerce.number(),
});
export type CartItem = z.infer<typeof zodCartItemSchema>;
export const zodCartStateSchema = z.object({
  items: zodCartItemSchema.array(),
});
export type CartState = z.infer<typeof zodCartStateSchema>;

interface CartContextValue {
  cartState: CartState;
  cartDispatch: React.ActionDispatch<[action: CartAction]> | null;
}

export const CartContext = createContext<CartContextValue>({
  cartState: { items: [] },
  cartDispatch: null,

});
