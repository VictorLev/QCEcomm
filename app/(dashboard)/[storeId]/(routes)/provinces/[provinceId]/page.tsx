import prismadb from "@/lib/prismadb";
import { ProvinceForm } from "./components/province-forms";

const ProvincePage = async ({
    params
}: {
    params: { provinceId: string }
}) => {
    const province = await prismadb.province.findUnique({
        where: {
            id: params.provinceId
        }
    })


    return ( 
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProvinceForm initialData={province} />
            </div>
        </div>
    );
}
 
export default ProvincePage;