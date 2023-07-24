export const fileUpload = async (file) => {
  if (!file) throw new Error("No existe archivo a subir");

  //la direccion de donde se va a subir el archivo
  const cloudUrl = "https://api-ap.cloudinary.com/v1_1/reactprojects/upload";

  const formData = new FormData();
  //en le formData enviamos clave, valor
  formData.append("upload_preset", "react-journal");
  //clave, valor del archivo  a subir
  formData.append("file", file);

  try {
    const resp = await fetch(cloudUrl, {
      method: "POST",
      body: formData,
    });

    if (!resp.ok) {
      throw new Error("No se pudo subir imagen");
    }

    const cloudResp = await resp.json();

    //lo que retorno es el url seguro para que puedan ser vistas mediante el url.
    return cloudResp.secure_url;
  } catch (error) {
    console.log(error);
    throw new Error(error.message);
  }
};
