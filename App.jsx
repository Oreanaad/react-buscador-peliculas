

import { useCallback, useEffect, useRef, useState} from 'react'
import './App.css'
import {Movies} from './components/Movies'
import { useMovies } from './hooks/useMovies'
import debounce from 'just-debounce-it'


  function useSearch()
{   const [error, setError] = useState(null)
  const [search, UpdateSearch]= useState('')
  const isFirstInput = useRef(true)
 

  //useRef es un hook que nos permite crear una referencia mutable que persiste durante el ciclo de vida del componente
  //es decir, no se vuelve a crear cada vez que se renderiza el componente
  //en este caso, lo usamos para saber si es el primer input o no
  //si es el primer input, no se hace nada
   useEffect(() => {
    if(isFirstInput.current){
      isFirstInput.current=  search === ' '
return
    } 


    if(search === '') {
     setError('No se puede buscar una pelicula vacia')
     return
    }
    if(search.match(/^\d+$/)) {
      setError('No se puede buscar una pelicula con solo numeros')
      return
    }
    if(search.length < 3) {
      setError('La busqueda debe tener al menos 3 caracteres')
      return
    }
    setError(null)
    
  },[search])

  return{search,UpdateSearch, error}
}


function App() {
  const [sort, setSort] = useState(false)
  const {search, UpdateSearch, error} = useSearch()
  const {movies, loading, getMovies} = useMovies({search, sort})

const debounceGetMovies = useCallback(
  debounce(search => {
    getMovies({ search })
  }, 300)
  ,[getMovies]
)
//el debounce es una funcion que nos permite limitar la cantidad de veces que se ejecuta una funcion en un periodo de tiempo


  const handleSubmit = (event) => {
   event.preventDefault()
   getMovies({search})

  }

  const handleSort = ()=>{
    setSort(!sort)
  }


   const handleChange = (event) => {
    //Nos ayuda a autocompletar la busqueda 
    const newSearch = event.target.value
  UpdateSearch(newSearch)
  debounceGetMovies(newSearch)

   }

  return (
    <div className='page'>
      <header>
        <h1>Buscador de peliculas</h1>
        <form className='form' onSubmit={handleSubmit}>
     <input onChange={handleChange} value={search} name='query' className="form" placeholder='Los vengadores, start wars...'></input>
     <input type='checkbox' onChange={handleSort} checked={sort}></input>
     <button>Buscar</button>
     </form>
     {error && <p className='error'>{error}</p>}
     </header>

     <main>
     {
      loading? <p>Cargando...</p> : <Movies movies={movies} />
     }
  
     </main>
    </div>
  )
}

export default App
