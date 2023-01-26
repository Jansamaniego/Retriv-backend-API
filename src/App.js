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
  addCollectionAndDocuments,
  createUserDocumentFromAuth,
  onAuthStateChangedListener,
} from './utils/firebase/firebase';
import { fetchProductsAsync } from './store/product/productAction';
import { setCurrentUser } from './store/user/userAction';
import Authentication from './routes/authentication/Authentication';
import RootLayout from './layouts/RootLayout';
import Home from './routes/home/Home';
import SignUpForm from './components/signUpForm/SignUpForm';
import SignInForm from './components/signInForm/SignInForm';

const App = (props) => {
  const dispatch = useDispatch();

  const productsArray = [
    {
      name: 'cat1',
      price: 212,
      imgSrc: 'http://placekitten.com/200/300',
    },
    {
      name: 'cat2',
      price: 4234,
      imgSrc: 'http://placekitten.com/200/300',
    },
    {
      name: 'cat3',
      price: 534,
      imgSrc: 'http://placekitten.com/200/300',
    },
    {
      name: 'cat4',
      price: 545,
      imgSrc: 'http://placekitten.com/200/300',
    },
    {
      name: 'cat5',
      price: 2133,
      imgSrc: 'http://placekitten.com/200/300',
    },
  ];

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

  useEffect(() => {
    dispatch(fetchProductsAsync());
  }, []);

  // useEffect(() => {
  //   addCollectionAndDocuments('products', productsArray);
  // }, []);

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
