import React, { useState, useEffect } from "react";
import "./Search.css";
import SearchIcon from "@material-ui/icons/Search";
import MicIcon from "@material-ui/icons/Mic";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";

import MicOffIcon from "@material-ui/icons/MicOff";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continous = true;
mic.interimResults = true;
mic.lang = "en-US";

function Search({ hideButtons = false }) {
  const [{}, dispatch] = useStateValue();

  const [input, setInput] = useState("");
  const history = useHistory();

  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    handleListen();
  }, [isListening]);

  // useEffect(() => {
  //   search();
  // }, [isListening]);

  const listening = () => setIsListening((prevState) => !prevState);

  const search = (e) => {
    e.preventDefault();

    console.log("You hit search button", input);

    dispatch({
      type: actionTypes.SET_SEARCH_TERM,
      term: input,
    });
    // something with the input
    history.push("/search");
  };

  const handleListen = () => {
    if (isListening) {
      mic.start();
      // mic.onend = () => {
      //   console.log("continue..");
      //   mic.start();
    }
    // } else {
    //   mic.stop();
    //   mic.onend = () => {
    //     console.log("Stop mic on click");
    //   };

    // mic.onstart = () => {
    //   console.log("Mics on");
    // };

    // mic.onresult = (event) => {
    //   const transcript = Array.from(event.results)
    //     .map((result) => result[0])
    //     .map((result) => result.transcript)
    //     .join("");
    //   console.log(transcript);

    let finalTranscript = "";
    mic.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript + " ";
        else interimTranscript += transcript;
      }
      setInput(finalTranscript);
    };

    mic.onerror = (event) => {
      console.log(event.error);
    };
  };

  return (
    <form className="search">
      <div className="search__input">
        <SearchIcon className="search__inputIcon" />
        <input value={input} onChange={(e) => setInput(e.target.value)} />

        <MicIcon
          onClick={() => {
            // {
            //   () => setIsListening((prevState) => !prevState);
            // }
            listening();
          }}
          className="search__mic"
        />
      </div>

      {!hideButtons ? (
        <div className="search__buttons">
          <Button type="submit" onClick={search} variant="outlined">
            Google Search
          </Button>
          <Button variant="outlined">I'm feeling Lucky</Button>
        </div>
      ) : (
        <div className="search__buttons">
          <Button
            className="search__buttonsHidden"
            type="submit"
            onClick={search}
            variant="outlined"
          >
            Google Search
          </Button>
          <Button className="search__buttonsHidden" variant="outlined">
            I'm feeling Lucky
          </Button>
        </div>
      )}
    </form>
  );
}

export default Search;
