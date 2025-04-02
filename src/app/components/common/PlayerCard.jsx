import { useGetPlayerPhotoQuery } from "@/app/redux/services/fplApi";
import Image from "next/image";
import unknown from "../../../../public/images/unknown.png"

const PlayerCard = ({ player, isCaptain, isViceCaptain, eventPoints, playerColor }) => {
    if (!player || !player.opta_code) return null;

    const { opta_code, web_name } = player;

    // Fetch player photo only if `opta_code` is available
    const { data: playerPhoto, isLoading } = useGetPlayerPhotoQuery(
        { opta_code },
        { skip: !opta_code }
    );

    return (
        <div suppressHydrationWarning className="sm:w-14 w-12 flex flex-col items-center mt-1">
            
            {isLoading ? (
                <Image src={ unknown} alt={web_name} width={200} height={200} className="object-contain w-14 h-14 " />
            ) : playerPhoto ? (
                <Image src={playerPhoto || unknown} alt={web_name} width={200} height={200} className="object-contain w-14 h-14 bg-white bg-opacity-20 rounded-t-lg backdrop-blur-sm" />
            ) : (
                <Image src={ unknown} alt={web_name} width={200} height={200} className="object-contain w-14 h-14" />
            )}
            <p suppressHydrationWarning className="bg-[#32383c] rounded-t-md sm:text-[10px] text-[8px] text-center font-semibold truncate text-white px-1 py-1 w-full">
                {web_name} 
            </p>
            {(isCaptain || isViceCaptain) && (
                <div className="absolute ml-12">
                    <p className="bg-white text-black py-[2px] px-2 sm:text-[10px] font-bold text-[8px] text-center rounded-full">
                        {isCaptain ? "C" : ""} {isViceCaptain ? "V" : ""}
                    </p>
                </div>
            )}
            <p suppressHydrationWarning className="bg-[#3a3f43] rounded-b-md sm:text-[10px] text-[8px] text-center truncate text-white px-1 py-1 w-full">
                {eventPoints} pts
            </p>
            {/* <p>{playerColor}</p> */}
        </div>
    );
};

export default PlayerCard;
