import { Outlet } from "react-router-dom";
import Navbar from "../component/Navbar/Navbar";


const Roots = () => {
    return (
        <div>
            <Navbar/>
            <Outlet/>
           
        </div>
    );
}

export default Roots;
