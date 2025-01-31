import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { getAllMovies } from "../../helpers/api-helpers";
import CradLayout from "../HomePage/CradLayout";

const AllMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    getAllMovies()
      .then((data) => {
        setMovies(data);
        setLoading(false); 
      })
      .catch((err) => {
        console.log(err);
        setLoading(false); 
      });
  }, []);

  return (
    <Box margin="auto" marginTop={4}>
      <Typography variant="h4" padding={2} textAlign="center">
        All Movies
      </Typography>
      <Box
        margin="auto"
        width="100%"
        display={"flex"}
        justifyContent="center"
        flexWrap={"wrap"}
        gap={4}
      >
        {loading ? (
          <Typography variant="h6" textAlign="center" width="100%">
            Loading...
          </Typography>
        ) : (
          movies.length === 0 ? (
            <Typography variant="h6" textAlign="center" width="100%">
              No movies available.
            </Typography>
          ) : (
            movies.map((movie) => (
              <CradLayout
                id={movie._id}
                title={movie.title}
                releaseDate={movie.releaseDate}
                posterUrl={movie.posterUrl}
                description={movie.description}
                key={movie._id} 
              />
            ))
          )
        )}
      </Box>
    </Box>
  );
};

export default AllMovies;
