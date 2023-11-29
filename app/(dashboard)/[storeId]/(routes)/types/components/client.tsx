"use client"

import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { TypeColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface TypeClientProps {
    data: TypeColumn[]
}

export const TypeClient: React.FC<TypeClientProps> = ( {
    data 
}) => {
    const router = useRouter()
    const params = useParams()


    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Types (${data.length})`}
                    description="Manage Types for your store"
                />
                <Button onClick={() => router.push(`/${params.storeId}/types/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data}/>
            <Heading title="API" description="API calls for Types" />
            <Separator />
            <ApiList entityName="types" entityIdName="typeId" />
        </>
    )
}