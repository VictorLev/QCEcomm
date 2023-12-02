import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs"

import prismadb from "@/lib/prismadb";
import { tr } from "date-fns/locale";

export async function POST(
    req: Request,
    { params } : { params: { storeId : string } }
) {
    try {
        const { userId } = auth();
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
            return new NextResponse("Unauthenticated", { status: 401})
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
        if (!descriptionEn) {
            return new NextResponse("description in english is required", { status: 400})
        }

        if (!descriptionFr) {
            return new NextResponse("description in french is required", { status: 400})
        }
        if (!descriptionSp) {
            return new NextResponse("description in spanish is required", { status: 400})
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
            return new NextResponse("images is required", { status: 400})
        }

        if (!colorId) {
            return new NextResponse("color Id is required", { status: 400})
        }

        if (!params.storeId) {
            return new NextResponse("Store Id is required", { status: 400})
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


        const product =  await prismadb.product.create( {
            data: {
                nameEn,
                nameFr,
                nameSp,
                descriptionEn,
                descriptionFr,
                descriptionSp,
                price,
                isArchived,
                isFeatured,
                categoryId,
                colorId,
                sizeId,
                provinceId,
                typeId,
                sportsteamId,
                cdayId,
                storeId : params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url : string }) => image)
                        ]
                    }
                }
            }

        })

        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCT_POST]',error)
        return new NextResponse("Internal error", { status: 500});
    }
}

export async function GET(
    req: Request,
    { params } : { params: { storeId : string } }
) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get('categoryId') || undefined;
        const colorId = searchParams.get('colorId') || undefined;
        const sizeId = searchParams.get('sizeId') || undefined;
        const provinceId = searchParams.get('provinceId') || undefined;
        const typeId = searchParams.get('typeId') || undefined;
        const sportsteamId = searchParams.get('sportsteamId') || undefined;
        const cdayId = searchParams.get('cdayId') || undefined;

        const isFeatured = searchParams.get('isFeatured');
    

        if (!params.storeId) {
            return new NextResponse("Store Id is required", { status: 400})
        }



        const product =  await prismadb.product.findMany( {
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                provinceId,
                typeId,
                sportsteamId,
                cdayId,
                isFeatured: isFeatured? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true,
                province: true,
                cday:true,
                sportsteam:true,
                type:true
            },
            orderBy: {
                createdAt: 'desc'
            }

        })

        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCTS_GET]',error)
        return new NextResponse("Internal error", { status: 500});
    }
}