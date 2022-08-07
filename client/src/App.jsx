import { Navbar, Home } from "./components"

const App = () => {  
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-home">
        <Navbar />
        <Home />
      </div>
    </div>
  )
}

export default App
