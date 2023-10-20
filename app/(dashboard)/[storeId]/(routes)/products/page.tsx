import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { ProductClient } from "./components/client"
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";



const ProductsPage = async ( {
    params 
} : {
    params: { storeId: string}
}) => {
    const products = await prismadb.product.findMany({
        where: {
            storeId: params.storeId
        },
        include : {
            category:true,
            size:true,
            color:true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        price: formatter.format(item.price.toNumber()),
        isFeatured : item.isFeatured,
        isArchived : item.isArchived,
        category : item.category.name,
        size : item.size.name,
        color : item.color.value,
        createAt: format(item.createdAt, "MMMM do, yyy")
    }))

    return(
        <div className="flex-col">
            <div className="flex-1 spaxe-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts}/>
            </div>
        </div>
    )
}

export default ProductsPage