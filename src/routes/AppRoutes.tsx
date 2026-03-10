import { Routes, Route } from "react-router-dom"

// import Login from "../pages/Login/Login"
// import Signup from "../pages/Signup/Signup"
// import ChatRooms from "../pages/ChatRooms/ChatRooms"
// import Chat from "../pages/Chat/Chat"

import PublicLayout from "../layouts/PublicLayout.tsx"
import PrivateLayout from "../layouts/PrivateLayout.tsx"

const AppRoutes = () => {

  return (

    <Routes>

      {/* Public Routes */}
      <Route element={<PublicLayout />}>

        {/* <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> */}

      </Route>


      {/* Private Routes */}
      <Route element={<PrivateLayout />}>

        {/* <Route path="/rooms" element={<ChatRooms />} />
        <Route path="/chat/:roomId" element={<Chat />} /> */}

      </Route>

    </Routes>
  )
}

export default AppRoutes