"use client";
import { useEffect, useState } from "react";
import { useGetTeamQuery } from "@/app/redux/services/fplApi";
import { useDispatch, useSelector } from "react-redux";
import { setTeamData } from "@/app/redux/slices/teamSlice"; 
import Navbar from "./components/common/Navbar";
import Link from "next/link";
import SelectLeague from "./components/common/SelectLeague";
import Image from "next/image";
import laptop from "../../public/images/laptop.png"
import BlogCard from "./components/common/BlogCard";
import Footer from "./components/common/Footer";

export default function Home() {
  const [teamId, setTeamId] = useState("");
  const [submittedTeamId, setSubmittedTeamId] = useState(null);
  const dispatch = useDispatch();
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
    <div>
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
        
        <div className="grid sm:grid-cols-1 md:grid-cols-2 w-full gap-8 justify-center items-center text-center mx-auto p-32 px-16 sm:px-80 bg-white">
          <div className="items-center justify-center mx-auto w-full">
            <Image src={laptop} width={433} height={306} alt="Website preview"/>
          </div>
          <div className="items-center justify-center my-auto">
            <p className="sm:text-7xl text-xl font-semibold">LIVE DATA</p>
            <p className="py-4 text-left truncate">We show your points, subs and rank in real-time!No waiting for FPL to update - see the true league impact of every goal, assist and clean sheet LIVE. We take care of the Autosubs, Captaincy switches and all the other stuff that can make it hard to know how well you are actually doing. Best of all, it is completely free.</p>
          </div>
        </div>

        <div className="flex-col sm:grid-cols-1 md:grid-cols-2 w-full gap-8 justify-center items-center text-center mx-auto p-32 px-8 sm:px-80">
          <div>
            <p className="text-7xl font-semibold">FPL Tips and Content</p>
          </div>
          <div className="py-16 flex gap-24 justify-center">
            <BlogCard/>
            <BlogCard/>
            <BlogCard/>
          </div>

        </div>
        <Footer/>


        

      </div>
    </div>
  );
}
