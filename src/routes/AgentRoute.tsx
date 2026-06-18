import { Routes, Route } from 'react-router-dom'
import Agents from '../pages/Agents/Agents'
function AgentRoute() {
    return (
        <Routes>
            <Route path='agents' element={<Agents />} />
        </Routes>
    )
}
export default AgentRoute