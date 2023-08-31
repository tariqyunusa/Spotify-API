import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import logo from "../src/assets/Spotify_Logo_RGB_Green.png";
function App() {
  const CLIENT_ID = "b406d0b20a0d44ae9f9a05b5882009b6";
  const REDIRECT_URI = "https://most-played-ruddy.vercel.app";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");
    if (!token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
      setToken(token);
    }
  }, []);

  const logout = () => {
    setToken("");
    window.localStorage.removeItem("token");
  };

  const getTopArtist = async () => {
    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/me/top/artists`,
        {
          params: {
            time_range: "long_term", // Use the desired time range
            limit: 10, // Limit the result to 1 artist
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const artists = response.data.items;
      setTopArtists(artists);
      console.log("artists:", artists);
    } catch (error) {
      console.error("Error fetching top artist:", error);
    }
  };

  return (
    <div className="container">
      {!token ? (
        <a
          href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=user-top-read`}
        >
          login to Spotify
        </a>
      ) : (
        <div className="everything">
          <div className="buttons">
            <div className="logo">
              <img src={logo} alt="" />
            </div>
            <div className="btnss">
              <button className="btn" onClick={logout}>
                logout
              </button>
              <button className="btn" onClick={getTopArtist}>
                Get Top Artist
              </button>
            </div>
          </div>

          {topArtists.length > 0 && (
            <div className="data">
              <h2 className="header">Your Top 10 Artists of the Year</h2>
              {topArtists.map((artist, index) => (
                <div className="artist" key={index}>
                  <div className="img-container">
                    <img src={artist.images[0]?.url} alt={artist.name} />
                  </div>
                  <div className="details">
                    <h3>{artist.name}</h3>
                    <h4>Spotify Popularity: {artist.popularity}</h4>
                    <p>
                      LIsten to <a href={artist.external_urls}>{artist.name}</a>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
