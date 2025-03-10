import React from 'react'
import logo from '../../../../public/images/icon-invert.png'
import Link from 'next/link'
import Image from 'next/image'



export default function Footer() {
  return (
    <div className="bg-[#002A95] absolute w-full p-12 sm:px-36 sm:flex flex-row justify-between items-center text-center">
        <div className="flex justify-center">
            <Link href="/">
                <Image src={logo} width='150' alt="Logo" />
            </Link>
        </div>
        <div className="text-white flex gap-8 font-medium sm:text-lg text-sm justify-center">
            <Link href="/">
            <p>About</p>
            </Link>
            <Link href="/">
            <p>Terms of Use</p>
            </Link>
            <Link href="/">
            <p>Privacy Policy</p>
            </Link>
            <Link href="/">
            <p>Contact us</p>
            </Link>
           
        </div>
    </div>
  )
}
