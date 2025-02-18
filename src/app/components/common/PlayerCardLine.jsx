import { useGetPlayerPhotoQuery } from "@/app/redux/services/fplApi";
import Image from "next/image";
import unknown from "../../../../public/images/unknown.png"

const PlayerCardLine = ({ player, isCaptain, isViceCaptain, eventPoints }) => {
    if (!player || !player.opta_code) return null;

    const { opta_code, web_name } = player;

    // Fetch player photo only if `opta_code` is available
    const { data: playerPhoto, isLoading } = useGetPlayerPhotoQuery(
        { opta_code },
        { skip: !opta_code }
    );

    return (
        <div suppressHydrationWarning className='flex justify-between'>
            <div className="flex">
                {isLoading ? (
                    <Image src={unknown} alt={web_name} width={200} height={200} className="object-contain h-6 w-6" />
                ) : playerPhoto ? (
                    <Image src={playerPhoto} alt={web_name} width={200} height={200} className="object-contain h-6 w-6" />
                ) : (
                    <Image src={unknown} alt={web_name} width={200} height={200} className="object-contain h-6 w-6" />
                )}
                <div suppressHydrationWarning className="flex items-center px-2 py-1">
                    {web_name} {isCaptain ? <div><p className="bg-black text-white rounded-full ml-2 w-6 text-center">C</p></div> : ""}
                    {isViceCaptain ? <div><p className="bg-black text-white rounded-full ml-2 w-6 text-center">V</p></div> : ""}
                </div>
            </div>
            {/* <p className="text-left px-2 py-1">
                {eventPoints}
            </p> */}
        </div>
    );
};

export default PlayerCardLine;
