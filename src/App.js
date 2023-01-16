import { useEffect } from 'react';
import {
  Routes,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from 'react-router-dom';
import Navigation from './components/navigation/Navigation';
import { useDispatch } from 'react-redux';

import './app.module.scss';
import {
  createUserDocumentFromAuth,
  onAuthStateChangedListener,
} from './utils/firebase/firebase';
import { setCurrentUser } from './store/user/userAction';
import Authentication from './routes/authentication/Authentication';
import RootLayout from './layouts/RootLayout';
import Home from './routes/home/Home';
import SignUpForm from './components/signUpForm/SignUpForm';
import SignInForm from './components/signInForm/SignInForm';

const App = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user) => {
      console.log(user, 'auth listener fired');
      if (user) {
        createUserDocumentFromAuth(user);
      }
      dispatch(setCurrentUser(user));
    });

    return unsubscribe;
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="auth" element={<Authentication />}>
          <Route path="signup" element={<SignUpForm />} />
          <Route path="signin" element={<SignInForm />} />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
