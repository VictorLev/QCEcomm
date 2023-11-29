import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH (
    req: Request,
    { params } : { params: {storeId: string, typeId: string } }
) {
    try {
        const { userId } = auth()
        const body = await req.json();
        
        const { name , value } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401})
        }
        if (!name) {
            return new NextResponse("Label is required", { status: 400})
        }
        if (!value) {
            return new NextResponse("Image Url is required", { status: 400})
        }
        if (!params.typeId) {
            return new NextResponse("type Id is required", { status: 400})
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

        const type =  await prismadb.type.updateMany( {
            where: {
                id: params.typeId
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(type)

    } catch (error) {
        console.log('[TYPE_PATCH]', error)
        return new NextResponse("Internal error", { status: 500})
    }
    
}

export async function DELETE (
    req: Request,
    { params } : { params: {storeId: string, typeId: string } }
) {
    try {
        const { userId } = auth()


        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401})
        }
        if (!params.typeId) {
            return new NextResponse("type Id is required", { status: 400})
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

        const type =  await prismadb.type.deleteMany( {
            where: {
                id: params.typeId
            }
        });
        return NextResponse.json(type)

    } catch (error) {
        console.log('[TYPE_DELETE]', error)
        return new NextResponse("Internal error", { status: 500})
    }
    
}

export async function GET (
    req: Request,
    { params } : { params: { typeId: string } }
) {
    try {


        if (!params.typeId) {
            return new NextResponse("type Id is required", { status: 400})
        }

        const type =  await prismadb.type.findUnique( {
            where: {
                id: params.typeId
            }
        });
        return NextResponse.json(type)

    } catch (error) {
        console.log('[TYPE_GET]', error)
        return new NextResponse("Internal error", { status: 500})
    }
    
}