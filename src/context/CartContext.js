'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('artistry_cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (error) {
                console.error('Failed to parse cart from localStorage:', error);
                localStorage.removeItem('artistry_cart');
            }
        }
        setIsLoaded(true);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('artistry_cart', JSON.stringify(cart));
        }
    }, [cart, isLoaded]);

    // Add item to cart
    const addToCart = (product) => {
        setCart(prevCart => {
            // Check if product already in cart
            const existingItem = prevCart.find(item => item._id === product._id);

            if (existingItem) {
                toast.error('Product already in cart');
                return prevCart;
            }

            // Check stock availability
            if (!product.inStock || product.stock < 1) {
                toast.error('Product is out of stock');
                return prevCart;
            }

            toast.success('Added to cart!');
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    // Remove item from cart
    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item._id !== productId));
        toast.success('Removed from cart');
    };

    // Update quantity
    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;

        setCart(prevCart =>
            prevCart.map(item => {
                if (item._id === productId) {
                    // Check if new quantity exceeds stock
                    if (quantity > item.stock) {
                        // Show different messages based on stock level
                        if (item.stock === 1) {
                            toast.error(`Only 1 product is available`);
                        } else if (item.stock === 2) {
                            toast.error(`Only 2 products are available`);
                        } else {
                            toast.error(`Only ${item.stock} products are available`);
                        }
                        return item;
                    }

                    // Show success message when incrementing
                    if (quantity > item.quantity) {
                        toast.success(`Quantity updated to ${quantity}`);
                    }

                    return { ...item, quantity };
                }
                return item;
            })
        );
    };

    // Clear cart
    const clearCart = () => {
        setCart([]);
        localStorage.removeItem('artistry_cart');
        toast.success('Cart cleared');
    };

    // Calculate totals
    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    // Check if product is in cart
    const isInCart = (productId) => {
        return cart.some(item => item._id === productId);
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartCount,
            isInCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};
