import { useEffect, useState } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use'
import { getTrendingMovies, updateSearchCount } from './appwrite';

const   API_BASE_URL='https://api.themoviedb.org/3';
const   API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS ={
method:'GET',
headers:{
  accept:'application/json',
  Authorization: `Bearer ${API_KEY}`
}
}


function App() {

  const[searchTerm,setSearchTerm] = useState('');
  const [errorMessage,setErrorMessage] = useState('');
  const [movieList,setMovieList] = useState([]);
  const [ trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debounceSearchTerm,setDebounceSeacrhTerm] = useState('');
  
  
// debounce the search item to not make to many api request  
useDebounce(() => setDebounceSeacrhTerm(searchTerm),600,[searchTerm])

  const fetchMovies = async(query='')=>{

    setIsLoading(false);
    setErrorMessage('');

    try {

      const endpoint = query
      ?`${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
      :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      
      if(!response.ok){
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      
      if(data.response === false){
        setErrorMessage(data.Error || 'failed to fecht movies');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

     if(query && data.results.length > 0){

      await updateSearchCount(query,data.results[0]);
     }



    } catch (error) {
      console.error(`error fetching movies: ${error}`);
      setErrorMessage('ERROR feching movie : please try again later');
    } finally{
      setIsLoading(false);
    }
  }

  const loadTrendingMovies = async () =>{
    try {
      
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);


    } catch (error) {
      console.log(`Error fecthing movies: ${error}`);
      
    }
  }

  // we will only fectch movies after debounce of search term.
  // movies display automaticaly when the page load
  useEffect(()=>{
    fetchMovies(debounceSearchTerm);

}, [debounceSearchTerm]);

useEffect(() =>{
loadTrendingMovies();
},[]);


  return (
   <main>
        <div className="pattern"/>

        <div className="wrapper">
          <header>
          <img src="./hero.png" alt="hero banner" />
            <h1> Find <span className="text-gradient">movies</span> you will enjoy without a hassle</h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

            //&& means then. statement below is an if-then render . is does not need ? for if
          {trendingMovies.length> 0 && (
            <section className="trending">
              <h2>Trending movies</h2>
              <ul>
                {trendingMovies.map((movie,index) =>(
                  <li key={movie.$id}>
                    <p>{index+1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>

            </section>
          )}

          <section className="all-movies">
            <h2>All movies </h2>
          {isLoading?(
            <Spinner/> 
          ) : errorMessage ?(
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) =>(
                  <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}

          </section>

        
        
          
        </div>
   </main>
  )
}

export default App
