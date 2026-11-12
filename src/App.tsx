import { BrowserRouter, Route, Routes } from 'react-router'
import Landing from './pages/Landing'
import PatternInstructions from './pages/PatternInstructions'
import Patterns from './pages/Patterns'
import SignIn from './pages/SignIn'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/projects" element={<Patterns />} />
        <Route
          path="/projects/:id/instructions"
          element={<PatternInstructions />}
        />
        <Route path="/sign-in" element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
