import React, { useState } from 'react'
import { useSelector } from "react-redux";
import "remixicon/fonts/remixicon.css";
import { IoIosCloseCircle } from "react-icons/io";
import Link from 'next/link';


export default function SelectLeague({ isOpen, onClose}) {
  const userTeam = useSelector((state) => state.team.teamData);
  const [page, setPage] = useState(1)

  return (
    <div className="fixed z-20 top-0 h-screen w-screen left-0 bg-black bg-opacity-50 flex items-center justify-center mx-auto backdrop-blur-sm">
      <div className='bg-white rounded-md w-[584px]'>
        <div className='bg-gradient-to-br from-[#1f1073] from-10% via-[#0A1F79] via-30% to-[#5D05C8] to-90% rounded-tl-md rounded-tr-md p-4 flex justify-between'>
          <p className='bg-gradient-to-br from-[#04f5ff] to-[#00ff85] inline-block text-transparent bg-clip-text font-semibold'>Welcome {userTeam?.name}</p>
          <button onClick={onClose}>
            <IoIosCloseCircle size={24} color='white' />
          </button> 
        </div>
        <div className='p-4'>
          <p>Select which league you want to follow live. You can change this anytime</p>
        </div>
        <div className='flex'>
          <div>
          <ul className="py-2">
            <li className='px-4 py-1 font-semibold text-[#38003c]'>Invitational Leagues</li>
              {userTeam?.leagues.classic.filter((league) => league.league_type === "x").map((league) => (
                  <div key={league.id}>
                    <Link href={`/dashboard/${league.id}/`}>
                      <li className="px-4 py-1 hover:bg-gray-100 hover:scale-[1.02] cursor-pointer">{league.name}</li>
                    </Link>
                  </div>
              ))}
          </ul>
          <ul className="py-2">
            <li className='px-4 py-1 font-semibold text-[#38003c]'>General Leagues</li>
              {userTeam?.leagues.classic.filter((league) => league.league_type === "s").map((league) => (
                <div key={league.id}>
                  <Link href={`/dashboard/${league.id}`}>
                    <li className="px-4 py-1 hover:bg-gray-100 hover:scale-[1.02] cursor-pointer">{league.name}</li>
                  </Link>
              </div>
            ))}
          </ul>
          </div>
          <div>
          <ul className="py-2">
            <li className='px-4 py-1 font-semibold text-[#38003c]'>Head-to-Head Leagues</li>
              {userTeam?.leagues.h2h.map((league) => (
                <div key={league.id}>
                  <Link href={`/dashboard/${league.id}`}>
                    <li className="px-4 py-1 hover:bg-gray-100 hover:scale-[1.02] cursor-pointer">{league.name}</li>
                  </Link>
                </div>
              ))}
          </ul>
          </div>
        </div>
        

      </div>
    </div>
  )
}
