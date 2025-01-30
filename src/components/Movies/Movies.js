import React, { useState, useEffect } from "react"
import { Box, Typography, Button, CircularProgress, Alert } from "@mui/material"
import { getAllMovies, checkAvailability } from "../../api-helpers/api-helpers"
import MovieItem from "./MovieItem"

const Movies = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [availability, setAvailability] = useState(null)

  useEffect(() => {
    getAllMovies()
      .then(data => {
        setMovies(data.movies)
        setLoading(false)
      })
      .catch(err => {
        setError("فشل في تحميل الأفلام.")
        setLoading(false)
      })
  }, [])

  const handleCheckAvailability = async (movieId, timeSlotId) => {
    try {
      const data = await checkAvailability(movieId, timeSlotId)
      setAvailability(data.availableSeats)
      setSelectedMovie(movieId)
      setSelectedSlot(timeSlotId)
    } catch (err) {
      setError("فشل في التحقق من التوافر.")
    }
  }

  return (
    <Box margin="auto" marginTop={4}>
      <Typography variant="h4" padding={2} width="40%" bgcolor="#900C3F" color="white" textAlign="center">
        جميع الأفلام
      </Typography>

      <Box width="100%" margin="auto" marginTop={5} display="flex" justifyContent="flex-start" flexWrap="wrap">
        {loading && <CircularProgress sx={{ margin: "auto" }} />}
        {error && <Alert severity="error">{error}</Alert>}

        {movies.map((movie, index) => (
          <MovieItem
            key={index}
            id={movie._id}
            posterUrl={movie.posterUrl}
            releaseDate={movie.releaseDate}
            title={movie.title}
            onCheckAvailability={handleCheckAvailability}
          />
        ))}
      </Box>

      {selectedMovie && selectedSlot && availability !== null && (
        <Box marginTop={4}>
          <Typography variant="h5">المقاعد المتاحة: {availability}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => alert("الانتقال إلى صفحة الحجز")}
            disabled={availability === 0}
          >
            متابعة الحجز
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default Movies
