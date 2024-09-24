import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import MovieDetail from '../components/MovieDetail';

let API_key = "&api_key=a67a1d57834da733403b86a0feb8351d";
let base_url = "https://api.themoviedb.org/3";
let url = base_url + "/movie/popular?" + API_key;
let arry = ["Popular", "Top Rated", "Upcoming"];
const itemsPerPage = 8; // Number of cards per page

const HomePage = () => {
  const [movieData, setData] = useState([]);
  const [url_set, setUrl] = useState(url);
  const [search, setSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page

  useEffect(() => {
    fetch(url_set)
      .then(res => res.json())
      .then(data => {
        setData(data.results);
        setCurrentPage(1); // Reset to the first page when movie data changes
      });
  }, [url_set]);

  const getData = (movieType) => {
    if (movieType === "Popular") {
      url = base_url + "/movie/popular?" + API_key;
    }
    if (movieType === "Top Rated") {
      url = base_url + "/movie/top_rated?" + API_key;
    }
    if (movieType === "Upcoming") {
      url = base_url + "/movie/upcoming?" + API_key;
    }
    setUrl(url);
  };

  const searchMovie = (evt) => {
    evt.preventDefault(); 
    if (search.trim()) { 
      let searchUrl = base_url + "/search/movie?" + API_key + "&query=" + search;
      setUrl(searchUrl); 
    }
  };

  // Pagination logic
  const indexOfLastMovie = currentPage * itemsPerPage;
  const indexOfFirstMovie = indexOfLastMovie - itemsPerPage;
  const currentMovies = movieData.slice(indexOfFirstMovie, indexOfLastMovie);

  const totalPages = Math.ceil(movieData.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className="header bg-[#282c34] min-h-screen">
        <nav className="bg-[#33393f] text-white">
          <div className="flex justify-between max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Left side of the navigation bar */}
            <div className="flex items-center">
              <a href="/" className="text-lg font-bold">
                MovieDb
              </a>
            </div>

            {/* Right side of the navigation bar */}
            <div className="flex items-center p-3 space-x-4">
              {arry.map((value, index) => (
                <button
                  key={index}
                  name={value}
                  onClick={(e) => getData(e.target.name)}
                  className=" hover:bg-red-700 text-[#898d8f]"
                >
                  {value}
                </button>
              ))}

              <form onSubmit={searchMovie}>
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Movie Name"
                    className="input text-black font-bold py-2 px-4 rounded ml-2"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                  />
                  <button
                    type="submit"
                    className="bg-[#6c757d] hover:bg-red-700 font-bold py-2 px-4 rounded ml-2"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </nav>

        {/* MovieDetail component */}
        {selectedMovie && <MovieDetail selectedMovie={selectedMovie} />}

        {/* MovieCard Grid */}
        <div className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {currentMovies.length === 0 ? (
              <p className="notfound">Not Found</p>
            ) : (
              currentMovies.map((res, pos) => (
                <MovieCard
                  info={res}
                  key={pos}
                  onMovieSelect={setSelectedMovie}
                />
              ))
            )}
          </div>
          
          {/* Pagination Controls */}
          {movieData.length > itemsPerPage && (
            <div className="pagination flex justify-center items-center space-x-4 mt-6">
              <button
                onClick={handlePrevPage}
                className={`px-4 py-2 ${currentPage === 1 ? 'bg-gray-400' : 'bg-[#6c757d] hover:bg-red-700'} text-white rounded`}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-white">Page {currentPage} of {totalPages}</span>
              <button
                onClick={handleNextPage}
                className={`px-4 py-2 ${currentPage === totalPages ? 'bg-gray-400' : 'g-[#6c757d] hover:bg-red-700'} text-white rounded`}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomePage;
