import { Button, FormLabel, TextField, Typography, Alert } from "@mui/material";
import { Box } from "@mui/system";
import React, { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails, newBooking } from "../../api-helpers/api-helpers";

const Booking = () => {
  const [movie, setMovie] = useState(null);
  const [inputs, setInputs] = useState({ seatNumber: "", date: "" });
  const [message, setMessage] = useState(null);
  const { id } = useParams();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    getMovieDetails(id)
      .then((res) => setMovie(res.movie))
      .catch((err) => console.log(err));
  }, [id]);

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!inputs.seatNumber || !inputs.date) {
      setMessage({ type: "error", text: "الرجاء ملء جميع الحقول" });
      return;
    }

    newBooking({ ...inputs, movie: movie._id, user: userId })
      .then((res) => {
        setMessage({ type: "success", text: "تم الحجز بنجاح!" });
        setInputs({ seatNumber: "", date: "" });
      })
      .catch((err) => {
        setMessage({ type: "error", text: "حدث خطأ أثناء الحجز، حاول مجددًا!" });
      });
  };

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
                  الممثلون: {movie.actors.join(", ")}
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
          جارٍ تحميل بيانات الفيلم...
        </Typography>
      )}
    </div>
  );
};

export default Booking;
