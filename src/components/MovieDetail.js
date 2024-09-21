import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const MovieDetail = () => {
  const { id } = useParams(); 
  const [movie, setMovie] = useState({});
  const [cast, setCast] = useState([]); 
  const [error, setError] = useState(null); 
  let API_key = "a67a1d57834da733403b86a0feb8351d";
  let base_url = "https://api.themoviedb.org/3/movie";
  let img_path = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    // Fetch movie details
    fetch(`${base_url}/${id}?api_key=${API_key}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        setMovie(data);
      })
      .catch(error => {
        setError(error.message); // Handle fetch errors
      });

    // Fetch movie cast
    fetch(`${base_url}/${id}/credits?api_key=${API_key}`)
      .then(res => res.json())
      .then(data => {
        setCast(data.cast); // Store cast in state
      })
      .catch(error => {
        setError(error.message); // Handle fetch errors
      });
  }, [API_key, base_url, id]);

  if (error) {
    return <div>Error fetching movie details: {error}</div>; // Display error message
  }

  return (
    <div className="min-h-screen bg-[#282c34] text-white flex justify-center items-center">
      <div className="max-w-4xl p-4 relative bg-[#33393f] rounded-lg shadow-lg flex flex-col items-center">
        <div className="relative w-full">
          {/* Movie Poster */}
          {movie.poster_path ? (
            <img
              src={img_path + movie.poster_path}
              alt={movie.title + " Poster"}
              className="w-full h-auto rounded-lg object-cover"
            />
          ) : (
            <div className="w-full h-120 bg-gray-600 rounded-lg flex items-center justify-center">
              <span>No Image Available</span>
            </div>
          )}

          {/* Overlay Movie Details */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-transparent to-transparent p-8 rounded-lg flex flex-col justify-end">
            <h2 className="text-4xl font-bold mb-2 text-white">{movie.title}</h2>
            <p className="text-xl mb-4 text-white">
              <span className="font-bold">Rating:</span> {movie.vote_average}
            </p>
            <p className="text-lg mb-4 text-white">
              <span className="font-bold">Runtime:</span> {movie.runtime} min
            </p>
            <p className="text-lg mb-4 text-white">
              <span className="font-bold">Genres:</span>{" "}
              {movie.genres ? movie.genres.map((genre) => genre.name).join(", ") : ""}
            </p>
            <p className="text-lg mb-4 text-white">
              <span className="font-bold">Release Date:</span> {movie.release_date}
            </p>
            <div className="mt-4 text-white">
              <h3 className="text-2xl font-bold mb-2">Overview</h3>
              <p className="text-lg">{movie.overview}</p>
            </div>
          </div>
        </div>

        {/* Movie Cast */}
        <div className="mt-6 w-full">
          <h3 className="text-2xl font-bold mb-2">Cast</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {cast.slice(0, 10).map((actor) => (
              <div key={actor.cast_id} className="text-center">
                {actor.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                    alt={actor.name}
                    className="w-24 h-36 rounded-lg object-cover mb-2"
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
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
