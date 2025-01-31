import { Box, Button, Typography, CircularProgress } from "@mui/material"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getAllMovies } from "../api-helpers/api-helpers"
import MovieItem from "./Movies/MovieItem"

const HomePage = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllMovies()
      .then(data => {
        setMovies(data.movies)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [])

  return (
    <Box width={"100%"} height="100%" margin="auto" marginTop={2}>
      <Box margin={"auto"} width="80%" height={"50vh"} padding={2}>
        <img
          src="http://camposolonline.com/wp-content/uploads/2018/01/cinema-header.jpg"
          alt="Brahmastra"
          width={"100%"}
          height={"100%"}
          style={{ objectFit: "cover" }}
        />
      </Box>
      <Box padding={5} margin="auto">
        <Typography variant="h4" textAlign={"center"}>
          Latest Releases
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : (
        <Box margin={"auto"} display="flex" width="80%" justifyContent={"center"} alignItems="center" flexWrap="wrap">
          {movies.slice(0, 4).map(movie => (
            <MovieItem
              id={movie.id}
              title={movie.title}
              posterUrl={movie.posterUrl}
              releaseDate={movie.releaseDate}
              key={movie.id}
            />
          ))}
        </Box>
      )}

      <Box display="flex" padding={5} margin="auto">
        <Button
          LinkComponent={Link}
          to="/movies"
          sx={{
            margin: "auto",
            color: "white",
            backgroundColor: "#821d21",
            "&:hover": {
              backgroundColor: "black",
              color: "white",
            },
          }}
        >
          See All Movies to reservation
        </Button>
      </Box>
    </Box>
  )
}

export default HomePage
