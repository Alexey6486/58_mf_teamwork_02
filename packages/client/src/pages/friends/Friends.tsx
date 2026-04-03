import { Helmet } from 'react-helmet';
import { type PageInitArgs } from '../../routes';
import {
  fetchFriendsTestThunk,
  selectFriends,
} from '../../slices/friends-slice';
import { usePage } from '../../hooks';
import { useSelector } from '../../store/store'

export const FriendsPageTest = () => {
  const friends = useSelector(selectFriends);
  usePage({ initPage: initFriendsPageTest });

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Страница друзей</title>
        <meta name="description" content="Страница друзей"/>
      </Helmet>
      Friends Test:
      {friends?.map?.((el) => el?.name ?? 'no name')}
    </div>
  )
};

export const initFriendsPageTest = async ({ dispatch }: PageInitArgs) => {
  // return dispatch(fetchFriendsTestThunk(ctx.clientToken));
  return dispatch(fetchFriendsTestThunk());
}
