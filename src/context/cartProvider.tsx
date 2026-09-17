import { useEffect, useReducer, type ReactNode } from "react";
import {
  CART_ACTIONS,
  zodCartStateSchema,
  type CartAction,
  type CartItem,
  type CartState,
} from "../context/cartContext";
import { assertNever } from "../lib/utils";
import { CartContext } from "./cartContext";
import type { MenuItem } from "../components/MenuPage";
const removeItem = (prevState: CartState, actionItem: MenuItem) => {
  return {
    ...prevState,
    items: prevState.items.filter(
      (prevItem) => prevItem.menuItem.id !== actionItem.id,
    ),
  };
};
const addNewItem = (
  prevState: CartState,
  actionItem: CartItem,
  quantity: number,
): CartState => {
  return {
    ...prevState,
    items: [
      ...prevState.items,
      { menuItem: { ...actionItem.menuItem }, quantity: quantity },
    ],
  };
};
const updateQuantity = (
  prevState: CartState,
  actionItem: CartItem,
  quantity: number,
) => {
  return {
    ...prevState,
    items: prevState.items.map<CartItem>((prevItem) => {
      return prevItem.menuItem.id === actionItem.menuItem.id
        ? { ...prevItem, quantity: prevItem.quantity + quantity }
        : prevItem;
    }),
  };
};
const cartReducer = (prevState: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case CART_ACTIONS.increment: {
      if (!action.cartItem) {
        return prevState;
      }
      const actionItem = action.cartItem;
      const existingItem = prevState.items.find(
        (i) => i.menuItem.id === actionItem.menuItem.id,
      );
      if (!existingItem) {
        return addNewItem(prevState, actionItem, 1);
      }
      return updateQuantity(prevState, actionItem, 1);
    }
    case CART_ACTIONS.decrement: {
      if (!action.cartItem) {
        return prevState;
      }
      const actionItem = action.cartItem;
      const existingItem = prevState.items.find(
        (i) => i.menuItem.id === actionItem.menuItem.id,
      );
      if (!existingItem) {
        return prevState;
      }
      if (existingItem.quantity <= 1) {
        return removeItem(prevState, actionItem.menuItem);
      }
      return updateQuantity(prevState, actionItem, -1);
    }
    case CART_ACTIONS.removeItem:
      return action.cartItem
        ? removeItem(prevState, action.cartItem.menuItem)
        : prevState;
    case CART_ACTIONS.load: {
      return action.cart ? action.cart : prevState;
    }
    case CART_ACTIONS.add: {
      if (!action.cartItem || action.cartItem?.quantity <= 0) {
        return prevState;
      }
      const actionItem = action.cartItem;
      const existingItem = prevState.items.find(
        (i) => i.menuItem.id === actionItem.menuItem.id,
      );
      if (!existingItem) {
        return addNewItem(prevState, actionItem, actionItem.quantity);
      }
      return updateQuantity(prevState, actionItem, actionItem.quantity);
    }
    default:
      return assertNever(action.type);
  }
};
const loadCart = (): CartState => {
  const localCartString = window.localStorage.getItem("cart");
  if (!localCartString) {
    return { items: [] };
  }
  try {
    return zodCartStateSchema.parse(JSON.parse(localCartString));
  } catch (error) {
    // todo
    console.log(error);
    return { items: [] };
  }
};
const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartState, cartDispatch] = useReducer(
    cartReducer,
    undefined,
    loadCart,
  );

  useEffect(() => {
    window.localStorage.setItem("cart", JSON.stringify(cartState));
  }, [cartState]);

  return (
    <CartContext.Provider value={{ cartState, cartDispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
