import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH (
    req: Request,
    { params } : { params: {storeId: string, productId: string } }
) {
    try {
        const { userId } = auth()
        const body = await req.json();
        
        const { 
            nameEn,
            nameFr,
            nameSp,
            descriptionEn,
            descriptionFr,
            descriptionSp,
            price,
            categoryId,
            sizeId,
            images,
            colorId,
            provinceId,
            typeId,
            sportsteamId,
            cdayId,
            isFeatured,
            isArchived
        } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401})
        }
        if (!nameEn) {
            return new NextResponse("name in english is required", { status: 400})
        }
        if (!nameFr) {
            return new NextResponse("name in french is required", { status: 400})
        }
        if (!nameSp) {
            return new NextResponse("name in spanish is required", { status: 400})
        }

        if (!price) {
            return new NextResponse("price is required", { status: 400})
        }

        if (!categoryId) {
            return new NextResponse("category Id is required", { status: 400})
        }

        if (!sizeId) {
            return new NextResponse("size Id is required", { status: 400})
        }

        if (!images || !images.length) {
            return new NextResponse("Images are required", { status: 400})
        }

        if (!colorId) {
            return new NextResponse("color Id is required", { status: 400})
        }
        if (!params.productId) {
            return new NextResponse("product Id is required", { status: 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403})
        }

        await prismadb.product.update( {
            where: {
                id: params.productId
            },
            data: {
                nameEn,
                nameFr,
                nameSp,
                price,
                categoryId,
                colorId,
                sizeId,
                provinceId,
                typeId,
                sportsteamId,
                cdayId,
                images: {
                    deleteMany: {}
                },
                isArchived,
                isFeatured
            }
        });

        const product = await prismadb.product.update( {
            where: {
                id: params.productId
            },
            data: {
                nameEn,
                nameFr,
                nameSp,
                descriptionEn,
                descriptionFr,
                descriptionSp,
                price,
                categoryId,
                colorId,
                sizeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url:string })=> image)
                        ]
                    }
                },
                isArchived,
                isFeatured
            }
        });


        return NextResponse.json(product)

    } catch (error) {
        console.log('[PRODUCT_PATCH]', error)
        return new NextResponse("Internal error", { status: 500})
    }
    
}

export async function DELETE (
    req: Request,
    { params } : { params: {storeId: string, productId: string } }
) {
    try {
        const { userId } = auth()


        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401})
        }
        if (!params.productId) {
            return new NextResponse("product Id is required", { status: 400})
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if(!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403})
        }

        const product =  await prismadb.product.deleteMany( {
            where: {
                id: params.productId
            }
        });
        return NextResponse.json(product)

    } catch (error) {
        console.log('[PRODUCT_DELETE]', error)
        return new NextResponse("Internal error", { status: 500})
    }
    
}

export async function GET (
    req: Request,
    { params } : { params: { productId: string } }
) {
    try {


        if (!params.productId) {
            return new NextResponse("product Id is required", { status: 400})
        }

        const product =  await prismadb.product.findUnique( {
            where: {
                id: params.productId
            },
            include : {
                images: true,
                category: true,
                size: true,
                color: true,
                province: true,
                cday: true,
                sportsteam: true,
                type: true
            }
        });
        return NextResponse.json(product)

    } catch (error) {
        console.log('[PRODUCT_GET]', error)
        return new NextResponse("Internal error", { status: 500})
    }
    
}