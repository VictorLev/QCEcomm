import prismadb from "@/lib/prismadb";
import { CdayForm } from "./components/cday-forms";

const CdayPage = async ({
    params
}: {
    params: { cdayId: string }
}) => {
    const cday = await prismadb.cday.findUnique({
        where: {
            id: params.cdayId
        }
    })


    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CdayForm initialData={cday} />
            </div>
        </div>
    );
}
 
export default CdayPage;