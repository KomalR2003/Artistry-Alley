import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import GalleryModel from "@/app/models/GalleryModel";

// POST - Add new gallery image
export async function POST(request) {
    try {
        await dbConnect();

        const body = await request.json();
        console.log('Received POST request body:', body);

        const {
            title,
            description,
            imageUrl,
            category,
            album,
            artistId,
            artistName,
            tags,
            featured,
        } = body;

        // Validate required fields
        if (!title || !imageUrl || !artistId) {
            console.error('Validation failed - missing fields:', {
                hasTitle: !!title,
                hasImageUrl: !!imageUrl,
                hasArtistId: !!artistId
            });
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing required fields: title, imageUrl, and artistId are required",
                    receivedFields: {
                        title: !!title,
                        imageUrl: !!imageUrl,
                        artistId: !!artistId
                    }
                },
                { status: 400 }
            );
        }

        // Validate MongoDB ObjectId format
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(artistId);
        if (!isValidObjectId) {
            console.error('Invalid ObjectId format:', artistId);
            return NextResponse.json(
                {
                    success: false,
                    message: `Invalid artistId format. Expected MongoDB ObjectId, received: ${artistId}`
                },
                { status: 400 }
            );
        }

        // Create new gallery image
        const newImage = new GalleryModel({
            title,
            description,
            imageUrl,
            category: category || "Uncategorized",
            album,
            artistId,
            artistName,
            tags: tags || [],
            featured: featured || false,
            status: "active"
        });

        console.log('Attempting to save gallery image...');
        const savedImage = await newImage.save();
        console.log('Gallery image saved successfully:', savedImage._id);

        return NextResponse.json(
            {
                success: true,
                message: "Gallery image added successfully",
                image: savedImage
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error adding gallery image:", error);
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);

        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message
            }));

            return NextResponse.json(
                {
                    success: false,
                    message: "Validation failed",
                    validationErrors
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: "Failed to add gallery image",
                error: error.message
            },
            { status: 500 }
        );
    }
}

// GET - Get all gallery images with filtering, search, and pagination
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

        // Filter by album
        const album = searchParams.get("album");
        if (album) {
            query.album = album;
        }

        // Filter by status
        const status = searchParams.get("status");
        if (status) {
            query.status = status;
        } else {
            // By default, only show active images
            query.status = "active";
        }

        // Filter by featured
        const featured = searchParams.get("featured");
        if (featured === "true") {
            query.featured = true;
        }

        // Search by title or tags
        const search = searchParams.get("search");
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { tags: { $in: [new RegExp(search, "i")] } }
            ];
        }

        // Pagination
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 50;
        const skip = (page - 1) * limit;

        // Sorting
        const sortBy = searchParams.get("sortBy") || "createdAt";
        const order = searchParams.get("order") === "asc" ? 1 : -1;
        const sort = { [sortBy]: order };

        // Execute query
        const images = await GalleryModel
            .find(query)
            .populate('artistId', 'username email')
            .sort(sort)
            .skip(skip)
            .limit(limit);

        // Ensure artistName is populated from User model if not already set
        const imagesWithArtistName = images.map(image => {
            const imageObj = image.toObject();
            // If artistName is not set but artistId is populated, use the username
            if (!imageObj.artistName && imageObj.artistId?.username) {
                imageObj.artistName = imageObj.artistId.username;
            }
            return imageObj;
        });

        // Get total count for pagination
        const total = await GalleryModel.countDocuments(query);

        return NextResponse.json({
            success: true,
            images: imagesWithArtistName,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("Error fetching gallery images:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch gallery images",
                error: error.message
            },
            { status: 500 }
        );
    }
}

// DELETE - Delete all gallery images (use with caution - for admin only)
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
                    message: "Deletion not confirmed. Add ?confirm=YES_DELETE_ALL to delete all images"
                },
                { status: 400 }
            );
        }

        // Delete all images
        const result = await GalleryModel.deleteMany({});

        return NextResponse.json({
            success: true,
            message: `Successfully deleted ${result.deletedCount} images`,
            deletedCount: result.deletedCount
        });

    } catch (error) {
        console.error("Error deleting all gallery images:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete gallery images",
                error: error.message
            },
            { status: 500 }
        );
    }
}
