import { useGetTeamHistoryQuery } from '@/app/redux/services/fplApi';
import React, {useEffect} from 'react'

export default function TeamHistory({teamId, eventRealPoints, onRealTotalPointsUpdate}) {
    

    const { data: teamHistory } = useGetTeamHistoryQuery({teamId}, {skip: !teamId});


    // Get the last recorded gameweek before the current one
    const previousTotalPoints =
    teamHistory?.current?.length > 1 
        ? teamHistory.current[teamHistory.current.length - 2]?.total_points 
        : teamHistory?.current?.[0]?.total_points ?? 0;

    // Calculate realTotalPoints
    const realTotalPoints = previousTotalPoints + eventRealPoints;
    // console.log(realTotalPoints)

    useEffect(() => {
        if (teamId && onRealTotalPointsUpdate) {
            onRealTotalPointsUpdate(teamId, realTotalPoints);
        }
    }, [realTotalPoints, teamId, onRealTotalPointsUpdate]);
    

  return (
    <>
        <p>
            {realTotalPoints}
        </p>
    </>
  )
}
