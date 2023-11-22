import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH (
    req: Request,
    { params } : { params: {storeId: string, categoryId: string } }
) {
    try {
        const { userId } = auth()
        const body = await req.json();
        
        const { nameEn,nameFr,nameSp, billboardId } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401})
        }
        if (!nameEn) {
            return new NextResponse("name in English is required", { status: 400})
        }
        if (!nameFr) {
            return new NextResponse("name in French is required", { status: 400})
        }
        if (!nameSp) {
            return new NextResponse("name in Spanish is required", { status: 400})
        }
        if (!billboardId) {
            return new NextResponse("billboard Id is required", { status: 400})
        }
        if (!params.categoryId) {
            return new NextResponse("Category Id is required", { status: 400})
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

        const category =  await prismadb.category.updateMany( {
            where: {
                id: params.categoryId
            },
            data: {
                nameEn,
                nameFr,
                nameSp,
                billboardId
            }
        });

        return NextResponse.json(category)

    } catch (error) {
        console.log('[CATEGORY_PATCH]', error)
        return new NextResponse("Internal error", { status: 500})
    }
    
}

export async function DELETE (
    req: Request,
    { params } : { params: {storeId: string, categoryId: string } }
) {
    try {
        const { userId } = auth()


        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401})
        }
        if (!params.categoryId) {
            return new NextResponse("category Id is required", { status: 400})
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

        const category =  await prismadb.category.deleteMany( {
            where: {
                id: params.categoryId
            }
        });
        return NextResponse.json(category)

    } catch (error) {
        console.log('[CATEGORY_DELETE]', error)
        return new NextResponse("Internal error", { status: 500})
    }
    
}

export async function GET (
    req: Request,
    { params } : { params: { categoryId: string } }
) {
    try {


        if (!params.categoryId) {
            return new NextResponse("category Id is required", { status: 400})
        }

        const category =  await prismadb.category.findUnique( {
            where: {
                id: params.categoryId
            },
            include: {
                billboard: {
                    include: {
                        images: true
                    }
                }
                
            }
        });
        return NextResponse.json(category)

    } catch (error) {
        console.log('[CATEGORY_GET]', error)
        return new NextResponse("Internal error", { status: 500})
    }
    
}