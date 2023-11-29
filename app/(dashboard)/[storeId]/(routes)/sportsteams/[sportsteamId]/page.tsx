import prismadb from "@/lib/prismadb";
import { SportsteamForm } from "./components/sportsteam-forms";

const SportsteamPage = async ({
    params
}: {
    params: { sportsteamId: string }
}) => {
    const sportsteam = await prismadb.sportsteam.findUnique({
        where: {
            id: params.sportsteamId
        }
    })


    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SportsteamForm initialData={sportsteam} />
            </div>
        </div>
    );
}
 
export default SportsteamPage;