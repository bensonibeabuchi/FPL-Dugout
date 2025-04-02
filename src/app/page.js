"use client";
import { useEffect, useState } from "react";
import { useGetTeamQuery } from "@/app/redux/services/fplApi";
import { useDispatch, useSelector } from "react-redux";
import { setTeamData } from "@/app/redux/slices/teamSlice"; 
import Navbar from "./components/common/Navbar";
import SelectLeague from "./components/common/SelectLeague";
import Image from "next/image";
import laptop from "../../public/images/laptop.png"
import BlogCard from "./components/common/BlogCard";
import Footer from "./components/common/Footer";
import Link from "next/link";

export default function Home() {
  const [teamId, setTeamId] = useState("");
  const [submittedTeamId, setSubmittedTeamId] = useState(null);
  const dispatch = useDispatch();
  const [showLeague, setShowLeague] = useState(false)

  const userTeam = useSelector((state) => state.team.teamData);

  const { data, error, isLoading } = useGetTeamQuery(submittedTeamId, {
    skip: !submittedTeamId, // Don't fetch until submit
    });

  
  useEffect(() => {
    if (typeof window !== "undefined"){

      const savedTeamId = localStorage.getItem("teamId");
      const savedTeamData = localStorage.getItem("teamData");
      
      if (savedTeamData && !userTeam) {  
        try {
          setSubmittedTeamId(savedTeamId);
          const teamData = JSON.parse(savedTeamData);
          dispatch(setTeamData(teamData));
        } catch(error){
          setSubmittedTeamId(null)

        }
      }
    }
  }, [dispatch, userTeam]); 


  useEffect(() => {
    if (typeof window !== "undefined"){
      
      if (data) {
        dispatch(setTeamData(data));
        localStorage.setItem("teamData", JSON.stringify(data));
      }
    }
  }, [data, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof window !== "undefined"){

      if (teamId.trim()) {
        localStorage.setItem("teamId", teamId);  // Store teamId in localStorage
        setSubmittedTeamId(teamId);  // Trigger API call
        setShowLeague(true);  // Show league selection
        localStorage.setItem("teamData", JSON.stringify(data));
      }
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
            <div className="text-white text-center w-80 mx-auto font-medium">
              <p>To find your FPL team ID:</p>
              <ul className="text-center">
                <li>1. Go to your <Link href="https://fantasy.premierleague.com/" className="text-blue-500 underline">FPL home page</Link> </li>
                <li>2. Click on the points tab</li>
                <li>3. Look at the address bar and copy the number that comes after &quot;entry/&quot;.</li>
              </ul>
            </div>
          </div>
        </div>
        {showLeague && <SelectLeague onClose={handleOnclose}/>}

        {error && <p className="text-center text-red-500 mt-4">Error fetching team</p>}
        
        <div className="sm:grid grid-rows-2 grid-cols-2 items-center bg-white sm:p-24 p-4">
          <div className="mx-auto">
            <Image src={laptop} width={700} height={700} alt="Website preview" className=""/>
          </div>
          <div className="items-center sm:text-left text-center sm:px-16 px-4 justify-center">
            <p className="sm:text-7xl text-4xl font-semibold ">LIVE DATA</p>
            <p className="py-4">We show your points, subs and rank in real-time!No waiting for FPL to update - see the true league impact of every goal, assist and clean sheet LIVE. We take care of the Autosubs, Captaincy switches and all the other stuff that can make it hard to know how well you are actually doing. Best of all, it is completely free.</p>
          </div>
        </div>

        {/* <div className="flex-col sm:grid-cols-1 md:grid-cols-2 w-full gap-8 justify-center items-center text-center mx-auto p-32 px-8 sm:px-80">
          <div>
            <p className="text-7xl font-semibold">FPL Tips and Content</p>
          </div>
          <div className="py-16 flex gap-24 justify-center">
            <BlogCard/>
            <BlogCard/>
            <BlogCard/>
          </div>

        </div> */}
      </div>
        <Footer/>
    </div>
  );
}
