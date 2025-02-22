import { useGetPlayerPhotoQuery } from "@/app/redux/services/fplApi";
import Image from "next/image";
import unknown from "../../../../public/images/unknown.png"

const PlayerCardHorizontal = ({ player, isCaptain, isViceCaptain, eventPoints }) => {
    if (!player || !player.opta_code) return null;

    const { opta_code, web_name } = player;

    // Fetch player photo only if `opta_code` is available
    const { data: playerPhoto, isLoading } = useGetPlayerPhotoQuery(
        { opta_code },
        { skip: !opta_code }
    );

    return (
        <div suppressHydrationWarning className="sm:w-20 w-8 flex flex-col items-center sm:m-4 m-1">
                    
                    {isLoading ? (
                        <Image src={ unknown} alt={web_name} width={200} height={200} className="object-contain sm:w-32 w-20" />
                    ) : playerPhoto ? (
                        <Image src={playerPhoto || unknown} alt={web_name} width={200} height={200} className="object-contain sm:w-20 w-16 bg-white bg-opacity-20 rounded-t-lg backdrop-blur-sm" />
                    ) : (
                        <Image src={ unknown} alt={web_name} width={200} height={200} className="object-contain sm:w-32 w-20" />
                    )}
                    <p suppressHydrationWarning className="bg-[#32383c]  sm:w-32 w-12 rounded-t-md sm:text-[10px] text-[8px] text-center font-semibold truncate text-white px-1 py-1">
                        {web_name} <span className="">{isCaptain ? "C" : ""} {isViceCaptain ? "VC" : ""}</span> 
                    </p>
                    <p suppressHydrationWarning className="bg-[#3a3f43]  sm:w-32 w-12 rounded-b-md sm:text-[10px] text-[8px] text-center truncate text-white px-1 py-1">
                        {eventPoints} pts
                    </p>
           
                </div>
    );
};

export default PlayerCardHorizontal;

