// import { Children, createContext, useContext, useState } from "react";

// export const AuthContext = createContext();

// export const useAuthContext = () => {
//   return useContext(AuthContext);
// };
// const token = localStorage.getItem("token");

// export const AuthContextProvider = ({ children }) => {
//   const [authUser, setAuthUser] = useState(
//     localStorage.getItem("token") || null
//   ? JSON.parse(localStorage.getItem("authUser"))
//   : null
//   );

//   return (
//     <AuthContext.Provider value={{ authUser, setAuthUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  let userFromToken = null;

  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userFromToken = {
        _id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name, // only if you included it in JWT
      };
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  const [authUser, setAuthUser] = useState(userFromToken);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
