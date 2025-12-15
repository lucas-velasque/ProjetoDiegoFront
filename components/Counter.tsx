'use client'
import { addToCart, removeFromCart } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";

interface CounterProps {
    productId: string;
}

const Counter: React.FC<CounterProps> = ({ productId }) => {

    const { cartItems } = useSelector((state: RootState) => state.cart);

    const dispatch = useDispatch();

    const addToCartHandler = () => {
        // Pega o produto do cartItems para incrementar
        const product = cartItems[productId]?.product;
        if (product) {
            dispatch(addToCart({ productId, product }))
        }
    }

    const removeFromCartHandler = () => {
        dispatch(removeFromCart({ productId }))
    }

    return (
        <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600">
            <button onClick={removeFromCartHandler} className="p-1 select-none">-</button>
            <p className="p-1">{cartItems[productId]?.quantity || 0}</p>
            <button onClick={addToCartHandler} className="p-1 select-none">+</button>
        </div>
    )
}

export default Counter
