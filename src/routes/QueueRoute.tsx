import { Routes, Route } from 'react-router-dom'
import Queues from '../pages/Queues/Queues'
import QueueMember from '../pages/Queues/QueueMember'

function QueueRoute() {
    return (
        <Routes>
            <Route path='queues' element={<Queues />} />
            <Route path='queue-members' element={<QueueMember />} />
        </Routes>
    )
}
export default QueueRoute