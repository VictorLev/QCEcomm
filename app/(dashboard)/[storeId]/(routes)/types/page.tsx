import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { TypeClient } from "./components/client"
import { TypeColumn } from "./components/columns";



const TypesPage = async ( {
    params 
} : {
    params: { storeId: string}
}) => {
    const types = await prismadb.type.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedBTypes: TypeColumn[] = types.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createAt: format(item.createdAt, "MMMM do, yyy")
    }))

    return(
        <div className="flex-col">
            <div className="flex-1 spaxe-y-4 p-8 pt-6">
                <TypeClient data={formattedBTypes}/>
            </div>
        </div>
    )
}

export default TypesPage