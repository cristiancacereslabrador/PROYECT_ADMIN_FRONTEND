import { useEffect, createContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";
import io, { Socket } from "socket.io-client";
import useAuth from "../hooks/useAuth";
let socket;

const ProyectosContext = createContext();

const ProyectosProvider = ({ children }) => {
  const [proyectos, setProyectos] = useState([]);
  const [alerta, setAlerta] = useState({});
  const [proyecto, setProyecto] = useState({});
  const [cargando, setCargando] = useState(false);
  const [modalFormularioTarea, setModalFormularioTarea] = useState(false);
  const [tarea, setTarea] = useState({});
  const [modalEliminarTarea, setModalEliminarTarea] = useState(false);
  const [colaborador, setColaborador] = useState({});
  const [modalEliminarColaborador, setModalEliminarColaborador] =
    useState(false);
  const [buscador, setBuscador] = useState(false);

  const { auth } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const obtenerProyectos = async () => {
      try {
        const token = localStorage.getItem("token");
        // console.log("token? :>> ", token);
        if (!token) return;
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await clienteAxios("/proyectos", config);
        // console.log("data?", data);
        setProyectos(data);
      } catch (error) {
        console.log("error", error);
      }
    };
    obtenerProyectos();
  }, [auth]);

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
  }, []);

  const mostrarAlerta = (alerta) => {
    setAlerta(alerta);
    setTimeout(() => {
      setAlerta({});
    }, 5000);
  };

  const submitProyecto = async (proyecto) => {
    // console.log("proyecto:", proyecto);
    if (proyecto.id) await editarProyecto(proyecto);
    else await nuevoProyecto(proyecto);
    return;

    try {
      const token = localStorage.getItem("token");
      // console.log("token? :>> ", token);
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      //ORIGINAL
      const { data } = await clienteAxios.post("/proyectos", proyecto, config);
      console.log("data CONSEGUIDA", data);

      setProyectos([...proyectos, data]);

      setAlerta({ msg: "Proyecto Creado Correctamente", error: false });

      setTimeout(() => {
        setAlerta({});
        navigate("/proyectos");
      }, 3000);
    } catch (error) {
      console.log("errOOOOOR :>> ", error);
    }
  };

  const editarProyecto = async (proyecto) => {
    // console.log("editando");

    try {
      const token = localStorage.getItem("token");
      // console.log("token? :>> ", token);
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.put(
        `/proyectos/${proyecto.id}`,
        proyecto,
        config
      );
      // console.log("data", data);
      // SINCRONIZAR EL STATE
      const proyectosActualizados = proyectos.map((proyectoState) =>
        proyectoState._id === data._id ? data : proyectoState
      );
      console.log("proyectosActualizados", proyectosActualizados);
      setProyectos(proyectosActualizados);
      // MOSTRAR LA ALERTA
      setAlerta({ msg: "Proyecto Actualizado Correctamente", error: false });

      setTimeout(() => {
        setAlerta({});
        navigate("/proyectos");
      }, 3000);
      //REDIRECCIONAR
    } catch (error) {
      console.log("error", error);
    }
  };
  const nuevoProyecto = async (proyecto) => {
    // console.log("creando");

    try {
      const token = localStorage.getItem("token");
      // console.log("token? :>> ", token);
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      //ORIGINAL
      const { data } = await clienteAxios.post("/proyectos", proyecto, config);
      // console.log("data CONSEGUIDA", data);

      setProyectos([...proyectos, data]);

      setAlerta({ msg: "Proyecto Creado Correctamente", error: false });

      setTimeout(() => {
        setAlerta({});
        navigate("/proyectos");
      }, 3000);
    } catch (error) {
      // console.log("error :>> ", error);
    }
  };

  const obtenerProyecto = async (id) => {
    setCargando(true);
    // console.log("id :>>", id);
    try {
      const token = localStorage.getItem("token");
      // console.log("token? :>> ", token);
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios(`/proyectos/${id}`, config);
      // console.log("data", data);
      setProyecto(data);
      setAlerta({});
    } catch (error) {
      navigate("/proyectos");
      // console.log("error", error);
      setAlerta({ msg: error.response.data.msg, error: true });
      setTimeout(() => {
        setAlerta({});
      }, 3000);
    } finally {
      setCargando(false);
    }
  };

  const eliminarProyecto = async (id) => {
    // console.log("eliminando", id);
    try {
      const token = localStorage.getItem("token");
      // console.log("token? :>> ", token);
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.delete(`/proyectos/${id}`, config);
      // console.log("data==", data);
      setAlerta({ msg: data.msg, error: false });
      //SINCRONIZAR EL STATE
      const proyectosActualizados = proyectos.filter(
        (proyectoState) => proyectoState._id !== id
      );
      // console.log(proyectosActualizados);
      setProyectos(proyectosActualizados);

      setTimeout(() => {
        setAlerta({});
        navigate("/proyectos");
      }, 3000);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleModalTarea = () => {
    setModalFormularioTarea(!modalFormularioTarea);
    setTarea({});
  };

  const submitTarea = async (tarea) => {
    // console.log("tarea?", tarea);
    if (tarea?.id) {
      await editarTarea(tarea);
    } else {
      await crearTarea(tarea);
    }
  };

  const crearTarea = async (tarea) => {
    try {
      const token = localStorage.getItem("token");
      // console.log("token? :>> ", token);
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.post(`/tareas`, tarea, config);
      // console.log("data", data);

      setAlerta({});
      setModalFormularioTarea(false);

      //SOCKET IO
      socket.emit("Nueva Tarea", data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const editarTarea = async (tarea) => {
    try {
      const token = localStorage.getItem("token");
      // console.log("token? :>> ", token);
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.put(
        `/tareas/${tarea.id}`,
        tarea,
        config
      );
      // console.log("data", data);

      setAlerta({});
      setModalFormularioTarea(false);

      //SOCKET
      socket.emit("Actualizar Tarea", data);
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleModalEditarTarea = (tarea) => {
    // console.log("tarea", tarea);
    setTarea(tarea);
    setModalFormularioTarea(true);
  };

  const handleModalEliminarTarea = (tarea) => {
    setTarea(tarea);
    setModalEliminarTarea(!modalEliminarTarea);
  };

  const eliminarTarea = async () => {
    // console.log("tarea??", tarea);
    try {
      const token = localStorage.getItem("token");
      // console.log("token? :>> ", token);
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.delete(
        `/tareas/${tarea._id}`,
        config
      );
      setAlerta({
        msg: data.msg,
        error: false,
      });
      // console.log("data", data);

      //SOCKET
      socket.emit("Eliminar Tarea", tarea);
      setTarea({});
      setModalEliminarTarea(false);
      setTimeout(() => {
        setAlerta({});
      }, 3000);
    } catch (error) {
      console.log("error", error);
    }
  };

  const submitColaborador = async (email) => {
    // console.log("email", email);
    setCargando(true);

    try {
      const token = localStorage.getItem("token");
      // console.log("token? :>> ", token);
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.post(
        "/proyectos/colaboradores",
        { email },
        config
      );
      // console.log("data", data);
      setColaborador(data);
      setAlerta({});
    } catch (error) {
      // console.log("error", error);
      setAlerta({ msg: error.response.data.msg, error: true });
    } finally {
      setCargando(false);
    }
  };

  const agregarColaborador = async (email) => {
    // console.log("email", email);
    // console.log("proyecto", proyecto);

    try {
      const token = localStorage.getItem("token");
      // console.log("token? :>> ", token);
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.post(
        `/proyectos/colaboradores/${proyecto._id}`,
        email,
        config
      );
      // console.log("data?=", data);
      setAlerta({ msg: data.msg, error: false });
      setColaborador({});
      setTimeout(() => {
        setAlerta({});
      }, 3000);
    } catch (error) {
      // console.log("error", error.response);
      setAlerta({ msg: error.response.data.msg, error: true });
    }
  };
  const handleModalEliminarColaborador = (colaborador) => {
    setModalEliminarColaborador(!modalEliminarColaborador);
    setColaborador(colaborador);
    // console.log("hay colaborador? ", colaborador);
  };

  const eliminarColaborador = async () => {
    // console.log("colaborador", colaborador);

    try {
      const token = localStorage.getItem("token");
      // console.log("token? :>> ", token);
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.post(
        `/proyectos/eliminar-colaborador/${proyecto._id}`,
        { id: colaborador._id },
        config
      );

      let proyectoActualizado = { ...proyecto };
      proyectoActualizado.colaboradores =
        proyectoActualizado.colaboradores.filter(
          (colaboradorState) => colaboradorState._id !== colaborador._id
        );
      // console.log("data", data);
      // console.log(" proyectoActualizado", proyectoActualizado);
      setProyecto(proyectoActualizado);
      setAlerta({ msg: data.msg, error: false });
      setColaborador({});
      setModalEliminarColaborador(false);
      setTimeout(() => {
        setAlerta({});
      }, 3000);
    } catch (error) {
      console.log("error", error.response);
    }
  };

  // const eliminarColaborador = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) return;

  //     const config = {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     };
  //     const { data } = await clienteAxios.post(
  //       `/proyectos/eliminar-colaborador/${proyecto._id}`,
  //       { id: colaborador._id },
  //       config
  //     );

  //     const proyectoActualizado = { ...proyecto };

  //     proyectoActualizado.colaboradores =
  //       proyectoActualizado.colaboradores.filter((colaboradorState) => {
  //         colaboradorState._id !== colaborador._id;
  //       });
  //     console.log("¿¿¿proyectoActualizado????", proyectoActualizado);
  //     console.log("¿¿¿data???", data);
  //     setProyecto(proyectoActualizado);
  //     setAlerta({
  //       msg: data.msg,
  //       error: false,
  //     });
  //     setColaborador({});
  //     setModalEliminarColaborador(false);

  //     setTimeout(() => {
  //       setAlerta({});
  //     }, 3000);
  //   } catch (error) {
  //     console.log(error.response);
  //   }
  // };

  const completarTarea = async (id) => {
    // console.log('completar tarea: ', id)
    try {
      const token = localStorage.getItem("token");
      // console.log("token? :>> ", token);
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.post(
        `/tareas/estado/${id}`,
        {},
        config
      );
      // console.log('data', data)
      setTarea({});
      setAlerta({});

      socket.emit("Cambiar Estado", data);
    } catch (error) {
      console.log("error.response?", error.response);
    }
  };

  const handleBuscador = () => {
    setBuscador(!buscador);
  };

  //SOCKET IO
  const submitTareasProyecto = (tarea) => {
    //AGREGA LA TAREA AL STATE
    let proyectoActualizado = { ...proyecto };
    proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea];
    setProyecto(proyectoActualizado);
  };

  const eliminarTareasProyecto = (tarea) => {
    const proyectoActualizado = { ...proyecto };
    proyectoActualizado.tareas = proyectoActualizado.tareas.filter(
      (tareaState) => tareaState._id !== tarea._id
    );
    setProyecto(proyectoActualizado);
  };

  const actualizarTareasProyecto = (tarea) => {
    const proyectoActualizado = { ...proyecto };
    proyectoActualizado.tareas = proyectoActualizado.tareas.map((tareaState) =>
      tareaState._id === tarea._id ? tarea : tareaState
    );
    setProyecto(proyectoActualizado);
  };

  const cambiarEstadoTarea = (tarea) => {
    const proyectoActualizado = { ...proyecto };
    proyectoActualizado.tareas = proyectoActualizado.tareas.map((tareaState) =>
      tareaState._id === tarea._id ? tarea : tareaState
    );
    setProyecto(proyectoActualizado);
  };

  const cerrarSesionProyectos = () => {
    setProyectos([]);
    setProyecto({});
    setAlerta({});
  };

  return (
    <ProyectosContext.Provider
      value={{
        proyectos,
        mostrarAlerta,
        alerta,
        submitProyecto,
        obtenerProyecto,
        proyecto,
        cargando,
        eliminarProyecto,
        modalFormularioTarea,
        handleModalTarea,
        submitTarea,
        handleModalEditarTarea,
        tarea,
        editarTarea,
        handleModalEliminarTarea,
        modalEliminarTarea,
        eliminarTarea,
        submitColaborador,
        colaborador,
        agregarColaborador,
        handleModalEliminarColaborador,
        modalEliminarColaborador,
        eliminarColaborador,
        completarTarea,
        buscador,
        handleBuscador,
        submitTareasProyecto,
        eliminarTareasProyecto,
        actualizarTareasProyecto,
        cambiarEstadoTarea,
        cerrarSesionProyectos,
      }}
    >
      {children}
    </ProyectosContext.Provider>
  );
};

export { ProyectosProvider };
export default ProyectosContext;
