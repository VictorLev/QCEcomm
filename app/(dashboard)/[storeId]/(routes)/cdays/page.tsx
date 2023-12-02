import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { CdayClient } from "./components/client"
import { CdayColumn } from "./components/columns";



const CdaysPage = async ( {
    params 
} : {
    params: { storeId: string}
}) => {
    const cdays = await prismadb.cday.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedBCdays: CdayColumn[] = cdays.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.valueEn,
        createAt: format(item.createdAt, "MMMM do, yyy")
    }))

    return(
        <div className="flex-col">
            <div className="flex-1 spaxe-y-4 p-8 pt-6">
                <CdayClient data={formattedBCdays}/>
            </div>
        </div>
    )
}

export default CdaysPage