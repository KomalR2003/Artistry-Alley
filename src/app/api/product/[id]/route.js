import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import ProductModel from "@/app/models/ProductModel";

// GET - Get single product by ID
export async function GET(request, { params }) {
    try {
        await dbConnect();

        const { id } = await params;

        const product = await ProductModel.findById(id).populate('artistId', 'username email');

        if (!product) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            product
        });

    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch product",
                error: error.message
            },
            { status: 500 }
        );
    }
}

// PUT - Update product by ID
export async function PUT(request, { params }) {
    try {
        await dbConnect();

        const { id } = await params;
        const updateData = await request.json();

        // Find existing product
        const existingProduct = await ProductModel.findById(id);
        if (!existingProduct) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        // If updating size, validate the structure
        if (updateData.size) {
            if (!updateData.size.height || !updateData.size.width) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Size must include height and width"
                    },
                    { status: 400 }
                );
            }
        }

        // If updating reference number, check for duplicates
        if (updateData.referenceno && updateData.referenceno !== existingProduct.referenceno) {
            const duplicate = await ProductModel.findOne({
                referenceno: updateData.referenceno,
                _id: { $ne: id }
            });

            if (duplicate) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Product with this reference number already exists"
                    },
                    { status: 409 }
                );
            }
        }

        // Update the product
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        return NextResponse.json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to update product",
                error: error.message
            },
            { status: 500 }
        );
    }
}

// DELETE - Delete single product by ID
export async function DELETE(request, { params }) {
    try {
        await dbConnect();

        const { id } = await params;
        const { searchParams } = new URL(request.url);

        // Find the product
        const product = await ProductModel.findById(id);
        if (!product) {
            return NextResponse.json(
                { success: false, message: "Product not found" },
                { status: 404 }
            );
        }

        // Soft delete (recommended) - just update status to "archived"
        const softDelete = searchParams.get("soft") !== "false"; // Default to soft delete

        if (softDelete) {
            // Soft delete - change status to archived
            const archivedProduct = await ProductModel.findByIdAndUpdate(
                id,
                { $set: { status: "archived", inStock: false } },
                { new: true }
            );

            return NextResponse.json({
                success: true,
                message: "Product archived successfully",
                product: archivedProduct
            });
        } else {
            // Hard delete - permanently remove from database
            await ProductModel.findByIdAndDelete(id);

            return NextResponse.json({
                success: true,
                message: "Product permanently deleted"
            });
        }

    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete product",
                error: error.message
            },
            { status: 500 }
        );
    }
}
