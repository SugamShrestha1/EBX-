import { Routes, Route } from 'react-router-dom'
import Agents from '../pages/Agents/Agents'
import Skills from '../pages/Agents/Skill/Skills';
import AgentSkill from '../pages/Agents/Skill/AgentSkill';
function AgentRoute() {
    return (
        <Routes>
            <Route path='agents' element={<Agents />} />
            <Route path='agent-skills' element={<AgentSkill />} />
            <Route path='skillS' element={<Skills />} />
        </Routes>
    )
}
export default AgentRoute