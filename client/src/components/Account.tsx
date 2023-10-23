import { useDispatch, useSelector } from 'react-redux';
import { MouseEvent } from 'react';
import { AppDispatch, RootState } from '../store/index';
import { handleGetUsers, handleLogout, setUserEmail } from '../store/slice';

export function Account() {
  const userEmail = useSelector((state: RootState) => state.mainReducer.email);
  const users = useSelector((state: RootState) => state.mainReducer.users);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogoutClick = (e: MouseEvent<HTMLButtonElement>) => {
    // location.reload();
    dispatch(setUserEmail({ email: null }));
    dispatch(handleLogout());
  };
  const handleGetUsersClick = (e: MouseEvent<HTMLButtonElement>) => {
    // location.reload();
    dispatch(handleGetUsers());
  };

  return (
    <>
      <h1>User {userEmail}</h1>
      <button onClick={handleLogoutClick}>Logout</button>
      <button onClick={handleGetUsersClick}>Get users</button>
      {users?.map((item) => (
        <div key={item.email}>{item.email}</div>
      ))}
    </>
  );
}
