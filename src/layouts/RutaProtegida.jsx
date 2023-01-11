import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import useAuth from "../hooks/useAuth";

const RutaProtegida = () => {
  const { auth, cargando } = useAuth();
  // console.log("auth", auth);

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
  return (
    <div>
      <>
        {auth._id ? (
          <div className="bg-gray-100">
            <Header />
            <div className="md:flex md:min-h-screen">
              <Sidebar />
              <main className="p-10 flex-1 bg-teal-600">
                <Outlet />
              </main>
            </div>
          </div>
        ) : (
          <Navigate to="/" />
        )}
      </>
    </div>
  );
};

export default RutaProtegida;
