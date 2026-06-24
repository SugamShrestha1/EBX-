import { Route, Routes } from "react-router-dom";
import Roles from "../pages/AccessControl/Role";

const AccessControlRoute = () => {
    return (
        <Routes>
            <Route path="roles" element={<Roles />} />
        </Routes>
    );
}

export default AccessControlRoute;
