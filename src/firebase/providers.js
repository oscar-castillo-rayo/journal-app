import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { firebaseAuth } from "./config";

//creamos el proveedor en este caso es google, puede ser igual con Facebook, twiter, etc.
const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});

export const signInWithGoogle = async () => {
  try {
    //se espera el resultado de iniciar seción utilizando un popup. Los argumentos que se le envian son el firebase creado en config.js y el proveedor.
    const result = await signInWithPopup(firebaseAuth, googleProvider);

    // con GoogleAuthProvider vamos a poder tener las credenciales del inicio de sesión.
    // const credentials = GoogleAuthProvider.credentialFromResult(result);

    const { displayName, email, photoURL, uid } = result.user;

    return {
      ok: true,
      displayName,
      email,
      photoURL,
      uid,
    };
  } catch (error) {
    // Handle Errors here.
    //const errorCode = error.code;
    const errorMessage = error.message || "";
    // The email of the user's account used.
    //const email = error.customData.email;
    // The AuthCredential type that was used.
    //const credential = GoogleAuthProvider.credentialFromError(error);
    return {
      ok: false,
      errorMessage,
    };
  }
};

export const registerUserWithEmailPassword = async ({
  email,
  password,
  displayName,
}) => {
  try {
    //
    const resp = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    const { uid, photoURL } = resp.user;
    //Actualizar el perfil del usuario
    await updateProfile(firebaseAuth.currentUser, { displayName });

    return {
      ok: true,
      displayName,
      email,
      photoURL,
      uid,
    };
  } catch (error) {
    return { ok: false, errorMessage: error.message };
  }
};

export const loginWithEmailPassword = async ({ email, password }) => {
  try {
    const resp = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    const { uid, photoURL, displayName } = resp.user;

    return {
      ok: true,
      displayName,
      email,
      photoURL,
      uid,
    };
  } catch (error) {
    return { ok: false, errorMessage: error.message };
  }
};

export const logoutFirebase = async () => {
  return await firebaseAuth.signOut();
};
