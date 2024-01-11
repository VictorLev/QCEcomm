import prismadb from "@/lib/prismadb";

interface GraphData {
    name: string,
    total: number
}


export const getGraphRevenue = async (storeId: string) => {
    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid:true
        },
        include: {
            orderItems: {
                include: {
                    product: true
                }
            }
        }
    })

    const monthlyRevenue: { [key: number]:number} = {}

    for (const order of paidOrders){
        const month = order.createdAt.getMonth();
        let revenueForOrder = 0;

        for (const item of order.orderItems) {
            revenueForOrder += item.product.price.toNumber()
        }

        monthlyRevenue[month] - (monthlyRevenue[month] || 0 ) + revenueForOrder
    }

    const graphData: GraphData[] = [
        { name: "Jan", total: 8},
        { name: "Feb", total: 10},
        { name: "Mar", total: 3},
        { name: "Apr", total: 43},
        { name: "May", total: 2},
        { name: "Jun", total: 0},
        { name: "Jul", total: 34},
        { name: "Aug", total: 0},
        { name: "Sep", total: 2},
        { name: "Oct", total: 2},
        { name: "Nov", total: 13},
        { name: "Dec", total: 0},

    ]
     for ( const month in monthlyRevenue) {
        graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)]
     }

     return graphData
}
