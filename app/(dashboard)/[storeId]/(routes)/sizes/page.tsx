import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { SizeClient } from "./components/client"
import { SizeColumn } from "./components/columns";



const SizesPage = async ( {
    params 
} : {
    params: { storeId: string}
}) => {
    const sizes = await prismadb.size.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedBSizes: SizeColumn[] = sizes.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createAt: format(item.createdAt, "MMMM do, yyy")
    }))

    return(
        <div className="flex-col">
            <div className="flex-1 spaxe-y-4 p-8 pt-6">
                <SizeClient data={formattedBSizes}/>
            </div>
        </div>
    )
}

export default SizesPage