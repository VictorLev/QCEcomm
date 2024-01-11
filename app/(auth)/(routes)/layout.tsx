export default function AuthLayout({
    children
} : {
    children: React.ReactNode
}) {
    return (
        <div className="bg-blue-700 flex flex-col gap-8 items-center justify-center h-full">
            {children}
            <div className="bg-white rounded shadow-lg p-4">
              To Logging please use the following Username: DemoUser // Password: iloveprogramming
            </div>
        </div>
    )
}
