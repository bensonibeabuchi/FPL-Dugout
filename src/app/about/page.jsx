'use client';
import React, { useState, useEffect } from 'react'
import Navbar from '../components/common/Navbar'
import Link from 'next/link'
import { useSelector } from "react-redux";

export default function About() {
    const [userTeam, setUserTeam] = useState(null);

    useEffect(() => {
        const savedTeamData = localStorage.getItem("teamData");
        if (savedTeamData) {
            // Parse the string back into an object if it's a JSON string
            setUserTeam(JSON.parse(savedTeamData));
        }
    }, []);  

  return (
    <div>
        <Navbar/>
        <p>About us page</p>
        <Link href="/">
        <p>
            Back to Home page
        </p>
        <p>
                Team Name: {userTeam?.name}
            </p>
        </Link>
    </div>
  )
}
