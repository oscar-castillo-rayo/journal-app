import { useEffect, useMemo, useState } from "react";

/**
 *
 * @param {recived a form} initialForm
 * @param {recived a formValidations} formValidations
 * @returns form state and funtions to manipulate it
 */
export const useForm = (initialForm = {}, formValidations = {}) => {
  const [formState, setFormState] = useState(initialForm);
  const [formValidation, setFormValidation] = useState({});

  //Cada vez que se cambia el valor del input se ejecuta esta función
  useEffect(() => {
    createValidators();
  }, [formState]);

  useEffect(() => {
    setFormState(initialForm);
  }, [initialForm]);

  const isFormValid = useMemo(() => {
    for (const formValue of Object.keys(formValidation)) {
      if (formValidation[formValue] !== null) return false;
    }
    return true;
  }, [formValidation]);

  const onInputChange = ({ target }) => {
    const { name, value } = target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const onResetForm = () => {
    setFormState(initialForm);
  };

  const createValidators = () => {
    //este es el objeto que se enviará al setFormValidation
    const formCheckedValues = {};

    //Se recorre cada una de las validaciones con el nombre de formField, este tendra los valores del objeto
    for (const formField of Object.keys(formValidations)) {
      //De las funciones se extrae el valor del arrego, es decir la funcion y el mensaje de error
      const [fn, errorMessage] = formValidations[formField];

      //se extae del objeto el nombre del formField y se le concatena 'Valid' esto sera igual a la funcion donde el formState posee el mismo nombre. si la funcion se cumple entonces debuelve null, de lo contrario el seegundo argumento erroMenssage
      formCheckedValues[`${formField}Valid`] = fn(formState[formField])
        ? null
        : errorMessage;
    }

    //Se setea el valor al setFormValidation, asi se sabe si todos cumplieron o no.
    setFormValidation(formCheckedValues);
    //console.log(formCheckedValues);
  };

  return {
    ...formState,
    formState,
    onInputChange,
    onResetForm,

    ...formValidation,
    isFormValid,
  };
};
