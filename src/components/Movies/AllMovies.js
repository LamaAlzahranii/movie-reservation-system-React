import { Typography, Button } from "@mui/material"
import { Box } from "@mui/system"
import React, { useEffect, useState } from "react"
import { getAllMovies, bookTimeSlot, checkAvailability } from "../../helpers/api-helpers"
import CradLayout from "../HomePage/CradLayout"

const AllMovies = () => {
  const [movies, setMovies] = useState()
  const [availability, setAvailability] = useState({}) // تخزين عدد المقاعد المتاحة لكل slot

  useEffect(() => {
    getAllMovies()
      .then(data => setMovies(data))
      .catch(err => console.log(err))
  }, [])

  const handleCheckAvailability = async (movieId, slotId) => {
    try {
      const data = await checkAvailability(movieId, slotId)
      setAvailability(prev => ({
        ...prev,
        [slotId]: data.availableSeats, // تخزين عدد المقاعد المتاحة
      }))
    } catch (error) {
      console.log("Error checking availability:", error)
    }
  }

  // دالة لحجز التوقيت
  const handleBooking = async (movieId, slotId) => {
    try {
      await bookTimeSlot(movieId, slotId)
      const updatedMovies = await getAllMovies()
      setMovies(updatedMovies)
    } catch (error) {
      console.log("Error booking time slot:", error)
    }
  }

  return (
    <Box margin="auto" marginTop={4}>
      <Typography variant="h4" padding={2} textAlign="center">
        All Movies
      </Typography>
      <Box margin="auto" width="100%" display="flex" justifyContent="center" flexWrap="wrap" gap={4}>
        {movies.map((movie, index) => (
          <Box key={index} width="300px" padding={2} border="1px solid #ccc" borderRadius="8px">
            <Typography variant="h6">{movie.title}</Typography>
            <Typography variant="body2">Release Date: {new Date(movie.releaseDate).toDateString()}</Typography>

            {/* عرض الـ TimeSlots */}
            <Box marginTop={2}>
              <Typography variant="h6">Time Slots:</Typography>
              <Box marginTop={1}>
                {movie.timeSlots.length > 0 ? (
                  movie.timeSlots.map((slot, slotIndex) => (
                    <Box key={slotIndex} padding={1} border="1px solid #ddd" borderRadius="4px" marginBottom={1}>
                      <Typography>Time: {new Date(slot.time).toLocaleString()}</Typography>
                      <Typography>Capacity: {slot.capacity}</Typography>
                      <Typography>Booked: {slot.booked}</Typography>
                      <Typography>
                        Available: {availability[slot._id] !== undefined ? availability[slot._id] : "N/A"}
                      </Typography>

                      {/* زر التحقق من التوفر */}
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleCheckAvailability(movie._id, slot._id)}
                      >
                        تحقق من التوفر
                      </Button>

                      {/* زر الحجز */}
                      {slot.booked < slot.capacity ? (
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleBooking(movie._id, slot._id)}
                          sx={{ marginLeft: 1 }}
                        >
                          احجز الآن
                        </Button>
                      ) : (
                        <Typography color="error">ممتلئ</Typography>
                      )}
                    </Box>
                  ))
                ) : (
                  <Typography>No time slots available</Typography>
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
export default AllMovies
