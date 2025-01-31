import React from "react"
import { Card, CardContent, CardActions, Button, Typography } from "@mui/material"
import { Link } from "react-router-dom"

const MovieItem = ({ title, releaseDate, posterUrl, id }) => {
  return (
    <Card sx={{ margin: 2, width: 250, height: 320, borderRadius: 5, ":hover": { boxShadow: "10px 10px 20px #ccc" } }}>
      <img height="50%" width="100%" src={posterUrl} alt={title} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          variant="contained"
          fullWidth
          LinkComponent={Link}
          to={`/booking/${id}`}
          sx={{
            margin: "auto",
            bgcolor: "#821d21",
            ":hover": { bgcolor: "#121217" },
          }}
          size="small"
        >
        Book Now
        </Button>
      </CardActions>
    </Card>
  )
}

export default MovieItem
