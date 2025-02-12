"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetTeamQuery } from "@/app/redux/services/fplApi";
import { useDispatch, useSelector } from "react-redux";
import { setTeamData } from "@/app/redux/slices/teamSlice"; 
import Navbar from "./components/common/Navbar";
import Link from "next/link";
import SelectLeague from "./components/common/SelectLeague";


export default function Home() {
  const [teamId, setTeamId] = useState("");
  const [submittedTeamId, setSubmittedTeamId] = useState(null);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showLeague, setShowLeague] = useState(true)

  const userTeam = useSelector((state) => state.team.teamData);

  const { data, error, isLoading } = useGetTeamQuery(submittedTeamId, {
    skip: !submittedTeamId, // Don't fetch until submit
  });

  // Load team ID & data from localStorage on mount
  useEffect(() => {
    const savedTeamId = localStorage.getItem("teamId");
    const savedTeamData = localStorage.getItem("teamData");
  
    if (savedTeamData && !userTeam) {  // Only dispatch if there's no existing data
      setSubmittedTeamId(savedTeamId);
      const teamData = JSON.parse(savedTeamData);
      dispatch(setTeamData(teamData));
    }
  }, [dispatch, userTeam]); // Add userTeam as dependency to prevent overwriting existing data

  // Save data to Redux & localStorage when API returns it
  useEffect(() => {
    if (data) {
      dispatch(setTeamData(data));
      localStorage.setItem("teamData", JSON.stringify(data));
    }
  }, [data, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (teamId.trim()) {
      localStorage.setItem("teamId", teamId);  // Store teamId in localStorage
      setSubmittedTeamId(teamId);  // Trigger API call
      setShowLeague(true);  // Show league selection
      localStorage.setItem("teamData", JSON.stringify(data));
    }
  };
  

  const handleOnclose = () => {
    setShowLeague(false)
  }

  return (
    <>
      <Navbar/>
      <div>
        <div className="relative bg-[url('../../public/images/background.png')] bg-cover bg-center text-center justify-center items-center flex w-full h-[962px]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
          <div className="relative w-4/5 items-center">
            <p className="font-bold text-4xl md:text-8xl text-center text-white uppercase">
              The Ultimate Fantasy Experience
            </p>
            <form
              onSubmit={handleSubmit}
              className="bg-[#E6E6E6] space-y-4 w-[264px] items-center justify-center mx-auto rounded-lg p-4 m-8"
            >
              <input
                type="text"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                placeholder="Enter your team ID"
                className="p-4 w-full rounded-md text-center"
              />
              <button
                type="submit"
                className="text-center bg-[#00ff85] hover:bg-[#37c97d] hover:scale-[1.01] rounded-lg w-full justify-center p-4 text-[#38003c] font-medium"
                disabled={isLoading} // Disable button while loading
              >
                {isLoading ? "Loading..." : "Lets Go"}
              </button>
            </form>
          </div>
        </div>
        {showLeague && <SelectLeague onClose={handleOnclose}/>}

        {error && <p className="text-center text-red-500 mt-4">Error fetching team</p>}
        
        {userTeam && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold">Your Team Data:</h2>
            <p>Team Name: {userTeam.name}</p>
            
          </div>
        )}
        <Link href="/about">
          <p className="text-3xl p-8">About Us</p>
        </Link>
        <Link href="/dashboard">
          <p className="text-3xl p-8">Dashboard Us</p>
        </Link>
      </div>
    </>
  );
}
