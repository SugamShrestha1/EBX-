import Campagin from "../pages/Campaign/Campaign";
import { Route, Routes } from "react-router-dom";

const CampaignRoute = () => {
    return (
        <div>
            <Routes>
                <Route path="/outbound-campaigns" element={<Campagin />} />
            </Routes>
        </div>
    );
};

export default CampaignRoute;   