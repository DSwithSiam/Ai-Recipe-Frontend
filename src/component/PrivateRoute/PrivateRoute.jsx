// components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
    
  const role = localStorage.getItem('role');
 



  
  // jodi role na thake
 
  if (!role) {
    return <Navigate to="/signin" replace />;
  }
 



  // jodi role match kore
  if (allowedRoles.includes(role)) {
    return children;
  }

  // jodi onno role hoy
  return <Navigate to="/unauthorized" replace />;
  
};

export default PrivateRoute;


