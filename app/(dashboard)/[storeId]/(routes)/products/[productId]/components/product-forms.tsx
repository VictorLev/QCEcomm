"use client"

import * as z from "zod"
import { Category, Color, ProductImage, Product, Size, Province, Type as TypesType, Cday, Sportsteam } from "@prisma/client";
import { Heading } from "@/components/ui/heading"
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface ProductFormProps {
    initialData: Product & {
        images: ProductImage[]
    }| null;
    categories: Category[]
    sizes: Size[]
    colors: Color[]
    provinces: Province[]
    types: TypesType[]
    cdays: Cday[]
    sportsteams: Sportsteam[]
}

const formSchema = z.object({
    nameEn : z.string().min(1),
    nameFr : z.string().min(1),
    nameSp : z.string().min(1),
    descriptionEn : z.string().min(1),
    descriptionFr : z.string().min(1),
    descriptionSp : z.string().min(1),
    images : z.object({  url: z.string()}).array(),
    price: z.coerce.number().min(1),
    categoryId : z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    sportsteamId: z.string().min(1),
    cdayId: z.string().min(1),
    typeId: z.string().min(1),
    provinceId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
})

type ProductFormValues = z.infer<typeof formSchema>

export const ProductForm: React.FC<ProductFormProps> = ({
    initialData,
    categories,
    colors,
    sizes,
    provinces,
    types,
    cdays,
    sportsteams
}) => {
    const params = useParams()
    const router = useRouter()

    const [open, setOpen] =  useState(false);
    const [loading, setLoading] = useState(false);
    
    const title =  initialData ? "Edit product" : "Create Product"
    const description =  initialData ? "Edit a product" : "Add a new Product"
    const toastMessage =  initialData ? "Product updated" : "Product created"
    const action =  initialData ? "Save Changes" : " Create"

    
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? { 
            ...initialData, 
            price: parseFloat(String(initialData?.price))
        } : {
            nameEn : '',
            nameFr : '',
            nameSp : '',            
            descriptionEn : '',
            descriptionFr : '',
            descriptionSp : '',
            images : [],
            price: 0,
            categoryId : '',
            colorId: '',
            sizeId: '',
            sportsteamId: '',
            cdayId: '',
            typeId: '',
            provinceId: '',
            isFeatured: false,
            isArchived: false
        }
    })

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true);
            if (initialData) { 
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
            } else {
                await axios.post(`/api/${params.storeId}/products`, data)
            }
            router.refresh()
            router.push(`/${params.storeId}/products`)
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`)
            router.refresh()
            router.push(`/${params.storeId}/products`)
            toast.success("Product deleted.")
        } catch (error) {
            toast.error("Something went wrong.")
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
                    <FormField 
                        control={form.control}
                        name="images"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <ImageUpload 
                                        value={field.value.map((image)=> image.url)}
                                        disabled={loading}
                                        onChange={(url) => field.onChange([...field.value, {url}])}
                                        onRemove={(url) => field.onChange([...field.value.filter((current)=> current.url !== url)])}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-3 gap-8">
                        <FormField 
                            control={form.control}
                            name="nameEn"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name in English</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Product name English" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField 
                            control={form.control}
                            name="nameFr"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name in French</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Product name French" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField 
                            control={form.control}
                            name="nameSp"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Name in Spanish</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Product name Spanish" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                                                <FormField 
                            control={form.control}
                            name="descriptionEn"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>description in English</FormLabel>
                                    <FormControl>
                                        <Textarea disabled={loading}
                                        placeholder="write a short description in English"
                                        className="resize-none"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="descriptionFr"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>description in French</FormLabel>
                                    <FormControl>
                                        <Textarea disabled={loading}
                                        placeholder="write a short description in French"
                                        className="resize-none"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="descriptionSp"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>description in Spanish</FormLabel>
                                    <FormControl>
                                        <Textarea disabled={loading}
                                        placeholder="write a short description in Spanish"
                                        className="resize-none"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="price"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder="9.99" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="categoryId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Cateogry</FormLabel>
                                    <Select 
                                        disabled={loading}
                                        onValueChange={field.onChange} 
                                        value={field.value} 
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger >
                                                <SelectValue 
                                                    defaultValue={field.value} 
                                                    placeholder="Select a Category" 
                                                />

                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.nameEn}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="sizeId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Size</FormLabel>
                                    <Select 
                                        disabled={loading}
                                        onValueChange={field.onChange} 
                                        value={field.value} 
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger >
                                                <SelectValue 
                                                    defaultValue={field.value} 
                                                    placeholder="Select a Size" 
                                                />

                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sizes.map((size) => (
                                                <SelectItem
                                                    key={size.id}
                                                    value={size.id}
                                                >
                                                    {size.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="provinceId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Province</FormLabel>
                                    <Select 
                                        disabled={loading}
                                        onValueChange={field.onChange} 
                                        value={field.value} 
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger >
                                                <SelectValue 
                                                    defaultValue={field.value} 
                                                    placeholder="Select a Province" 
                                                />

                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {provinces.map((province) => (
                                                <SelectItem
                                                    key={province.id}
                                                    value={province.id}
                                                >
                                                    {province.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="typeId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select 
                                        disabled={loading}
                                        onValueChange={field.onChange} 
                                        value={field.value} 
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger >
                                                <SelectValue 
                                                    defaultValue={field.value} 
                                                    placeholder="Select a Type" 
                                                />

                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {types.map((type) => (
                                                <SelectItem
                                                    key={type.id}
                                                    value={type.id}
                                                >
                                                    {type.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="sportsteamId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Sportsteam</FormLabel>
                                    <Select 
                                        disabled={loading}
                                        onValueChange={field.onChange} 
                                        value={field.value} 
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger >
                                                <SelectValue 
                                                    defaultValue={field.value} 
                                                    placeholder="Select a sportsteam" 
                                                />

                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {sportsteams.map((sportsteam) => (
                                                <SelectItem
                                                    key={sportsteam.id}
                                                    value={sportsteam.id}
                                                >
                                                    {sportsteam.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="cdayId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Celebration Day</FormLabel>
                                    <Select 
                                        disabled={loading}
                                        onValueChange={field.onChange} 
                                        value={field.value} 
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger >
                                                <SelectValue 
                                                    defaultValue={field.value} 
                                                    placeholder="Select a Celebration" 
                                                />

                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {cdays.map((cday) => (
                                                <SelectItem
                                                    key={cday.id}
                                                    value={cday.id}
                                                >
                                                    {cday.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="colorId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <Select 
                                        disabled={loading}
                                        onValueChange={field.onChange} 
                                        value={field.value} 
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger >
                                                <SelectValue 
                                                    defaultValue={field.value} 
                                                    placeholder="Select a Color" 
                                                />

                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {colors.map((color) => (
                                                <SelectItem
                                                    key={color.id}
                                                    value={color.id}
                                                >
                                                    {color.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="isFeatured"
                            render={({field}) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Featured
                                        </FormLabel>
                                        <FormDescription>
                                            This product will appear on the home page
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />
                        <FormField 
                            control={form.control}
                            name="isArchived"
                            render={({field}) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox 
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Archived
                                        </FormLabel>
                                        <FormDescription>
                                            This product will not appear anywhere in the store
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />


                    </div>

                    <Button disabled={loading} className="ml-auto" type="submit">
                        {action}
                    </Button>
                </form>
            </Form>
        </>
    )
}