'use client'
import Navbar from '@/app/components/common/Navbar';
import React, { useState, useEffect } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation'; // For dynamic routing
import { useGetLeagueQuery } from "@/app/redux/services/fplApi"; // Your API hook


export default function Page() {
    const [userTeam, setUserTeam] = useState(null);
    const pathname = usePathname();
    const leagueId = pathname.split('/').pop()
    const [page, setPage] = useState(1)

    console.log(leagueId)

    // Fetch league data
    const { data: leagueData, error, isLoading } = useGetLeagueQuery({ leagueId, page }, {
        skip: !leagueId,  // Skip the query if leagueId is not available
    });

    useEffect(() => {
        const savedTeamData = localStorage.getItem("teamData");
        if (savedTeamData) {
            setUserTeam(JSON.parse(savedTeamData));
        }
    }, []);
    
    useEffect(() => {
        if (leagueData) {
            console.log(leagueData.standings.results)

        }
    },[leagueData])

    if (isLoading) {
        return <div>Loading league data...</div>;
    }

    if (error) {
        return <div>Error loading league data</div>;
    }

    return (
        <>
        <Navbar />
        <div className='mx-8 md:mx-16 lg:mx-24 bg-red-500'>
            <div className='grid grid-cols-4 p-2'>
                <div className='col-span-1 p-2 bg-yellow-300'>
                    <p>Team data here</p>
                </div>
                <div className='col-span-3 p-2 bg-green-300'>
                    <h2>League Details</h2>
                    {leagueData? (
                        <div className='bg-orange-300 justify-center items-center text-center'>
                            <table className='table-auto w-full'>
                                <thead className=''>
                                    <tr className='bg-gradient-to-br from-[#1f1073] from-10% via-[#0A1F79] via-30% to-[#5D05C8] to-90% text-white text-sm'>
                                        <th className='font-medium p-4'>Rank</th>
                                        <th className='text-left font-medium '>Team</th>
                                        <th className='text-white font-medium'>Total</th>
                                        <th className='font-medium'>GW</th>
                                        <th className='font-medium'>Captain</th>
                                        <th className='font-medium'>Vice</th>
                                        <th className='font-medium'>Chip</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leagueData.standings.results?.map((team) => (
                                        
                                        <tr key={team.entry}>
                                            <td>{team.rank}</td>
                                            <td className='text-left'>{team.player_name}</td>
                                            <td>{team.total}</td>
                                            <td>{team.event_total}</td>
                                            <td>{team.total}</td>
                                            <td>{team.total}</td>
                                            <td>{team.total}</td>
                                        </tr>
                                        
                                    ))}
                                   
                                </tbody>
                                <tfoot>
                                    <tr className='bg-blue-100 w-full text-center'>
                                        <td colSpan="7">
                                            <button 
                                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))} 
                                                className='px-4 py-2 bg-blue-500 text-white rounded mx-2'
                                            >
                                                Prev Page
                                            </button>
                                            <button 
                                                onClick={() => setPage((prev) => prev + 1)} 
                                                className='px-4 py-2 bg-blue-500 text-white rounded mx-2'
                                            >
                                                Next Page
                                            </button>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    ) : (
                        <p>No league data available</p>
                    )}
                </div>
            </div>
            </div>
        </>
    );
}
