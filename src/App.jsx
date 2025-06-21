import { useState } from 'react'
import Search from './components/search'


function App() {

  const[searchTerm,setSearchTerm] = useState('I am batman');

  return (
   <main>
        <div className="pattern"/>

        <div className="wrapper">
          <header>
          <img src="./hero.png" alt="hero banner" />
            <h1> Find <span className="text-gradient">movies</span> you will enjoy without a hassle</h1>
          </header>

          <Search searchTerm={searchTerm} setSearchTerm={searchTerm} />
          
        </div>
   </main>
  )
}

export default App
