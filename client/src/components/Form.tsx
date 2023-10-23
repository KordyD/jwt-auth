import { useDispatch, useSelector } from 'react-redux';
import { MouseEvent, useState } from 'react';
import { AppDispatch, RootState } from '../store';
import { handleLogin, handleRegister, setUserEmail } from '../store/slice';
import { formData } from '../API';

export function Form() {
  const dispatch = useDispatch<AppDispatch>();
  const handleLoginClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // location.reload();
    dispatch(setUserEmail({ email: userData.email }));
    dispatch(handleLogin(userData));
  };

  const handleRegisterClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // location.reload();

    dispatch(setUserEmail({ email: userData.email }));
    dispatch(handleRegister(userData));
  };

  const [userData, setUserData] = useState<formData>({
    email: null,
    password: null,
  });

  return (
    <form className='form'>
      <label>
        <p>Email</p>
        <input
          type='email'
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
      </label>
      <label>
        <p>Password</p>
        <input
          type='password'
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
        />
      </label>
      <button onClick={handleLoginClick}>Sign In!</button>
      <button onClick={handleRegisterClick}>Sign Up!</button>
    </form>
  );
}
