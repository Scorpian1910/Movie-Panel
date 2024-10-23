import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import MovieDetail from '../components/MovieDetail';

let API_key = "&api_key=a67a1d57834da733403b86a0feb8351d";
let base_url = "https://api.themoviedb.org/3";
let url = base_url + "/movie/popular?" + API_key;
let arry = ["Popular", "Top Rated", "Upcoming"];

const HomePage = () => {
  const [movieData, setData] = useState([]);
  const [url_set, setUrl] = useState(url);
  const [search, setSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8); // Default for desktop
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Track mobile menu state

  // Toggle mobile menu open/close
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    fetch(url_set)
      .then(res => res.json())
      .then(data => {
        setData(data.results);
        setCurrentPage(1); // Reset to the first page when movie data changes
      });
  }, [url_set]);

  useEffect(() => {
    // Handle dynamic screen size for pagination
    const updateItemsPerPage = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) {
        setItemsPerPage(3); // 3 items per page on mobile
      } else {
        setItemsPerPage(8); // 6 items per page on larger screens
      }
    };

    updateItemsPerPage(); // Initial check
    window.addEventListener('resize', updateItemsPerPage); // Listen for screen resizing

    return () => {
      window.removeEventListener('resize', updateItemsPerPage); // Cleanup event listener
    };
  }, []);

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
    setSearch("");
  };

  // Pagination calculations
  const totalPages = Math.ceil(movieData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMovies = movieData.slice(indexOfFirstItem, indexOfLastItem);

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
      <div className="header bg-[#282c34] min-h-screen w-screen">
        <nav className="bg-[#33393f] text-white flex flex-col sm:flex-row sm:justify-between">
          <div className="flex justify-between max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
            <div className="flex items-center">
              <a href="/" className="text-lg font-bold">MovieDb</a>
            </div>

            <div className="sm:hidden flex items-center">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
              </button>
            </div>

            <div className="hidden sm:flex items-center space-x-4">
              {arry.map((value, index) => (
                <button
                  key={index}
                  name={value}
                  onClick={(e) => getData(e.target.name)}
                  className="hover:bg-red-700 text-[#898d8f] px-4 py-2 rounded-md"
                >
                  {value}
                </button>
              ))}

              <form onSubmit={searchMovie} className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Movie Name"
                  className="input text-black font-bold py-2 px-4 rounded"
                  onChange={(e) => setSearch(e.target.value)}
                  value={search}
                />
                <button
                  type="submit"
                  className="bg-[#6c757d] hover:bg-red-700 font-bold py-2 px-4 rounded"
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="sm:hidden">
              <div className="flex flex-col items-center space-y-2">
                {arry.map((value, index) => (
                  <button
                    key={index}
                    name={value}
                    onClick={(e) => getData(e.target.name)}
                    className="hover:bg-red-700 text-[#898d8f] px-4 py-2 rounded-md"
                  >
                    {value}
                  </button>
                ))}

                <form onSubmit={searchMovie} className="flex flex-col items-center space-y-2">
                  <input
                    type="text"
                    placeholder="Movie Name"
                    className="input text-black font-bold py-2 px-4 rounded"
                    onChange={(e) => setSearch(e.target.value)}
                    value={search}
                  />
                  <button
                    type="submit"
                    className="bg-[#6c757d] hover:bg-red-700 font-bold py-2 px-4 rounded"
                  >
                    Search
                  </button>
                </form>
              </div>
            </div>
          )}
        </nav>

        {selectedMovie && <MovieDetail selectedMovie={selectedMovie} />}

        {/* MovieCard Grid with responsive layout */}
        <div className="container mx-auto py-8 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {currentMovies.length === 0 ? (
              <p className="text-white text-center">Not Found</p>
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
                className={`px-4 py-2 ${currentPage === 1 ? "bg-gray-400" : "bg-[#6c757d] hover:bg-red-700"} text-white rounded`}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                className={`px-4 py-2 ${currentPage === totalPages ? "bg-gray-400" : "bg-[#6c757d] hover:bg-red-700"} text-white rounded`}
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
