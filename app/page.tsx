import ChatComponents from "@/components/chatComponents"
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="bg-stlate-800 p-3 w-[800px] rounded-md text-white">
        <h2 className="text-2xl">Chatty App By Teresios Bundi Muriithi</h2>
         <ChatComponents />
      </div>
   
    </main>
  )
}
