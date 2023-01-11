import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Alerta from "../components/Alerta";
import Colaborador from "../components/Colaborador";
import ModalEliminarColaborador from "../components/ModalEliminarColaborador";
import ModalEliminarTarea from "../components/ModalEliminarTarea";
import ModalFormularioTarea from "../components/ModalFormularioTarea";
import Tarea from "../components/Tarea";
import useAdmin from "../hooks/useAdmin";
import useAuth from "../hooks/useAuth";
import useProyectos from "../hooks/useProyectos";
import io from "socket.io-client";
let socket;

const Proyecto = () => {
  const params = useParams(); //console.log("params", params);
  const {
    obtenerProyecto,
    proyecto,
    cargando,
    handleModalTarea,
    alerta,
    submitTareasProyecto,
    eliminarTareasProyecto,
    actualizarTareasProyecto,
    cambiarEstadoTarea,
  } = useProyectos();
  // const auth = useAuth();
  const admin = useAdmin();
  // console.log('admin!', admin)
  // const [modal, setModal] = useState(false);
  useEffect(() => {
    obtenerProyecto(params.id);
  }, []);

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
    // socket = io("http://localhost:4000");
    socket.emit("Abrir Proyecto", params.id);
  }, []);

  useEffect(() => {
    socket.on("Tarea Agregada", (tareaNueva) => {
      // console.log("tareaNueva", tareaNueva);
      if (tareaNueva.proyecto === proyecto._id) {
        submitTareasProyecto(tareaNueva);
      }
    });

    socket.on("Tarea Eliminada", (tareEliminada) => {
      if (tareEliminada.proyecto === proyecto._id) {
        eliminarTareasProyecto(tareEliminada);
      }
    });

    socket.on("Tarea Actualizada", (tareActualizada) => {
      if (tareActualizada.proyecto._id === proyecto._id) {
        actualizarTareasProyecto(tareActualizada);
      }
    });

    socket.on("Nuevo Estado", (nuevoEstadoTarea) => {
      if (nuevoEstadoTarea.proyecto._id === proyecto._id) {
        cambiarEstadoTarea(nuevoEstadoTarea);
      }
    });
  });

  // useEffect(() => {
  //   socket.on("respuesta", (persona) => {
  //     console.log("persona", persona);
  //   });
  // });

  const { nombre } = proyecto;
  //console.log("proyecto===", proyecto);

  if (cargando) {
    return (
      // <p className="animate-pulse">C A R G A N D O</p>
      <div className="sk-folding-cube">
        <div className="sk-cube1 sk-cube"></div>
        <div className="sk-cube2 sk-cube"></div>
        <div className="sk-cube4 sk-cube"></div>
        <div className="sk-cube3 sk-cube"></div>
      </div>
    );
  }

  const { msg } = alerta;
  // console.log('proyecto=?', proyecto)
  // console.log('auth=?', auth)

  return (
    // msg && alerta.error ? (<Alerta alerta={alerta}/>) : (
    <>
      <div className="flex justify-between ">
        <h1 className="font-black text-4xl ">{nombre}</h1>
        {admin && (
          <div className="flex items-center gap-2 text-gray-400 hover:text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
              />
            </svg>
            <Link
              to={`/proyectos/editar/${params.id}`}
              className="uppercase font-bold"
            >
              Editar
            </Link>
          </div>
        )}
      </div>
      {admin && (
        <button
          onClick={handleModalTarea}
          type="button"
          className="text-sm mt-5 px-5 py-3 w-full md:w-auto rounded-lg uppercase font-bold bg-teal-400 text-white text-center flex gap-2 items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Nueva Tarea
        </button>
      )}
      <p className="font-bold text-xl mt-10">Tareas del Proyecto</p>

      {/* <div className="flex justify-center">
        <div className="w-full md:w-90 lg:w-1/2">
          {msg && <Alerta alerta={alerta} />}
        </div>
      </div> */}

      <div className="bg-white shadow mt-10 rounded-lg">
        {proyecto.tareas?.length ? (
          proyecto.tareas?.map((tarea) => (
            <Tarea key={tarea._id} tarea={tarea} />
          ))
        ) : (
          <p className="text-center my-5 p-10">
            No hay tareas en este proyecto
          </p>
        )}
      </div>
      {admin && (
        <>
          <div className="flex items-center justify-between mt-10">
            <p className="font-bold text-xl ">Colaboradores</p>
            <Link
              to={`/proyectos/nuevo-colaborador/${proyecto._id}`}
              className="text-gray-400 hover:text-black uppercase font-bold"
            >
              Añadir
            </Link>
          </div>
          <div className="bg-white shadow mt-10 rounded-lg">
            {proyecto.colaboradores?.length ? (
              proyecto.colaboradores?.map((colaborador) => (
                <Colaborador key={colaborador._id} colaborador={colaborador} />
              ))
            ) : (
              <p className="text-center my-5 p-10">
                No hay Colaboradores en este proyecto
              </p>
            )}
          </div>
        </>
      )}

      {/* <ModalFormularioTarea modal={modal} setModal={setModal} /> */}
      <ModalFormularioTarea />
      <ModalEliminarTarea />
      <ModalEliminarColaborador />
    </>
  );
  //  )
};

export default Proyecto;
