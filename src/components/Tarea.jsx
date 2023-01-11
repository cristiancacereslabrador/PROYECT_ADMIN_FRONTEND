import React from "react";
import { formatearFecha } from "../helpers/formatearFecha";
import useAdmin from "../hooks/useAdmin";
import useProyectos from "../hooks/useProyectos";

const Tarea = ({ tarea }) => {
  const { handleModalEditarTarea, handleModalEliminarTarea, completarTarea } =
    useProyectos();
  const { descripcion, nombre, prioridad, fechaEntrega, estado, _id } = tarea;
  //console.log("tarea q tiene?", tarea);

  const admin = useAdmin();

  return (
    <div className="border-b p-5 flex justify-between items-center">
      <div className="flex flex-col items-start">
        <p className="mb-1 text-xl">{nombre}</p>
        <p className="mb-1 text-sm text-gray-500 uppercase">{descripcion}</p>
        <p className="mb-1 text-sm">{formatearFecha(fechaEntrega)}</p>
        <p className="mb-1 text-gray-600">Prioridad: {prioridad}</p>
        {/* {estado && <p className="text-xs bg-green-600 uppercase p-1 rounded-lg text-white">Completado por: {tarea.completado.nombre}</p>} */}
      </div>

      <div className="flex flex-col lg:flex-row gap-2">
        {" "}
        {admin && (
          <button
            className="bg-indigo-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
            onClick={() => handleModalEditarTarea(tarea)}
          >
            {/* <p className="animate-pulse"> */}
            Editar
            {/* </p> */}
          </button>
        )}
        {/* {estado ? ( */}
        <button
          className={`${
            estado ? "bg-green-600" : "bg-red-600"
          } px-4 py-3 text-white uppercase font-bold text-sm rounded-lg`}
          onClick={() => completarTarea(_id)}
        >
          {estado ? "Completa" : "Incompleta"}
        </button>
        {/* ) : ( */}
        {/* <button className="bg-gray-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg "
          onClick={() => completarTarea(_id)}>
            Incompleta
          </button> */}
        {/* )} */}
        {admin && (
          <button
            className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
            onClick={() => handleModalEliminarTarea(tarea)}
          >
            Eliminar
          </button>
        )}
      </div>
    </div>
  );
};

export default Tarea;
