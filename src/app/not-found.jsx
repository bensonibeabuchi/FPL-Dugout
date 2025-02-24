import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="mx-auto w-full flex flex-row h-screen justify-center items-center text-center">
      <div>
      <h2 className="p-4 text-3xl m-8 font-bold">Page Not Found</h2>
      <Link className="rounded-md bg-blue-200 p-4 m-8 cursor-pointer" href="/"><button>Return Home</button></Link>

      </div>
    </div>
  )
}