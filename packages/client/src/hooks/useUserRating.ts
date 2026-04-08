import { useEffect } from "react";
import { useDispatch, useSelector } from "../store/store";
import { selectUser, setUserRating } from "../slices/user-slice";
import { fetchLeaderboardThunk, selectLeaderboard } from "../slices/leaderboard-slice";
import { RATING_FIELD } from "../constants/leaderboard";
import { fromLeaderboardData } from "../utils/fromLeaderboardData";

export function useUserRating() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const leaderboard = useSelector(selectLeaderboard);

    const userId = user?.id;

    useEffect(() => {
        if(!userId) return;

        dispatch(
            fetchLeaderboardThunk({
                cursor: 0
            })
        );
    }, [dispatch, userId])

    useEffect(() => {
        const { data, isLoading } = leaderboard;

        if(isLoading || !data || !userId) return;
        
        const itemsRating = fromLeaderboardData(data);
        const userItem = itemsRating.find(item => item.id === userId);

        if(userItem){
            const score = userItem[RATING_FIELD];

            dispatch(
                setUserRating(score)
            );
        } else {
            dispatch(
                setUserRating(0)
            );
        }
        
    }, [leaderboard, userId, dispatch])
}