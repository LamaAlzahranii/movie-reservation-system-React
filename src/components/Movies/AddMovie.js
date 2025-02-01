import {
  Box,
  Button,
  Checkbox,
  FormLabel,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { addMovie } from "../../api-helpers/api-helpers";

const labelProps = {
  mt: 1,
  mb: 1,
};

const AddMovie = () => {
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    posterUrl: "",
    releaseDate: "",
    featured: false,
    date: "",
  });

  const [actors, setActors] = useState([]);
  const [actor, setActor] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [timeSlot, setTimeSlot] = useState({ time: "", capacity: 0 });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTimeSlotChange = (e) => {
    setTimeSlot({
      ...timeSlot,
      [e.target.name]: e.target.value,
    });
  };

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, timeSlot]);
    setTimeSlot({ time: "", capacity: 0 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs, actors, timeSlots);
    addMovie({ ...inputs, actors, timeSlots })
      .then((res) => {
        console.log(res);
        setInputs({
          title: "",
          description: "",
          posterUrl: "",
          releaseDate: "",
          featured: false,
          date: "",
        });
        setActors([]);
        setTimeSlots([]);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box
          width={"50%"}
          padding={10}
          margin="auto"
          display={"flex"}
          flexDirection="column"
          boxShadow={"10px 10px 20px #ccc"}
        >
          <Typography textAlign={"center"} variant="h5" fontFamily={"verdana"}>
            Add New Movie
          </Typography>
          <FormLabel sx={labelProps}>Title</FormLabel>
          <TextField
            value={inputs.title}
            onChange={handleChange}
            name="title"
            variant="standard"
            margin="normal"
          />
          <FormLabel sx={labelProps}>Description</FormLabel>
          <TextField
            value={inputs.description}
            onChange={handleChange}
            name="description"
            variant="standard"
            margin="normal"
          />
          <FormLabel sx={labelProps}>Poster URL</FormLabel>
          <TextField
            value={inputs.posterUrl}
            onChange={handleChange}
            name="posterUrl"
            variant="standard"
            margin="normal"
          />
          <FormLabel sx={labelProps}>Release Date</FormLabel>
          <TextField
            type={"date"}
            value={inputs.releaseDate}
            onChange={handleChange}
            name="releaseDate"
            variant="standard"
            margin="normal"
          />
          <FormLabel sx={labelProps}>Event Date</FormLabel>
          <TextField
            type={"date"}
            value={inputs.date}
            onChange={handleChange}
            name="date"
            variant="standard"
            margin="normal"
          />
          <FormLabel sx={labelProps}>Actor</FormLabel>
          <Box display={"flex"}>
            <TextField
              value={actor}
              name="actor"
              onChange={(e) => setActor(e.target.value)}
              variant="standard"
              margin="normal"
            />
            <Button
              onClick={(e) => {
                e.preventDefault();
                setActors([...actors, actor]);
                setActor("");
              }}
            >
              Add Actor
            </Button>
          </Box>
          <FormLabel sx={labelProps}>Featured</FormLabel>
          <Checkbox
            name="featured"
            checked={inputs.featured}
            onClick={(e) =>
              setInputs((prevState) => ({
                ...prevState,
                featured: e.target.checked,
              }))
            }
            sx={{ mr: "auto" }}
          />
          <FormLabel sx={labelProps}>Time Slot</FormLabel>
          <Box display={"flex"}>
            <TextField
              type="datetime-local"
              value={timeSlot.time}
              onChange={handleTimeSlotChange}
              name="time"
              variant="standard"
              margin="normal"
            />
            <TextField
              type="number"
              value={timeSlot.capacity}
              onChange={handleTimeSlotChange}
              name="capacity"
              variant="standard"
              margin="normal"
            />
            <Button onClick={addTimeSlot}>Add Time Slot</Button>
          </Box>
          <Button
            type="submit"
            variant="contained"
            sx={{
              width: "30%",
              margin: "auto",
              bgcolor: "#821d21",
              ":hover": {
                bgcolor: "#121217",
              },
            }}
          >
            Add New Movie
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default AddMovie;
