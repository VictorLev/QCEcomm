"use client"

import { BillboardColumn } from "./columns"

interface CellActionProps {
    data: BillboardColumn
}

export const CellAction: FC<CellActionProps> = ({
    data
}) => {
   return (
        <div>Action</div>
   ) 
}