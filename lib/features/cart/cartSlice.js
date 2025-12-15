import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        total: 0,
        cartItems: {}, // { productId: { product: {...}, quantity: 1 } }
    },
    reducers: {
        addToCart: (state, action) => {
            const { productId, product } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId].quantity++
            } else {
                state.cartItems[productId] = {
                    product: product,
                    quantity: 1
                }
            }
            state.total += 1
        },
        removeFromCart: (state, action) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId].quantity--
                if (state.cartItems[productId].quantity === 0) {
                    delete state.cartItems[productId]
                }
                state.total -= 1
            }
        },
        deleteItemFromCart: (state, action) => {
            const { productId } = action.payload
            state.total -= state.cartItems[productId] ? state.cartItems[productId].quantity : 0
            delete state.cartItems[productId]
        },
        clearCart: (state) => {
            state.cartItems = {}
            state.total = 0
        },
    }
})

export const { addToCart, removeFromCart, clearCart, deleteItemFromCart } = cartSlice.actions

export default cartSlice.reducer
