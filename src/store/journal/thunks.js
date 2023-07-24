import { async } from "@firebase/util";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore/lite";
import { firebaseDB } from "../../firebase/config";
import { fileUpload } from "../../helpers/fileUpload";
import { loadNotes } from "../../helpers/loadNotes";
import {
  addNewEmptyNote,
  deleteNoteById,
  savingNewNode,
  setActiveNote,
  setNotes,
  setPhotosToActiveNote,
  setSaving,
  updateNotes,
} from "./journalSlice";

export const startNewNote = () => {
  //puedo acceder al estado del usuario desde el getState debido a que el store lo tiene almacenado por lo cual puedo acceder desde cualquier lado que este dentro del store.
  return async (dispatch, getState) => {
    const { uid } = getState().auth;
    dispatch(savingNewNode());

    const newNote = {
      title: "",
      body: "",
      imageUrls: [],
      date: new Date().getTime(),
    };

    //para crear la referencia se agrega la base de datos que se realizo en config y un path con la direccion de la base de datos donde se va a insertar los datos.
    const newDoc = doc(collection(firebaseDB, `${uid}/journal/notes`));

    //para guardar datos se utiliza el setDoc que recibe una direccion de referencia en este cado newDoc y lo que se va a insertar.
    await setDoc(newDoc, newNote);

    newNote.id = newDoc.id;
    dispatch(addNewEmptyNote(newNote));
    dispatch(setActiveNote(newNote));
  };
};

export const startLoadingNotes = () => {
  return async (dispatch, getState) => {
    const { uid } = getState().auth;
    if (!uid) throw new Error("El UID del usuario no existe");

    const notes = await loadNotes(uid);

    dispatch(setNotes(notes));
  };
};

export const startSaveNote = () => {
  return async (dispatch, getState) => {
    dispatch(setSaving());
    const { uid } = getState().auth;
    const { active: note } = getState().journal;

    //Se crea una nueva constante que va a guardar todos los datos exparcidos de note, para poder eliminar el id y que no se cree uno nuevo, es decir manipular el mismo id que se vaya a modificar luego.
    const noteToFirestore = { ...note };
    //con delete se elimina, de la nueva nota el id
    delete noteToFirestore.id;
    //Como el id esta eliminado entonces se toma el id de la note que viene del journal
    const docRef = doc(firebaseDB, `${uid}/journal/notes/${note.id}`);
    //para guardar el valor o mas bien en este caso actualizar se envia al setDoc el docRef con la direccion, el noteToFirestore con los datos curados y el merge en true para que acrualize solo los datos que no tenga.
    await setDoc(docRef, noteToFirestore, { merge: true });
    dispatch(updateNotes(note));
  };
};

export const startUploadingFiles = (files = []) => {
  return async (dispatch) => {
    dispatch(setSaving());

    //await fileUpload(files[0]);
    const fileUploadPromises = [];

    //para insertar varios archivos de manera simultanea utilizo un arreglo de promesas donde le envio las solitudes mediante el fileUpload
    for (const file of files) {
      fileUploadPromises.push(fileUpload(file));
    }

    //En esta linea se envia a ejecutar las promesas. Cuando todas las promesas sean cumplidas me va a regresar la respuesta de cada una de ellas en el mismo orden en el que fueron enviadas.
    const photosUrls = await Promise.all(fileUploadPromises);

    dispatch(setPhotosToActiveNote(photosUrls));
  };
};

export const startDeletingNote = () => {
  //dispatch para llamar las funciones del slice y getState para obtener el id de usuario actual y la nota actual
  return async (dispatch, getState) => {
    const { uid } = getState().auth;
    const { active: note } = getState().journal;

    //aca se crea la referencia a la nota
    const docRef = doc(firebaseDB, `${uid}/journal/notes/${note.id}`);

    await deleteDoc(docRef);

    dispatch(deleteNoteById(note.id));
  };
};
