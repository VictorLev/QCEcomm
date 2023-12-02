"use client"

import * as z from "zod"
import { Cday } from "@prisma/client";
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";

interface CdayFormProps {
    initialData: Cday | null;
}

const formSchema = z.object({
    name :  z.string().min(1),
    valueEn :  z.string().min(1),
    valueFr :  z.string().min(1),
    valueSp :  z.string().min(1)
})

type CdayFormValues = z.infer<typeof formSchema>

export const CdayForm: React.FC<CdayFormProps> = ({
    initialData
}) => {
    const params = useParams()
    const router = useRouter()

    const [open, setOpen] =  useState(false);
    const [loading, setLoading] = useState(false);
    
    const title =  initialData ? "Edit Cday" : "Create Cday"
    const description =  initialData ? "Edit a Cday" : "Add a new Cday"
    const toastMessage =  initialData ? "Cday updated" : "Cday created"
    const action =  initialData ? "Save Changes" : " Create"

    
    const form = useForm<CdayFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name : '',
            valueEn :  '',
            valueFr :  '',
            valueSp :  ''
        }
    })

    const onSubmit = async (data: CdayFormValues) => {
        try {
            setLoading(true);
            if (initialData) { 
                await axios.patch(`/api/${params.storeId}/cdays/${params.cdayId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/cdays`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/cdays`)
            toast.success(toastMessage)
        } catch (error) {
            toast.error("Something went wrong.")
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/cdays/${params.cdayId}`)
            router.refresh()
            router.push(`/${params.storeId}/cdays`)
            toast.success("cday deleted.")
        } catch (error) {
            toast.error("Make sure you removed all products using this cday first.")
        } finally {
            setLoading(false)
            setOpen(false)
        }
    }


    return (
        <>
            <AlertModal 
                isOpen={open}
                onClose={()=> setOpen(false)}
                onConfirm={onDelete}
                loading={loading}
            />
            <div className="flex items-center justify-between">
                <Heading 
                    title={title}
                    description={description}
                />
                { initialData && (
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        onClick={() => setOpen(true) }
                    >
                        <Trash className="h-4 w-4"/>
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full"> 
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Cday name" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <div className="grid grid-rows-3 gap-4">
                            <FormField 
                                control={form.control}
                                name="valueEn"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Value in English</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Celebration value" {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="valueFr"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Value in French</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Celebration value" {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField 
                                control={form.control}
                                name="valueSp"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Value in Spanish</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Celebration value" {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}