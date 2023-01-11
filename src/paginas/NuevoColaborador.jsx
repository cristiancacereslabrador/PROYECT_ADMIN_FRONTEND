import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Alerta from "../components/Alerta";
import FormularioColaborador from "../components/FormularioColaborador";
import useProyectos from "../hooks/useProyectos";

const NuevoColaborador = () => {
  const {
    obtenerProyecto,
    proyecto,
    cargando,
    colaborador,
    agregarColaborador,
    alerta,
  } = useProyectos();
  const params = useParams();
  useEffect(() => {
    obtenerProyecto(params.id);
  }, []);

  // console.log("colaborador", colaborador);
  const cargandoSpin = () => {
    return (
      // <p className="animate-pulse">C A R G A N D O</p>
      <div className="sk-folding-cube">
        <div className="sk-cube1 sk-cube"></div>
        <div className="sk-cube2 sk-cube"></div>
        <div className="sk-cube4 sk-cube"></div>
        <div className="sk-cube3 sk-cube"></div>
      </div>
    );
  };

  if (cargando) {
    cargandoSpin();
  }
  if (!proyecto?._id) return <Alerta alerta={alerta} />;

  return (
    <>
      <h1 className="text-4xl font-black">
        Añadir Colaborador(a) al Proyecto: {proyecto.nombre}
      </h1>
      <div className="mt-10 flex justify-center">
        <FormularioColaborador />
      </div>
      {cargando
        ? cargandoSpin()
        : colaborador?._id && (
            <div className="flex justify-center mt-10">
              <div className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow w-full">
                <h2 className="text-center mb-10 text-2xl font-bold">
                  Resultado:{" "}
                </h2>
                <div className="">
                  <p className="">{colaborador.nombre}</p>
                  <button
                    type="button"
                    className="bg-slate-500 px-5 py-2 rounded-lg uppercase text-white font-bold text-sm"
                    onClick={() =>
                      agregarColaborador({ email: colaborador.email })
                    }
                  >
                    Agregar al Proyecto
                  </button>
                </div>
              </div>
            </div>
          )}
    </>
  );
};

export default NuevoColaborador;
