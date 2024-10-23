import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState({});
  const [cast, setCast] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page for cast pagination

  const castPerPageMobile = 3;
  const castPerPageTablet = 5;
  const castPerPageDesktop = 6;

  let API_key = "a67a1d57834da733403b86a0feb8351d";
  let base_url = "https://api.themoviedb.org/3/movie";
  let img_path = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    // Fetch movie details
    fetch(`${base_url}/${id}?api_key=${API_key}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setMovie(data);
      })
      .catch((error) => {
        setError(error.message);
      });

    // Fetch movie cast
    fetch(`${base_url}/${id}/credits?api_key=${API_key}`)
      .then((res) => res.json())
      .then((data) => {
        setCast(data.cast);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [API_key, base_url, id]);

  // Determine the number of cast members per page based on the screen size
  const getCastPerPage = () => {
    if (window.innerWidth >= 1024) return castPerPageDesktop; // Desktop
    if (window.innerWidth >= 768) return castPerPageTablet; // Tablet
    return castPerPageMobile; // Mobile
  };

  useEffect(() => {
    const handleResize = () => setCurrentPage(1); // Reset page when resizing
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const castPerPage = getCastPerPage();
  const indexOfLastCast = currentPage * castPerPage;
  const indexOfFirstCast = indexOfLastCast - castPerPage;
  const currentCast = cast.slice(indexOfFirstCast, indexOfLastCast);

  const totalPages = Math.ceil(cast.length / castPerPage);

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

  if (error) {
    return <div>Error fetching movie details: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#282c34] text-white flex">
      <div className="w-screen p-4 relative bg-[#33393f] rounded-lg shadow-lg flex flex-col justify-end">
        {/* Poster Background */}
        <div
          className="relative w-full h-[550px] bg-cover bg-center rounded-lg"
          style={{
            backgroundImage: `url(${img_path + movie.poster_path})`,
            backgroundPosition: "right",
            backgroundSize: "cover",
          }}
        >
          {/* Overlay Movie Details */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-transparent to-transparent p-8 rounded-lg flex flex-col justify-end">
            <h2 className="text-4xl font-bold mb-2 text-white">
              {movie.title}
            </h2>
            <p className="text-xl mb-4 text-white">
              <span className="font-bold">Rating:</span> {movie.vote_average}
            </p>
            <p className="text-lg mb-4 text-white">
              <span className="font-bold">Runtime:</span> {movie.runtime} min
            </p>
            <p className="text-lg mb-4 text-white">
              <span className="font-bold">Genres:</span>{" "}
              {movie.genres
                ? movie.genres.map((genre) => genre.name).join(", ")
                : ""}
            </p>
            <p className="text-lg mb-4 text-white">
              <span className="font-bold">Release Date:</span>{" "}
              {movie.release_date}
            </p>
            <div className="mt-4 text-white">
              <h3 className="text-2xl font-bold mb-2">Overview</h3>
              <p className="text-lg">{movie.overview}</p>
            </div>
          </div>
        </div>

        {/* Movie Cast */}
        <div className="mt-6 w-full justify-between items-center">
          <h3 className="text-2xl font-bold mb-2">Cast</h3>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {currentCast.map((actor) => (
              <div key={actor.cast_id} className="text-center">
                {actor.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                    alt={actor.name}
                    className="w-35 h-auto object-cover mb-2"
                  />
                ) : (
                  <div className="w-24 h-36 bg-gray-600 rounded-lg mb-2 flex items-center justify-center">
                    <span>No Image</span>
                  </div>
                )}
                <p className="text-white">{actor.name}</p>
                <p className="text-gray-400 text-sm">as {actor.character}</p>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {cast.length > castPerPage && (
            <div className="pagination flex justify-end items-center space-x-4 mt-6">
              <button onClick={handlePrevPage}>{"<<"}</button>
              <span className="text-white">Page {currentPage}</span>
              <button onClick={handleNextPage}>{">>"}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
