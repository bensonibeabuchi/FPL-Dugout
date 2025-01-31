"use client";
import React from 'react'
import Image from 'next/image'
import logo from '../../../../public/images/logo.png'
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";



export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const [userTeam, setUserTeam] = useState(null);
    

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)){
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const savedTeamData = localStorage.getItem("teamData");
        if (savedTeamData) {
            // Parse the string back into an object if it's a JSON string
            setUserTeam(JSON.parse(savedTeamData));
        }
    }, []);  // Empty dependency array makes this run only once, after the first render


  return (
    <>
    <div ref={dropdownRef} className="bg-[#E8F0EF] w-full p-8 sticky top-0 z-10">
        <div className="flex items-center justify-between lg:px-24 md:px-12">
            <Link href="/">
                <Image src={logo} width='150' alt="Logo" />
            </Link>
            <div className="flex items-center md:gap-2">
                <p>{userTeam?.name}</p>
                <p className="text-black text-xs md:text-base">Active League :</p>
                <div>
                    <button onClick={() => setIsOpen(!isOpen)} className="flex justify-between cursor-pointer md:w-48 text-xs md:text-base items-center bg-[#c9c9c9] md:p-3 p-2 md:rounded-md rounded gap-1">
                        <p>Select League</p>
                        {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown /> } 
                    </button>
                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute text-xs md:text-base mt-2 md:w-48  bg-white border rounded-lg shadow-lg">
                        <ul className="py-2">
                            <li className='px-4 py-1 font-semibold text-[#38003c]'>Invitational Leagues</li>
                            {userTeam?.leagues.classic.filter((league) => league.league_type === "x").map((league) => (
                                <div key={league.id}>
                                    <Link href={`/dashboard/${league.id}`}>
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
                        <ul className="py-2">
                            <li className='px-4 py-1 font-semibold text-[#38003c]'>Head-to-Head Leagues</li>
                            {userTeam?.leagues.h2h.map((league, ) => (
                                <div key={league.id}>
                                <Link href={`/dashboard/${league.id}`}>
                                    <li className="px-4 py-1 hover:bg-gray-100 hover:scale-[1.02] cursor-pointer">{league.name}</li>
                                </Link>
                                </div>
                            ))}
                        </ul>
                        </div>
                    )}
                </div>
            </div>
            
        </div>
        {/* <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(userTeam, null, 2)}</pre> */}

    </div>

    </>
  )
}
