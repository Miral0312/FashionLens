import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  )
}

export default App

