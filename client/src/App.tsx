import { Account } from './components/Account';
import { FormEvent, MouseEvent, useEffect, useState } from 'react';
import './App.css';
import { login, logout, refresh, register } from './API';
import { AppDispatch, RootState } from './store/index';
import { useSelector, useDispatch } from 'react-redux';
import { Form } from './components/Form';
import { checkAuth } from './store/slice';

function App() {
  const isAuth = useSelector((state: RootState) => state.mainReducer.isAuth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      dispatch(checkAuth());
    }
  }, []);

  return (
    <>
      {!isAuth ? (
        <>
          <h1>Authorize!</h1>
          <Form />
        </>
      ) : (
        <>
          <Account />
        </>
      )}
      {/* <Form /> */}
    </>
  );
}

// st087640@student.spbu.ru
// 12345678

export default App;
