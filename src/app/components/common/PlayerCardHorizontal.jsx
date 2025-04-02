import { useGetPlayerPhotoQuery } from "@/app/redux/services/fplApi";
import Image from "next/image";
import unknown from "../../../../public/images/unknown.png"

const PlayerCardHorizontal = ({ player, isCaptain, isViceCaptain, eventPoints }) => {
    if (!player || !player.opta_code) return null;

    const { opta_code, web_name } = player;

   const { data: playerPhoto, isLoading } = useGetPlayerPhotoQuery(
        { opta_code },
        { skip: !opta_code }
    );

    return (
        <div suppressHydrationWarning className="sm:w-20 w-8 flex flex-col items-center m-1">
                    
                    {isLoading ? (
                        <Image src={ unknown} alt={web_name} width={200} height={200} className="object-contain sm:w-14 w-8" />
                    ) : playerPhoto ? (
                        <Image src={playerPhoto || unknown} alt={web_name} width={200} height={200} className="object-contain sm:w-20 w-12 bg-white bg-opacity-20 rounded-t-lg backdrop-blur-sm" />
                    ) : (
                        <Image src={ unknown} alt={web_name} width={200} height={200} className="object-contain sm:w-14 w-8" />
                    )}
                    <p suppressHydrationWarning className="bg-[#32383c] sm:w-20 w-8 rounded-t-md sm:text-[14px] text-[8px] text-center font-semibold truncate text-white px-1 py-1">
                        {web_name}
                    </p>
                    {(isCaptain || isViceCaptain) && (
                        <div className="absolute ml-14 mt-[88px] shadow-md">
                            <p className="bg-white text-black py-[2px] px-2 sm:text-[14px] text-[8px] text-center font-bold rounded-full">
                                {isCaptain ? "C" : ""} {isViceCaptain ? "V" : ""}
                            </p>
                        </div>
                    )}
                    <p suppressHydrationWarning className="bg-[#3a3f43] sm:w-20 w-8 rounded-b-md sm:text-[14px] text-[8px] text-center truncate text-white px-1 py-1">
                        {eventPoints} pts
                    </p>
           
                </div>
    );
};

export default PlayerCardHorizontal;

