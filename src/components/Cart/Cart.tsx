import { useContext } from "react";
import {
  CART_ACTIONS,
  CartContext,
  type CartAction,
  type CartItem,
} from "../../context/cartContext";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const CartListItem = ({
  cartItem,
  dispatch,
}: {
  cartItem: CartItem;
  dispatch: React.ActionDispatch<[action: CartAction]> | null;
}) => {
  return (
    <li>
      <span>{cartItem.menuItem.name}</span>
      <span> x{cartItem.quantity}</span>
      <span> - ${cartItem.menuItem.price}</span>
      <br />
      {dispatch && (
        <Button
          onClick={() => {
            dispatch({
              type: CART_ACTIONS.decrement,
              cartItem: cartItem,
            });
          }}
        >
          -
        </Button>
      )}
      {dispatch && (
        <Button
          onClick={() =>
            dispatch({
              type: CART_ACTIONS.increment,
              cartItem: cartItem,
            })
          }
        >
          +
        </Button>
      )}

      {dispatch && (
        //  todo: only display when quantity>0
        <Button
          onClick={() => {
            dispatch({
              type: CART_ACTIONS.removeItem,
              cartItem: cartItem,
            });
          }}
        >
          delete
        </Button>
      )}
    </li>
  );
};

const Cart = () => {
  const {
    cartState: { items },
    cartDispatch,
  } = useContext(CartContext);

  return (
    <div>
      <h2>Cart</h2>
      {items.length === 0 ? (
        <p>cart is empty.</p>
      ) : (
        <ul>
          {items.map((item) => (
            <CartListItem
              key={item.menuItem.id}
              cartItem={item}
              dispatch={cartDispatch}
            />
          ))}
        </ul>
      )}
      <Button>
        <Link to={"/checkout"}>Checkout</Link>
      </Button>
    </div>
  );
};

export default Cart;
