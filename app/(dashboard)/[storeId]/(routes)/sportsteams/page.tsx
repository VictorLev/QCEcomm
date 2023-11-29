import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { SportsteamClient } from "./components/client"
import { SportsteamColumn } from "./components/columns";



const SportsteamsPage = async ( {
    params 
} : {
    params: { storeId: string}
}) => {
    const sportsteams = await prismadb.sportsteam.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedBSportsteams: SportsteamColumn[] = sportsteams.map((item) => ({
        id: item.id,
        name: item.name,
        value: item.value,
        createAt: format(item.createdAt, "MMMM do, yyy")
    }))

    return(
        <div className="flex-col">
            <div className="flex-1 spaxe-y-4 p-8 pt-6">
                <SportsteamClient data={formattedBSportsteams}/>
            </div>
        </div>
    )
}

export default SportsteamsPage