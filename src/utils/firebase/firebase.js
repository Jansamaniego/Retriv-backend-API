import * as firebase from 'firebase/app';
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: 'retriv-a26c8.firebaseapp.com',
  projectId: 'retriv-a26c8',
  storageBucket: 'retriv-a26c8.appspot.com',
  messagingSenderId: '491764733704',
  appId: '1:491764733704:web:d505a6a2b66be9b2c4bebd',
  measurementId: 'G-LL7NVYV8MS',
};

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export const auth = getAuth();

export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);

export const signInWithGoogleRedirect = () =>
  signInWithRedirect(auth, googleProvider);

export const db = getFirestore(app);

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  const userDocRef = doc(db, 'users', userAuth.uid);

  console.log(userDocRef);

  const userSnapshot = await getDoc(userDocRef);
  console.log(userSnapshot);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log('error creating the user', error.message);
    }

    return userDocRef;
  }
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await createUserWithEmailAndPassword(auth, email, password);
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => {
  await signOut(auth);
};

export const onAuthStateChangedListener = (callback) => {
  onAuthStateChanged(auth, callback);
};

export const addProduct = async (product) => {
  const productsCollectionRef = collection(db, 'products');

  try {
    await setDoc(productsCollectionRef, {
      name: product.name,
      price: product.price,
      imgSrc: product.imgSrc,
    });
    return product;
  } catch (error) {
    console.log('failed to add product in products collection', error);
  }
};

export const getProducts = async () => {
  const productsCollectionRef = collection(db, 'products');
  try {
    const products = await getDocs(productsCollectionRef);
    return products;
  } catch (error) {
    console.log('fetching products failed', error);
  }
};

export const getProduct = async (productId) => {
  try {
    const product = await getDoc(db, 'products', productId);
    return product;
  } catch (error) {
    console.log('fetching product failed', error);
  }
};

export const editProduct = async (productId, productNewValues) => {
  const productDocRef = doc(db, 'products', productId);
  try {
    await setDoc(productDocRef, {
      ...productNewValues,
    });
  } catch (error) {
    console.log('editing product failed', error);
  }
};

export const deleteProduct = async (productId) => {
  const deletedProduct = await deleteDoc(doc(db, 'products', productId));
  return deletedProduct;
};
