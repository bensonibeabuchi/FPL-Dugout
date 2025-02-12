'use client'
import Navbar from '@/app/components/common/Navbar';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useGetFullTeamDetailsQuery, useGetLeagueQuery, useGetGeneralInfoQuery } from "@/app/redux/services/fplApi"; // Your API hook
import { useDispatch, useSelector } from "react-redux";
import { fplApi } from '@/app/redux/services/fplApi';
import Image from 'next/image';
import pitch from "../../../../public/images/pitch.png"



export default function Page() {
    const [userTeam, setUserTeam] = useState(null);
    const pathname = usePathname();
    const leagueId = pathname.split('/').pop();
    const [page, setPage] = useState(1);
    const [teamId, setTeamId] = useState("");
    const [gw, setGw] = useState("");
    const [fullTeam, setFullTeam] = useState({})

    const elementTypes = [1, 2, 3, 4, 5];

    const dispatch = useDispatch();

    const { data: leagueData, error, isLoading } = useGetLeagueQuery({ leagueId, page }, {skip: !leagueId});

    const { data: fullTeamDetailsData } = useGetFullTeamDetailsQuery({ teamId, gw }, { skip: !teamId || !gw });
    console.log(fullTeamDetailsData)

    const { data: generalInfo } = useGetGeneralInfoQuery()




    useEffect(() => {
        const savedTeamData = localStorage.getItem("teamData");
        if (savedTeamData) {
            const parsedData = JSON.parse(savedTeamData);
            setUserTeam(parsedData);
            setTeamId(parsedData.id)
            setGw(parsedData?.current_event);
        }
    }, []);

    useEffect(() => {
        if (leagueData?.standings?.results && gw) {
            leagueData.standings.results.forEach(async(team) => {
                try {
                    const response = await dispatch(
                        fplApi.endpoints.getFullTeamDetails.initiate({
                            teamId: team.entry,
                            gw: gw,
                        })
                    ).unwrap();
                    setFullTeam((prevState) => ({
                        ...prevState,
                        [team.entry]: response,
                    }));
                } catch (error){
                }
            });
        }
    }, [leagueData, dispatch, gw]);



    if (isLoading) return <div>Loading league data...</div>;
    if (error) return <div>Error loading league data</div>;


    return (
        <>
        <Navbar />
        <div className='mx-8 md:mx-16 lg:mx-24 bg-red-500'>
            <div className='grid grid-cols-4 p-2'>
                <div className='col-span-1 p-2 bg-yellow-300'>
                    <p>Team data here</p>
                    <div className='bg-black p-2'>
                        <p className='text-white font-semibold text-2xl'>{userTeam?.name}</p>
                        <div>
                            <table className='text-white table-auto w-full font-medium'>
                                <thead className='text-center'>
                                    <tr>
                                        <th className='font-medium text-sm'>GW Net</th>
                                        <th className='font-medium text-sm'>Transfers</th>
                                        <th className='font-medium text-sm'>Total</th>
                                        <th className='font-medium text-sm'>Chip</th>
                                    </tr>
                                </thead>
                                <tbody className='text-center'>
                                    <tr>
                                        <td>{fullTeamDetailsData?.entry_history?.points}</td>
                                        <td>{fullTeamDetailsData?.entry_history.event_transfers}({fullTeamDetailsData?.entry_history.event_transfers_cost})</td>
                                        <td>{fullTeamDetailsData?.entry_history.total_points}</td>
                                        <td>{fullTeamDetailsData?.active_chip === "manager" ? "AM" :
                                            fullTeamDetailsData?.active_chip === "3xc" ? "TC" :
                                            fullTeamDetailsData?.active_chip === "wildcard" ? "WC" :
                                            fullTeamDetailsData?.active_chip === "freehit" ? "FH" :
                                            fullTeamDetailsData?.active_chip === "bboost" ? "BB" :
                                            fullTeamDetailsData?.active_chip}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <table className='text-white table-auto w-full font-medium'>
                                <thead>
                                    <tr>
                                        <th>Player</th>
                                        <th>Pts</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {fullTeamDetailsData?.picks.map((player) => {
                                    const matchedPlayer = generalInfo?.elements.find(element => element.id === player.element)
                                    const captainElement = fullTeamDetailsData?.picks?.find(pick => pick.is_captain)?.element;
                                    const viceCaptainElement = fullTeamDetailsData?.picks?.find(pick => pick.is_vice_captain)?.element;
                                    const captainName = generalInfo?.elements?.find(player => player.id === captainElement)?.web_name || "Unknown Player";
                                    const viceCaptainName = generalInfo?.elements?.find(player => player.id === viceCaptainElement)?.web_name || "Unknown Player";

                                    const eventPoints = (matchedPlayer?.event_points ?? 0) * (player.multiplier ?? 1);

                                    return (    
                                        <tr key={player.element} >
                                            <td>
                                            {matchedPlayer ? matchedPlayer.web_name : "Player Name"} 
                                            {player.is_captain ? " (Captain)" : ""}
                                            {player.is_vice_captain ? " (Vice Captain)" : ""}
                                            </td>
                                            <td>{eventPoints}</td>
                                        </tr>
                                    
                                  
                                ) }
                                )}
                                </tbody>
                            </table>

                            <div className="bg-[url('../../public/images/pitch.png')] bg-cover bg-center flex-row justify-items-center w-full">

                            {elementTypes.map((type) => {
                                return (
                                    <div key={type} className="p-4">
                                        <div className="flex flex-wrap gap-4"> {/* Ensures players are in a row */}
                                            {fullTeamDetailsData?.picks.slice(0, 11).filter((player) => player.element_type === type).map((player) => {
                                                const captainElement = fullTeamDetailsData?.picks?.find(pick => pick.is_captain)?.element;
                                                const matchedPlayer = generalInfo?.elements?.find((element) => element.id === player.element);
                                                const captainName = generalInfo?.elements?.find(player => player.id === captainElement)?.web_name || "Unknown Player";
                                                
                                                // Multiply event points by multiplier
                                                const eventPoints = (matchedPlayer?.event_points ?? 0) * (player.multiplier ?? 1);
                                                console.log(matchedPlayer)
                                                
                                                    return (
                                                        <div key={player.element} className="bg-blue-300 flex flex-col items-center">
                                                            <p className="bg-blue-500 text-sm text-white px-4 py-2 rounded">{matchedPlayer ? matchedPlayer.web_name : "Unknown Player"}{matchedPlayer ? matchedPlayer.web_name === captainName : "Captain" } </p>
                                                            <p className="bg-blue-800 text-sm text-white px-4 py-2 rounded">{eventPoints}</p>
                                                            
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                );
                            })}

                            <h1>BENCH PLAYERS</h1>

                            <div className="flex flex-wrap gap-4 bg-green-200 p-4">
                                {elementTypes.flatMap((type) => 
                                    fullTeamDetailsData?.picks.slice(11, 16)
                                        .filter((player) => player.element_type === type)
                                        .map((player) => {
                                            const matchedPlayer = generalInfo?.elements?.find((element) => element.id === player.element);
                                            
                                            return (
                                                <div key={player.element} className="bg-blue-300 flex flex-col items-center p-2 rounded">
                                                    <p className="bg-blue-500 text-sm text-white px-4 py-2 rounded">{matchedPlayer ? matchedPlayer.web_name : "Unknown Player"}</p>
                                                    <p className="bg-blue-800 text-sm text-white px-4 py-2 rounded">{matchedPlayer?.event_points ?? 0}</p>
                                                </div>
                                            );
                                        })
                                )}
                            </div>

                            </div>
                         



                        </div>

                    </div>
                </div>
                <div className='col-span-3 p-2 bg-green-300'>
                    <h2>League Details</h2>
                    {leagueData? (
                        <div className='bg-orange-300 justify-center items-center text-center'>
                            <table className='w-full md:table-fixed table-auto border-collapse border border-gray-400'>
                                <thead className=''>
                                    <tr className='bg-gradient-to-br from-[#1f1073] from-10% via-[#0A1F79] via-30% to-[#5D05C8] to-90% text-white text-sm'>
                                        <th className=' p-4'>Rank</th>
                                        <th className='text-left'>Team</th>
                                        <th className='text-white'>Total</th>
                                        <th className=''>GW</th>
                                        <th className=''>Captain</th>
                                        <th className=''>Vice</th>
                                        <th className=''>Chip</th>
                                        <th className=''>Transfers</th>
                                        <th className=''>Played</th>
                                        <th className=''>Points from top</th>
                                    </tr>
                                </thead>
                                <tbody className="p-16">
                                {leagueData.standings.results?.map((team) => {
                                            const teamDetails = fullTeam[team.entry];
                                            const captainElement = teamDetails?.picks?.find(pick => pick.is_captain)?.element; 
                                            const ViceCaptainElement = teamDetails?.picks?.find(pick => pick.is_vice_captain)?.element; 
                                            const captainName = generalInfo?.elements?.find(player => player.id === captainElement)?.web_name || "Unknown Player";
                                            const viceCaptainName = generalInfo?.elements?.find(player => player.id === ViceCaptainElement)?.web_name || "Unknown Player";
                                            const highestPoints = Math.max(...leagueData?.standings?.results.map(team => team.total));
                                           
                                            
                                            return (
                                                <tr key={team.entry} className="p-8 w-8">
                                                    <td>{team.rank}</td>
                                                    <td className='text-left'>{team.player_name}</td>
                                                    <td>{team.total}</td>
                                                    <td>{team.event_total}</td>
                                                    <td>{captainName}</td>
                                                    <td>{viceCaptainName}</td>
                                                    {/* <td>{teamDetails?.picks?.find(pick => pick.is_captain)?.element}</td> */}
                                                    {/* <td>{teamDetails?.picks?.find(pick => pick.is_vice_captain)?.element}</td> */}
                                                    <td>{teamDetails?.active_chip === "manager" ? "AM" :
                                                        teamDetails?.active_chip === "3xc" ? "TC" :
                                                        teamDetails?.active_chip === "wildcard" ? "WC" :
                                                        teamDetails?.active_chip === "freehit" ? "FH" :
                                                        teamDetails?.active_chip === "bboost" ? "BB" :
                                                        teamDetails?.active_chip}
                                                    </td>
                                                    <td>{teamDetails?.entry_history.event_transfers}({teamDetails?.entry_history?.event_transfers_cost ? `-${teamDetails.entry_history.event_transfers_cost}` : 0 })</td>
                                                    <td>played</td>
                                                    <td>{teamDetails?.entry_history.total_points - highestPoints}</td>

                                                   
                                                </tr>
                                            );
                                        })}
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
