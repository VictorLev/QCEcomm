import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH (
    req: Request,
    { params } : { params: {storeId: string, cdayId: string } }
) {
    try {
        const { userId } = auth()
        const body = await req.json();
        
        const { name , valueEn, valueFr, valueSp } = body;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401})
        }
        if (!name) {
            return new NextResponse("Label is required", { status: 400})
        }
        if (!valueEn) {
            return new NextResponse("Image Url is required", { status: 400})
        }
        if (!params.cdayId) {
            return new NextResponse("cday Id is required", { status: 400})
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

        const cday =  await prismadb.cday.updateMany( {
            where: {
                id: params.cdayId
            },
            data: {
                name,
                valueEn, 
                valueFr, 
                valueSp,
            }
        });

        return NextResponse.json(cday)

    } catch (error) {
        console.log('[CDAY_PATCH]', error)
        return new NextResponse("Internal error", { status: 500})
    }
    
}

export async function DELETE (
    req: Request,
    { params } : { params: {storeId: string, cdayId: string } }
) {
    try {
        const { userId } = auth()


        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401})
        }
        if (!params.cdayId) {
            return new NextResponse("cday Id is required", { status: 400})
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

        const cday =  await prismadb.cday.deleteMany( {
            where: {
                id: params.cdayId
            }
        });
        return NextResponse.json(cday)

    } catch (error) {
        console.log('[CDAY_DELETE]', error)
        return new NextResponse("Internal error", { status: 500})
    }
    
}

export async function GET (
    req: Request,
    { params } : { params: { cdayId: string } }
) {
    try {


        if (!params.cdayId) {
            return new NextResponse("cday Id is required", { status: 400})
        }

        const cday =  await prismadb.cday.findUnique( {
            where: {
                id: params.cdayId
            }
        });
        return NextResponse.json(cday)

    } catch (error) {
        console.log('[CDAY_GET]', error)
        return new NextResponse("Internal error", { status: 500})
    }
    
}