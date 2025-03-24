import { useProgress } from "@react-three/drei";
import { usePlay } from "../contexts/Play";
import React from "react";

export const Overlay = () => {
  const { progress } = useProgress();
  const { play, end, setPlay, hasScroll } = usePlay();
  return (
    <div
      className={`overlay ${play ? "overlay--disable" : ""}
    ${hasScroll ? "overlay--scrolled" : ""}`}
    >
      <div
        className={`loader ${progress === 100 ? "loader--disappear" : ""}`}
      />
      {progress === 100 && (
        <div className={`intro ${play ? "intro--disappear" : ""}`}>
          <h1 className="logo">
            CHANGHEE LEE
            {/* <div className="spinner">
              <div className="spinner__image" />
            </div> */}
          </h1>
          <p className="intro__scroll">
            Scroll to explore the world of my portfolio
          </p>
          <button
            className="explore"
            onClick={() => {
              console.log("Explore clicked");
              setPlay(true);
            }}
          >
            EXPLORE
          </button>
        </div>
      )}
      <div className={`outro ${end ? "outro--appear" : ""}`}>
        <div className="outro__content">
          <p className="outro__text">
            Thanks for taking the time to view my portfolio.
          </p>

          {/* 마지막 화면에서만 버튼 보이게 */}
          {end && (
            <button
              className="outro__button"
              onClick={() => (window.location.href = "/")}
            >
              Restart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
