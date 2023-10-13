export default function AuthLayout({
    children 
} : {
    children: React.ReactNode
}) {
    return (
        <div className="bg-blue-700 flex items-center justify-center h-full">
            {children}
        </div>
    )
}

