import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../store/auth";
import { firebaseAuth } from "../firebase/config";
import { onAuthStateChanged } from "@firebase/auth";
import { startLoadingNotes } from "../store/journal/thunks";

export const UseCheckAuth = () => {
  const { status } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) return dispatch(logout());

      //se puede enviar tambien el user debido a que en login se va a desestructurar y tomar lo que se necesite de user
      const { uid, email, displayName, photoURL } = user;
      dispatch(login({ uid, email, displayName, photoURL }));
      dispatch(startLoadingNotes());
    });
  }, []);

  return status;
};
