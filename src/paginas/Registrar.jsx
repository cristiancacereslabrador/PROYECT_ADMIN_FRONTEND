import React, { useState } from "react";
import { Link } from "react-router-dom";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";

const Registrar = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");
  const [alerta, setAlerta] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ([nombre, email, password, repetirPassword].includes("")) {
      // console.log("Todos los campos son obligatorios");
      setAlerta({
        msg: "Todos los campos son obligatorios",
        error: true,
      });
      return;
    }
    if (password !== repetirPassword) {
      setAlerta({
        msg: "Los password no son iguales",
        error: true,
      });
      return;
    }
    if (password.length < 6) {
      setAlerta({
        msg: "El password es muy corto, agrega mínimo 6 caracteres",
        error: true,
      });
      return;
    }
    setAlerta({});
    //CREAR EL USUARIO EN LA API
    // console.log("creando usuario :>> ");
    try {
      const { data } = await clienteAxios.post(`/usuarios`, {
        nombre,
        password,
        email,
      });
      console.log("respuesta.data :>> ", data);
      setAlerta({ msg: data.msg, error: false });
      setNombre("");
      setEmail("");
      setPassword("");
      setRepetirPassword("");
    } catch (error) {
      // console.log("error:", error.response.data.msg);
      setAlerta({ msg: error.response.data.msg, error: true });
    }
  };
  const { msg } = alerta;

  return (
    <>
      <h1 className="text-teal-600 font-black text-6xl capitalize">
        Crea Tu cuenta y administra tus{" "}
        <span className="text-slate-700">Proyectos</span>
      </h1>

      {msg && <Alerta alerta={alerta} />}

      <form
        className="my-10 bg-white shadow rounded-lg p-10"
        onSubmit={handleSubmit}
      >
        <div className="my-5">
          <label
            htmlFor="nombre"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            placeholder="Tu Nombre"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="my-5">
          <label
            htmlFor="email"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="E-mail de Registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="my-5">
          <label
            htmlFor="password"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password de Registro"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="my-5">
          <label
            htmlFor="password2"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Repetir Password
          </label>
          <input
            id="password2"
            type="password"
            placeholder="Reppetir tu Password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50 "
            value={repetirPassword}
            onChange={(e) => setRepetirPassword(e.target.value)}
          />
        </div>
        <input
          type="submit"
          value="Crear Cuenta"
          className="bg-teal-700 mb-5 w-full py-3 text-white uppercase font-bold rounded hover:cursor-pointer hover:bg-teal-800 transition-colors"
        />
      </form>
      <nav className="lg:flex lg:justify-between ">
        <Link
          className="block text-center font-bold my-5 to-slate-500 uppercase text-sm"
          to="/"
        >
          ¿Ya tienes una cuenta? Inicia Sesión
        </Link>
        <Link
          className="block text-center font-bold my-5 to-slate-500 uppercase text-sm"
          to="/olvide-password"
        >
          Olvide Mi Password
        </Link>
      </nav>
    </>
  );
};

export default Registrar;
