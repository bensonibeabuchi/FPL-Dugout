'use client'
import React, { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';

export default function Page() {
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
            <Navbar />
            <div>
                <h1>DASHBOARD</h1>
                <p>Team Name: {userTeam?.name}</p>
            </div>
        </div>
    );
}
