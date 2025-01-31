import {
  Button,
  FormLabel,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material"
import { Box } from "@mui/system"
import React, { Fragment, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getMovieDetails, newBooking } from "../../api-helpers/api-helpers"

const Booking = () => {
  const [movie, setMovie] = useState(null)
  const [inputs, setInputs] = useState({ seatNumber: 0, timeSlot: "" })
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    setLoading(true)
    getMovieDetails(id)
      .then(res => {
        setMovie(res.movie)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setMessage({ type: "error", text: "Failed to load movie data" })
        setLoading(false)
      })
  }, [id])

  const handleChange = e => {
    setInputs(prevState => ({
      ...prevState,
      [e.target.name]: e.target.name === "seatNumber" ? parseInt(e.target.value) : e.target.value,
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!inputs.seatNumber || !inputs.timeSlot) {
      setMessage({ type: "error", text: "Please fill in all fields" })
      return
    }

    try {
      const res = await newBooking({
        seatNumber: inputs.seatNumber,
        timeSlot: inputs.timeSlot,
        movieId: movie._id,
        userId: userId,
      })

      if (res && res.message === "Booking successful") {
        setMessage({ type: "success", text: res.message })
        setInputs({ seatNumber: 0, timeSlot: "" })

        // تحديث تفاصيل الفيلم وتوقيتات العرض بعد الحجز
        const updatedMovie = await getMovieDetails(id)
        setMovie(updatedMovie.movie)
      } else {
        setMessage({ type: "error", text: res.message || "An error occurred during booking, please try again" })
      }
    } catch (err) {
      console.log("Error Response:", err.response)
      setMessage({
        type: "error",
        text: err.response?.data?.message || "An error occurred during booking, please try again",
      })
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" marginTop={5}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <div>
      {movie ? (
        <Fragment>
          <Typography padding={3} variant="h4" textAlign="center">
            Book Movie Now : {movie.title}
          </Typography>
          {/* Snackbar for messages */}
          <Snackbar
            open={message !== null}
            autoHideDuration={6000}
            onClose={() => setMessage(null)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }} // This positions the Snackbar at the top
          >
            <Alert severity={message?.type} onClose={() => setMessage(null)}>
              {message?.text}
            </Alert>
          </Snackbar>
          <Box display="flex" justifyContent="center">
            <Box display="flex" flexDirection="column" paddingTop={3} width="50%" marginRight="auto">
              <img width="80%" height="300px" src={movie.posterUrl} alt={movie.title} />
              <Box width="80%" marginTop={3} padding={2}>
                <Typography paddingTop={2}>{movie.description}</Typography>
                <Typography fontWeight="bold" marginTop={1}>
                  Cast: {movie.actors?.join(", ") || "Unavailable"}
                </Typography>
                <Typography fontWeight="bold" marginTop={1}>
                  Release Date: {new Date(movie.releaseDate).toDateString()}
                </Typography>
              </Box>
            </Box>
            <Box width="50%" paddingTop={3}>
              <Typography fontWeight="bold" marginTop={1}>
                Showtime: {new Date(movie.date).toDateString()}
              </Typography>
              <form onSubmit={handleSubmit}>
                <Box padding={5} margin="auto" display="flex" flexDirection="column">
                  <FormLabel>Seat Number</FormLabel>
                  <TextField
                    name="seatNumber"
                    value={inputs.seatNumber}
                    onChange={handleChange}
                    type="number"
                    margin="normal"
                    variant="standard"
                  />
                  <FormLabel>Select time</FormLabel>
                  <Select
                    name="timeSlot"
                    value={inputs.timeSlot}
                    onChange={handleChange}
                    displayEmpty
                    margin="normal"
                    variant="standard"
                  >
                    <MenuItem value="" disabled>
                      Select time
                    </MenuItem>
                    {movie.timeSlots && movie.timeSlots.length > 0 ? (
                      movie.timeSlots.map(slot => (
                        <MenuItem key={slot._id} value={slot._id}>
                          {new Date(slot.time).toLocaleTimeString("EG", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          (Remaining: {slot.capacity - slot.booked})
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>No available showtimes</MenuItem>
                    )}
                  </Select>
                  <Button type="submit" variant="contained" sx={{ mt: 3 }}>
                    Book Now{" "}
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>
        </Fragment>
      ) : (
        <Typography textAlign="center" marginTop={5}>
          No data available for this movie{" "}
        </Typography>
      )}
    </div>
  )
}

export default Booking
