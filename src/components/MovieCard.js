import React from "react";
import { NavLink } from "react-router-dom";

const MovieCard = ({ info, onMovieSelect }) => {
  let img_path = "https://image.tmdb.org/t/p/w500";

  const handleClick = () => {
    if (onMovieSelect) {
      onMovieSelect(info.id);
    }
  };

  return (
    <div
      className="max-w-48 bg-[#282c34] rounded-lg shadow-md p-2"
      onClick={handleClick}
    >
      <NavLink to={`/${info.id}`}>
        <img
          src={img_path + info.poster_path}
          alt={info.title + " Poster"}
          className="rounded-lg mb-4 w-44 h-auto object-cover"
        />
        <h2 className="text-[#e6e8e8] text-xl text-center">{info.title}</h2>
        <p className="text-gray-400 text-center mt-2">{info.vote_average}</p>
      </NavLink>
    </div>
  );
};

export default MovieCard;
