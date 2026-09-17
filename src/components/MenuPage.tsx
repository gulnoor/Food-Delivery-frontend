import axios from "axios";
import { useContext, useEffect, useState } from "react";
import z from "zod";
import Cart from "./Cart/Cart";
import {
  CART_ACTIONS,
  CartContext,
  type CartAction,
} from "../context/cartContext";
import { zodMenuItemSchema } from "../types";
import { Button } from "./ui/button";

const zodMenuSchema = z.array(zodMenuItemSchema);
export type MenuItem = z.infer<typeof zodMenuItemSchema>;

type Menu = z.infer<typeof zodMenuSchema>;

const MenuItemCard = ({
  item,
  dispatch,
}: {
  item: MenuItem;
  dispatch: React.ActionDispatch<[action: CartAction]> | null;
}) => {
  const [quantity, setQuantity] = useState(0);

  return (
    <article>
      {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
      <h2>{item.name}</h2>
      {item.description && <p>{item.description}</p>}
      <p>${item.price.toFixed(2)}</p>
      {dispatch && (
        <Button
          onClick={() => {
            setQuantity(quantity + 1);
          }}
        >
          +
        </Button>
      )}
      <span>{quantity}</span>
      {dispatch && (
        <Button
          onClick={() => {
            if (quantity > 0) {
              setQuantity(quantity - 1);
            }
          }}
        >
          -
        </Button>
      )}

      {dispatch && (
        //  todo: only display when quantity>0
        <Button
          onClick={() => {
            dispatch({
              type: CART_ACTIONS.add,
              cartItem: { menuItem: item, quantity: quantity },
            });
          }}
        >
          Add To Cart
        </Button>
      )}
    </article>
  );
};

const MenuPage = () => {
  const [menu, setMenu] = useState<Menu>([]);
  const { cartDispatch } = useContext(CartContext);
  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await axios.get("/api/menu");
        setMenu(zodMenuSchema.parse(response.data));
      } catch (error: unknown) {
        console.log(error);
      }
    }
    void fetchMenu();
  }, []);
  return (
    <main>
      <Cart />
      <h1>Menu</h1>
      <section>
        {menu.map((item) => (
          <MenuItemCard
            key={`${item.name}-${item.price}`}
            item={item}
            dispatch={cartDispatch}
          />
        ))}
      </section>
    </main>
  );
};

export default MenuPage;
