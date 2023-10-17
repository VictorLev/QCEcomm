import prismadb from "@/lib/prismadb"
import { BillboardClient } from "./components/client"
import { Whisper } from "next/font/google";
import { BillboardColumn } from "./components/columns";



const BillboardsPage = async ( {
    params 
} : {
    params: { storeId: string}
}) => {
    const billboards = await prismadb.billboard.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
        id: item.id,
        label: item.label,
        createAt: item.
    }))

    return(
        <div className="flex-col">
            <div className="flex-1 spaxe-y-4 p-8 pt-6">
                <BillboardClient data={billboards}/>
            </div>
        </div>
    )
}

export default BillboardsPage