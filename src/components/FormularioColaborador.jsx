import React, { useState } from "react";
import useProyectos from "../hooks/useProyectos";
import Alerta from "./Alerta";

const FormularioColaborador = () => {
  const [email, setEmail] = useState("");

  const { alerta, mostrarAlerta, submitColaborador } = useProyectos();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "") {
      mostrarAlerta({
        msg: "El Email es Obligatorio",
        error: true,
      });
      return;
    }
    // console.log("email es", email);
    submitColaborador(email);
  };

  const { msg } = alerta;

  return (
    <form
      // className="bg-white py-10 px-5 w-full md:w-10/12 lg:w-1/2 rounded-lg shadow"
      className="bg-white py-10 px-5 w-full md:w-1/2 lg:w-1/2 rounded-lg shadow"
      onSubmit={handleSubmit}
    >
      {msg && <Alerta alerta={alerta} />}
      <div className="mb-5">
        {" "}
        <label
          htmlFor="email"
          className="to-gray-700 uppercase font-bold text-sm"
        >
          {" "}
          Email colaborador
        </label>
        <input
          type="email"
          id="email"
          placeholder="Email del usuario"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <input
        type="submit"
        className="bg-teal-600 hover:bg-teal-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded-md"
        value="Buscar Colaborador"
      />
    </form>
  );
};

export default FormularioColaborador;