import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { ProvinceClient } from "./components/client"
import { ProvinceColumn } from "./components/columns";



const ProvincesPage = async ( {
    params 
} : {
    params: { storeId: string}
}) => {
    const provinces = await prismadb.province.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedBProvinces: ProvinceColumn[] = provinces.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.valueEn,
        createAt: format(item.createdAt, "MMMM do, yyy")
    }))

    return(
        <div className="flex-col">
            <div className="flex-1 spaxe-y-4 p-8 pt-6">
                <ProvinceClient data={formattedBProvinces}/>
            </div>
        </div>
    )
}

export default ProvincesPage