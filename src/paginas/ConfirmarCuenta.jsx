import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Alerta from "../components/Alerta";
import clienteAxios from "../config/clienteAxios";

const ConfirmarCuenta = () => {
  const [alerta, setAlerta] = useState({});
  const [cuentaConfirmada, setCuentaConfirmada] = useState(false);

  const params = useParams();
  // console.log("params :>> ", params);
  const { id } = params;

  useEffect(() => {
    const confirmarCuenta = async () => {
      try {
        const url = `/usuarios/confirmar/${id}`;
        const { data } = await clienteAxios(url);
        // console.log("data :>> ", data);
        setAlerta({
          msg: data.msg,
          error: false,
        });
        setCuentaConfirmada(true);
      } catch (error) {
        // console.log("error", error);
        setAlerta({
          msg: error.response.data.msg,
          error: true,
        });
      }
    };
    // return () => confirmarCuenta();
    confirmarCuenta();
  }, []);

  const { msg } = alerta;

  return (
    <>
      {/* <div className="bg-gray-100 min-h-screen"> */}
      <div className="flex flex-col text-center my-10 md:mx-40 md:px-10 md:py-10">
        <h1 className="text-teal-600 font-black text-6xl capitalize">
          Confirma tu cuenta y comienza a crear tus{" "}
          <span className="text-slate-700">Proyectos</span>
        </h1>

        <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">
          {msg && <Alerta alerta={alerta} />}
          {cuentaConfirmada && (
            <Link
              className="block text-center font-bold my-5 to-slate-500 uppercase text-sm"
              to="/"
            >
              Inicia Sesión
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default ConfirmarCuenta;
