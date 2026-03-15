import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import ProductModel from "@/app/models/ProductModel";
import OrderModel from "@/app/models/OrderModel";

export async function GET(request) {
    try {
        await dbConnect();

        // Fetch all products with artist details
        const products = await ProductModel.find({})
            .populate('artistId', 'name username email profilePicture')
            .sort({ createdAt: -1 });

        // Calculate sales stats per product using OrderModel
        const orders = await OrderModel.find({ status: { $in: ['confirmed', 'processing', 'shipped', 'delivered'] } });

        const productsWithStats = products.map(product => {
            let totalSold = 0;
            orders.forEach(order => {
                order.items.forEach(item => {
                    if (item.productId && item.productId.toString() === product._id.toString()) {
                        totalSold += (item.quantity || 1);
                    }
                });
            });

            return {
                ...product.toObject(),
                totalSold
            };
        });

        return NextResponse.json({
            success: true,
            data: productsWithStats
        });
    } catch (error) {
        console.error("Admin Products GET error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch products" },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const productId = searchParams.get('id');

        if (!productId) {
            return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
        }

        const deletedProduct = await ProductModel.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Admin Products DELETE error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to delete product" },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        await dbConnect();
        const data = await request.json();
        const { id, productname, category, description, medium, orientation, yearCreated, price, originalPrice, stock, inStock, status } = data;

        if (!id) {
            return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            { productname, category, description, medium, orientation, yearCreated: Number(yearCreated) || 0, price: Number(price) || 0, originalPrice: Number(originalPrice) || 0, stock: Number(stock) || 1, inStock, status },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: updatedProduct,
            message: "Product updated successfully"
        });
    } catch (error) {
        console.error("Admin Products PUT error:", error);
        return NextResponse.json(
            { success: false, message: "Failed to update product" },
            { status: 500 }
        );
    }
}
