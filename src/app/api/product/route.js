import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import ProductModel from "@/app/models/ProductModel";

// POST - Add new product
export async function POST(request) {
    try {
        await dbConnect();

        const body = await request.json();
        const {
            productname,
            category,
            description,
            price,
            referenceno,
            size,
            originalPrice,
            stock,
            inStock,
            artistId,
            artistName,
            medium,
            yearCreated,
            orientation,
            images,
            thumbnail,
            tags,
            featured,
            bestseller,
            status
        } = body;

        // Validate required fields
        if (!productname || !category || !description || !price || !referenceno || !size || !artistId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing required fields: productname, category, description, price, referenceno, size, and artistId are required"
                },
                { status: 400 }
            );
        }

        // Validate size object
        if (!size.height || !size.width) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Size must include height and width"
                },
                { status: 400 }
            );
        }

        // Check if reference number already exists
        const existingProduct = await ProductModel.findOne({ referenceno });
        if (existingProduct) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product with this reference number already exists"
                },
                { status: 409 }
            );
        }

        // Create new product
        const newProduct = new ProductModel({
            productname,
            category,
            description,
            price,
            referenceno,
            size: {
                height: size.height,
                width: size.width,
                unit: size.unit || "inches"
            },
            originalPrice,
            stock: stock || 1,
            inStock: inStock !== undefined ? inStock : true,
            artistId,
            artistName,
            medium,
            yearCreated,
            orientation,
            images: images || [],
            thumbnail,
            tags: tags || [],
            featured: featured || false,
            bestseller: bestseller || false,
            status: status || "active"
        });

        const savedProduct = await newProduct.save();

        return NextResponse.json(
            {
                success: true,
                message: "Product created successfully",
                product: savedProduct
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to create product",
                error: error.message
            },
            { status: 500 }
        );
    }
}

// GET - Get all products with filtering, search, and pagination
export async function GET(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);

        // Build query object for filtering
        const query = {};

        // Filter by artist
        const artistId = searchParams.get("artistId");
        if (artistId) {
            query.artistId = artistId;
        }

        // Filter by category
        const category = searchParams.get("category");
        if (category) {
            query.category = category;
        }

        // Filter by status
        const status = searchParams.get("status");
        if (status) {
            query.status = status;
        } else {
            // By default, only show active products
            query.status = "active";
        }

        // Filter by featured
        const featured = searchParams.get("featured");
        if (featured === "true") {
            query.featured = true;
        }

        // Filter by bestseller
        const bestseller = searchParams.get("bestseller");
        if (bestseller === "true") {
            query.bestseller = true;
        }

        // Search by product name or tags
        const search = searchParams.get("search");
        if (search) {
            query.$or = [
                { productname: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { tags: { $in: [new RegExp(search, "i")] } }
            ];
        }

        // Filter by price range
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Pagination
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 20;
        const skip = (page - 1) * limit;

        // Sorting
        const sortBy = searchParams.get("sortBy") || "createdAt";
        const order = searchParams.get("order") === "asc" ? 1 : -1;
        const sort = { [sortBy]: order };

        // Execute query
        const products = await ProductModel
            .find(query)
            .populate('artistId', 'username email')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const total = await ProductModel.countDocuments(query);

        return NextResponse.json({
            success: true,
            products,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch products",
                error: error.message
            },
            { status: 500 }
        );
    }
}

// DELETE - Delete all products (use with caution - for admin only)
export async function DELETE(request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const confirmDelete = searchParams.get("confirm");

        // Safety check - require confirmation
        if (confirmDelete !== "YES_DELETE_ALL") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Deletion not confirmed. Add ?confirm=YES_DELETE_ALL to delete all products"
                },
                { status: 400 }
            );
        }

        // Delete all products
        const result = await ProductModel.deleteMany({});

        return NextResponse.json({
            success: true,
            message: `Successfully deleted ${result.deletedCount} products`,
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.error("Error deleting all products:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete products",
                error: error.message
            },
            { status: 500 }
        );
    }
}
