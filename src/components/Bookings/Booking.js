import { Button, FormLabel, TextField, Typography, Alert, Select, MenuItem, CircularProgress } from "@mui/material"
import { Box } from "@mui/system"
import React, { Fragment, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getMovieDetails, newBooking } from "../../api-helpers/api-helpers"

const Booking = () => {
  const [movie, setMovie] = useState(null)
  const [inputs, setInputs] = useState({ seatNumber: "", date: "", timeSlot: "" })
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
        setMessage({ type: "error", text: "فشل تحميل بيانات الفيلم" })
        setLoading(false)
      })
  }, [id])

  const handleChange = e => {
    setInputs(prevState => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    if (!inputs.seatNumber || !inputs.date || !inputs.timeSlot) {
      setMessage({ type: "error", text: "الرجاء ملء جميع الحقول" })
      return
    }
  
    try {
      const res = await newBooking({
        seatNumber: inputs.seatNumber,
        date: inputs.date,
        timeSlot: inputs.timeSlot,
        movieId: movie._id,
        userId: userId,
      })
  
      if (res && res.message === "تم الحجز بنجاح!") {
        setMessage({ type: "success", text: res.message })
        setInputs({ seatNumber: "", date: "", timeSlot: "" })
      } else {
        setMessage({ type: "error", text: "حدث خطأ أثناء الحجز، حاول مجددًا!" })
      }
    } catch (err) {
      console.log(err.response?.data || err.message)
      setMessage({ type: "error", text: "حدث خطأ أثناء الحجز، حاول مجددًا!" })
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
          <Typography padding={3} fontFamily="fantasy" variant="h4" textAlign="center">
            احجز تذاكر لفيلم: {movie.title}
          </Typography>
          {message && <Alert severity={message.type}>{message.text}</Alert>}
          <Box display="flex" justifyContent="center">
            <Box display="flex" flexDirection="column" paddingTop={3} width="50%" marginRight="auto">
              <img width="80%" height="300px" src={movie.posterUrl} alt={movie.title} />
              <Box width="80%" marginTop={3} padding={2}>
                <Typography paddingTop={2}>{movie.description}</Typography>
                <Typography fontWeight="bold" marginTop={1}>
                  الممثلون: {movie.actors?.join(", ") || "غير متوفر"}
                </Typography>
                <Typography fontWeight="bold" marginTop={1}>
                  تاريخ الإصدار: {new Date(movie.releaseDate).toDateString()}
                </Typography>
              </Box>
            </Box>
            <Box width="50%" paddingTop={3}>
              <form onSubmit={handleSubmit}>
                <Box padding={5} margin="auto" display="flex" flexDirection="column">
                  <FormLabel>رقم المقعد</FormLabel>
                  <TextField
                    name="seatNumber"
                    value={inputs.seatNumber}
                    onChange={handleChange}
                    type="number"
                    margin="normal"
                    variant="standard"
                  />
                  <FormLabel>تاريخ الحجز</FormLabel>
                  <TextField
                    name="date"
                    type="date"
                    margin="normal"
                    variant="standard"
                    value={inputs.date}
                    onChange={handleChange}
                  />
                  <FormLabel>اختر وقت العرض</FormLabel>
                  <Select
                    name="timeSlot"
                    value={inputs.timeSlot}
                    onChange={handleChange}
                    displayEmpty
                    margin="normal"
                    variant="standard"
                  >
                    <MenuItem value="" disabled>
                      اختر وقت العرض
                    </MenuItem>
                    {movie.timeSlots && movie.timeSlots.length > 0 ? (
                      movie.timeSlots.map(slot => (
                        <MenuItem key={slot._id} value={slot._id}>
                          {new Date(slot.time).toLocaleTimeString("ar-EG", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          (المتبقي: {slot.capacity - slot.booked})
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem disabled>لا توجد أوقات متاحة</MenuItem>
                    )}
                  </Select>
                  <Button type="submit" variant="contained" sx={{ mt: 3 }}>
                    احجز الآن
                  </Button>
                </Box>
              </form>
            </Box>
          </Box>
        </Fragment>
      ) : (
        <Typography textAlign="center" marginTop={5}>
          لا توجد بيانات لهذا الفيلم.
        </Typography>
      )}
    </div>
  )
}

export default Booking
