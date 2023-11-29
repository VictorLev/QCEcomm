import prismadb from "@/lib/prismadb";

import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function PATCH (
    req: Request,
    { params } : { params: {storeId: string, sportsteamId: string } }
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
        if (!params.sportsteamId) {
            return new NextResponse("sportsteam Id is required", { status: 400})
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

        const sportsteam =  await prismadb.sportsteam.updateMany( {
            where: {
                id: params.sportsteamId
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(sportsteam)

    } catch (error) {
        console.log('[SPORT_PATCH]', error)
        return new NextResponse("Internal error", { status: 500})
    }
    
}

export async function DELETE (
    req: Request,
    { params } : { params: {storeId: string, sportsteamId: string } }
) {
    try {
        const { userId } = auth()


        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401})
        }
        if (!params.sportsteamId) {
            return new NextResponse("sportsteam Id is required", { status: 400})
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

        const sportsteam =  await prismadb.sportsteam.deleteMany( {
            where: {
                id: params.sportsteamId
            }
        });
        return NextResponse.json(sportsteam)

    } catch (error) {
        console.log('[SPORT_DELETE]', error)
        return new NextResponse("Internal error", { status: 500})
    }
    
}

export async function GET (
    req: Request,
    { params } : { params: { sportsteamId: string } }
) {
    try {


        if (!params.sportsteamId) {
            return new NextResponse("sportsteam Id is required", { status: 400})
        }

        const sportsteam =  await prismadb.sportsteam.findUnique( {
            where: {
                id: params.sportsteamId
            }
        });
        return NextResponse.json(sportsteam)

    } catch (error) {
        console.log('[SPORT_GET]', error)
        return new NextResponse("Internal error", { status: 500})
    }
    
}