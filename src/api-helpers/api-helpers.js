import axios from "axios"
export const getAllMovies = async () => {
  const res = await axios.get("/movie").catch(err => console.log(err))

  if (res.status !== 200) {
    return console.log("No Data")
  }

  const data = await res.data
  return data
}

export const sendUserAuthRequest = async (data, signup) => {
  const res = await axios
    .post(`/user/${signup ? "signup" : "login"}`, {
      name: signup ? data.name : "",
      email: data.email,
      password: data.password,
    })
    .catch(err => console.log(err))

  if (res.status !== 200 && res.status !== 201) {
    console.log("Unexpected Error Occurred")
  }

  const resData = await res.data
  return resData
}

export const sendAdminAuthRequest = async data => {
  const res = await axios
    .post("/admin/login", {
      email: data.email,
      password: data.password,
    })
    .catch(err => console.log(err))

  if (res.status !== 200) {
    return console.log("Unexpectyed Error")
  }

  const resData = await res.data
  return resData
}

export const getMovieDetails = async id => {
  const res = await axios.get(`/movie/${id}`).catch(err => console.log(err))
  if (res.status !== 200) {
    return console.log("Unexpected Error")
  }
  const resData = await res.data
  return resData
}

export const newBooking = async data => {
  const { seatNumber, date, timeSlot, movieId } = data;

  try {
    const res = await axios.post("/booking", {
      seatNumber,
      date,
      timeSlot,
      movieId,
      userId: localStorage.getItem("userId"),
    });

    if (res.status === 201) {
      return { message: res.data.message, type: "success" };
    } else {
      return { message: "Unexpected Error", type: "error" };
    }
  } catch (err) {
    console.error("Error while booking:", err);
    console.error("Error Response Data:", err.response?.data);
    return { message: err.response?.data?.message || "Error while booking", type: "error" };
  }
};


export const getUserBooking = async () => {
  const id = localStorage.getItem("userId")
  const res = await axios.get(`/user/bookings/${id}`).catch(err => console.log(err))

  if (res.status !== 200) {
    return console.log("Unexpected Error")
  }
  const resData = await res.data
  return resData
}

export const deleteBooking = async id => {
  const res = await axios.delete(`/booking/${id}`).catch(err => console.log(err))

  if (res.status !== 200) {
    return console.log("Unepxected Error")
  }

  const resData = await res.data
  return resData
}

export const getUserDetails = async () => {
  const id = localStorage.getItem("userId")
  const res = await axios.get(`/user/${id}`).catch(err => console.log(err))
  if (res.status !== 200) {
    return console.log("Unexpected Error")
  }
  const resData = await res.data
  return resData
}

export const addMovie = async data => {
  const res = await axios
    .post(
      "/movie",
      {
        title: data.title,
        description: data.description,
        releaseDate: data.releaseDate,
        posterUrl: data.posterUrl,
        fetaured: data.fetaured,
        actors: data.actors,
        date: data.date,
        admin: localStorage.getItem("adminId"),
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    )
    .catch(err => console.log(err))

  if (res.status !== 201) {
    return console.log("Unexpected Error Occurred")
  }

  const resData = await res.data
  return resData
}

export const getAdminById = async () => {
  const adminId = localStorage.getItem("adminId")
  const res = await axios.get(`/admin/${adminId}`).catch(err => console.log(err))

  if (res.status !== 200) {
    return console.log("Unexpected Error Occurred")
  }

  const resData = await res.data
  return resData
}

export const checkAvailability = async (movieId, slotId) => {
  const response = await axios.get(`/movies/${movieId}/slots/${slotId}/availability`)
  if (!response.ok) throw new Error("فشل في التحقق من التوافر")
  return response.json()
}
