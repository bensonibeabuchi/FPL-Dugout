import React from 'react'
import Image from 'next/image'
import sampleImage from '../../../../public/images/blog_image.png'
import { MdOutlineKeyboardArrowRight } from "react-icons/md";




export default function BlogCard() {
  return (
    <div className="w-[360px] rounded-xl shadow-md h-[478px] gap-4 text-left bg-white items-center justify-center flex-row ">
      <div className="w-full bg-red-500 rounded-t-xl">
        <Image src={sampleImage} width={500} height={500} className="object-cover rounded-t-xl" alt="image here"/>
      </div>
      <div className="p-4">
        <h2 className="text-lg  font-semibold">Fpl Price Changes: Pickford Rises, Joao Pedro Falls</h2>
        <p className="py-2 px-1 text-sm">29 Feb, 2025</p>
        <p className="text-justify py-2 text-wrap text-sm h-[84px] overflow-hidden">FPL Price Changes: Pickford Rises as João Pedro Falls
        Seven price changes have occurred in Fantasy Premier League today, with one notable rise and two significant falls. Let's delve into the details of these fluctuations and their potential impact on FPL managers' strategies.</p>
        <p className="py-2 flex gap-2 items-center text-sm text-blue-500 underline font-light">
          Continue Reading
          <MdOutlineKeyboardArrowRight />
        </p>
      </div>
     
    </div>
  )
}
