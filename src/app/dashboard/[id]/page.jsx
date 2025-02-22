'use client'
import Navbar from '@/app/components/common/Navbar';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useGetFullTeamDetailsQuery, useGetLeagueQuery, useGetGeneralInfoQuery, useGetLiveGameweekDataQuery, useGetTeamHistoryQuery } from "@/app/redux/services/fplApi";
import { useDispatch } from "react-redux";
import { fplApi } from '@/app/redux/services/fplApi';
import PlayerCard from '@/app/components/common/PlayerCard';
import PlayerCardLine from '@/app/components/common/PlayerCardLine';
import { PiToggleRightFill, PiToggleLeftFill } from "react-icons/pi";
import LeagueTable from '@/app/components/common/LeagueTable';

export default function Page() {
    const [userTeam, setUserTeam] = useState(null);
    const pathname = usePathname();
    const leagueId = pathname.split('/').pop();
    const [page, setPage] = useState(1);
    const [teamId, setTeamId] = useState("");
    const [gw, setGw] = useState("");
    const [event_id, setEventId] =useState("")
    const [fullTeam, setFullTeam] = useState({})
    const [pitchView, setPitchView] = useState(() => {return JSON.parse(localStorage.getItem("pitchView")) ?? true;});
    
    
    const dispatch = useDispatch();
    const { data: leagueData, error, isLoading } = useGetLeagueQuery({ leagueId, page }, {skip: !leagueId});
    const { data: leagueData2 } = useGetLeagueQuery({ leagueId, page:2 }, {skip: !leagueId});
    const { data: leagueData3 } = useGetLeagueQuery({ leagueId, page:3 }, {skip: !leagueId});
    const { data: leagueData4 } = useGetLeagueQuery({ leagueId, page:4 }, {skip: !leagueId});
    
    const fullLeagueData = leagueData && leagueData2 && leagueData3 && leagueData4 ? {
        ...leagueData, // SPread operator to merge and update objects
        standings: {
            ...leagueData.standings,
            results: [...leagueData.standings.results, ...leagueData2.standings.results, ...leagueData3.standings.results, ...leagueData4.standings.results] //concating results
        }
    } : leagueData || leagueData2 || leagueData3 || leagueData4  // If one of them is undefined, fallback to the other

    const { data: fullTeamDetailsData } = useGetFullTeamDetailsQuery({ teamId, gw }, { skip: !teamId || !gw });
    const { data: generalInfo } = useGetGeneralInfoQuery();
    const { data: liveGameweek } = useGetLiveGameweekDataQuery({ event_id }, { skip: !event_id });
    // 

    // const teamIds = fullLeagueData?.standings?.results?.map(team => team.entry) || [];
    // const teamHistories = teamIds.map(id => useGetTeamHistoryQuery({ teamId: id }, { skip: !id }));

    useEffect(() => {
        const savedTeamData = localStorage.getItem("teamData");
        if (savedTeamData) {
            const parsedData = JSON.parse(savedTeamData);
            setUserTeam(parsedData);
            setTeamId(parsedData.id)
            setGw(parsedData?.current_event);
            setEventId(parsedData?.current_event);
        }
    }, []);

    useEffect(() => {
        if (fullLeagueData?.standings?.results && gw) {
            fullLeagueData?.standings?.results.forEach(async(team) => {
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

    const toggleView = () => {
        setPitchView((prev) => {
            const newView = !prev;
            localStorage.setItem("pitchView", JSON.stringify(newView));
            return newView;
        });
    };

    const elementTypes = [1, 2, 3, 4, 5];

    const totalTeamPoints = fullTeamDetailsData?.picks?.reduce((total, player) => {
        const matchedPlayerPoints = liveGameweek?.elements.find((element) => element.id === player.element);
        const eventPoints = (matchedPlayerPoints?.stats.total_points ?? 0) * (player.multiplier ?? 1);
        // console.log("MATCHED PLAYER POINTS", matchedPlayerPoints)
        return total + eventPoints;
    }, 0) || 0;
    
    const eventRealPoints = totalTeamPoints - (fullTeamDetailsData?.entry_history?.event_transfers_cost ?? 0)


    // Get the last recorded gameweek before the current one
    // const previousTotalPoints =
    //     teamHistory?.current?.length > 1 
    //         ? teamHistory.current[teamHistory.current.length - 2]?.total_points 
    //         : teamHistory?.current?.[0]?.total_points ?? 0;

    // // Calculate realTotalPoints
    // const realTotalPoints = previousTotalPoints + eventRealPoints;


    

    if (isLoading) return <div className="justify-center items-center flex text-center h-screen text-lg bg-gray-800 text-white font-medium"><p>Loading league data...</p></div>;;
    if (error) return <div className="justify-center items-center flex text-center h-screen text-lg bg-gray-800 text-white font-medium"><p>Error loading league data</p></div>;


    return (
        <>
            <Navbar />
            <div className='mx-4 sm:mx-8 lg:mx-24 bg-[#E8F0EF] p-4'>
                <div className='lg:flex space-y-4 lg:space-y-0 p-6 gap-4'>
                    {/* USER PLAYER DETAILS */}
                    
                    <div className='bg-[#202020] w-full lg:max-w-[450px] h-fit p-4 min-w-[390px]'>
                        {/* HEADER  */}
                        
                            <div className="flex justify-between items-center text-white mb-4">
                                <p className='text-sm sm:text-lg font-semibold'>{userTeam?.name}</p>
                                <button onClick={toggleView} className="flex items-center gap-2 text-white">
                                    {pitchView ? <PiToggleLeftFill size={30} color='grey'/> : <PiToggleRightFill size={30} color='green'/>}
                                    Pitch View
                                </button>
                            </div>
                            <div className='text-white p-2 mt-2 bg-[#2a2a2a]'>
                                <table className="w-full text-xs sm:text-sm">
                                    <tbody>
                                        <tr>
                                            <td>GW Points: </td>
                                            <td>{eventRealPoints}</td>
                                        </tr>
                                        <tr>
                                            <td>Transfers: </td>
                                            <td>{fullTeamDetailsData?.entry_history.event_transfers}({fullTeamDetailsData?.entry_history?.event_transfers_cost ? `-${fullTeamDetailsData.entry_history.event_transfers_cost}` : 0 })</td>
                                            
                                        </tr>
                                        <tr>
                                            <td>Total: </td>
                                            {/* <td>{realTotalPoints}</td> */}
                                            <td>{fullTeamDetailsData?.entry_history.total_points}</td>
                                        </tr>
                                        <tr>
                                            <td>Chip: </td>
                                            <td>{fullTeamDetailsData?.active_chip === "manager" ? "Assistant Manager" :
                                                fullTeamDetailsData?.active_chip === "3xc" ? "Tripple Captain" :
                                                fullTeamDetailsData?.active_chip === "wildcard" ? "Wild Card" :
                                                fullTeamDetailsData?.active_chip === "freehit" ? "Free Hit" :
                                                fullTeamDetailsData?.active_chip === "bboost" ? "Bench Boost" :
                                                fullTeamDetailsData?.active_chip}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        
                        
                        {pitchView ? (
                            <div>
                                {/* LIST VIEW */} 
                                <table className='text-xs sm:text-sm text-white font-medium w-full'>
                                    <thead>
                                        <tr className="bg-[#33383e]">
                                            <th className="text-left px-4 py-1">Player</th>
                                            <th className="text-left px-2 py-1">Pts</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* STARTING 11  */}
                                        {elementTypes.map((type) => 
                                            fullTeamDetailsData?.picks.slice(0, 11).filter((player) => player.element_type === type).map((player) => {
                                                const matchedPlayer = generalInfo?.elements?.find((element) => element.id === player.element);
                                                // Find player's live gameweek points
                                                const matchedPlayerPoints = liveGameweek?.elements?.find(element => element.id === player.element);
                                                const totalPoints = matchedPlayerPoints?.stats?.total_points ?? 0;
                                                const eventPoints = totalPoints * (player.multiplier ?? 1); 

                                                return (
                                                    <tr key={player.element} className="odd:bg-gray-300 even:bg-gray-200 text-black">
                                                        <td className="p-2">
                                                                <PlayerCardLine
                                                                    key={player.element}
                                                                    player={matchedPlayer}
                                                                    // eventPoints={eventPoints}
                                                                    isCaptain={player.is_captain}
                                                                    isViceCaptain={player.is_vice_captain}
                                                                    />
                                                        </td>
                                                        <td className="p-2">{eventPoints}</td>
                                                    </tr>
                                                    );
                                                })
                                            )}
                                        
                                        <tr>
                                            <td></td>
                                        </tr>

                                        {/* BENCH PLAYER  */}
                                        {elementTypes.map((type) => 
                                            fullTeamDetailsData?.picks.slice(11).filter((player) => player.element_type === type).map((player) => {
                                                const matchedPlayer = generalInfo?.elements?.find((element) => element.id === player.element);
                                                // Find player's live gameweek points
                                                const matchedPlayerPoints = liveGameweek?.elements?.find(element => element.id === player.element);
                                                const totalPoints = matchedPlayerPoints?.stats?.total_points ?? 0;
                                                const eventPoints = totalPoints * (player.multiplier >= 1 ? player.multiplier : 1); // Multiply by multiplier

                                                return (
                                                    <tr key={player.element} className="odd:bg-gray-300 even:bg-gray-200 text-black">
                                                        <td className="p-2" >
                                                                <PlayerCardLine
                                                                    key={player.element}
                                                                    player={matchedPlayer}
                                                                    // eventPoints={eventPoints}
                                                                    isCaptain={player.is_captain}
                                                                    isViceCaptain={player.is_vice_captain}
                                                                    />
                                                        </td>
                                                        <td className="p-2">{eventPoints}</td>
                                                    </tr>
                                                    );
                                                })
                                        )}
                                    </tbody>
                                </table>

                            </div> 
                            ) : ( 
                            <div className="bg-[url('../../public/images/pitch.png')] bg-cover bg-center flex-row justify-items-center w-full text-xs sm:text-sm font-medium">
                                {/* PITCH VIEW  */}
                                {elementTypes.map((type) => (
                                    <div key={type}>
                                        <div className="flex flex-wrap gap-4">
                                            {fullTeamDetailsData?.picks.slice(0, 11).filter((player) => player.element_type === type).map((player) => {
                                                    const matchedPlayer = generalInfo?.elements?.find((element) => element.id === player.element);
                                                    const eventPoints = (matchedPlayer?.event_points ?? 0) * (player.multiplier ?? 1);
                                                    
                                                    return (
                                                        <PlayerCard
                                                            key={player.element}
                                                            player={matchedPlayer}
                                                            isCaptain={player.is_captain}
                                                            isViceCaptain={player.is_vice_captain}
                                                            eventPoints={eventPoints}
                                                        />
                                                    );
                                                })}
                                        </div>
                                    </div>
                                ))}

                                {/* BENCH VIEW  */}
                                <div className="flex w-full gap-4 bg-black bg-opacity-50 p-6 mt-2 justify-center">
                                    {elementTypes.map((type) => 
                                        fullTeamDetailsData?.picks.slice(11, 16).filter((player) => player.element_type === type).map((player) => {
                                                const matchedPlayer = generalInfo?.elements?.find((element) => element.id === player.element);
                                                
                                                return (
                                                    <div key={player.element} className="">
                                                        <PlayerCard
                                                        key={player.element}
                                                        player={matchedPlayer}
                                                        eventPoints={matchedPlayer?.event_points ?? 0}
                                                        />
                                                    </div>
                                                );
                                            })
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* LEAGUE DETAILS HERE */}
                    <LeagueTable 
                    fullLeagueData={fullLeagueData}
                    // teamHistory={teamHistory}
                    fullTeam={fullTeam}
                    liveGameweek={liveGameweek}
                    generalInfo={generalInfo}
                    leagueData={leagueData}
                    />
                </div>
            </div>
        </>
    );
}
