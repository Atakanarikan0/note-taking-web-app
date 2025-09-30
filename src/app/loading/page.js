"use client"
import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader-con">
        <div className="pfile" style={{ "--i": 0 }} />
        <div className="pfile" style={{ "--i": 1 }} />
        <div className="pfile" style={{ "--i": 2 }} />
        <div className="pfile" style={{ "--i": 3 }} />
        <div className="pfile" style={{ "--i": 4 }} />
        <div className="pfile" style={{ "--i": 5 }} />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loader-con {
    position: relative;
    width: 100%;
    height: 50vh;
    overflow: hidden;
  }

  .pfile {
    position: absolute;
    bottom: 25px;
    width: 40px;
    height: 50px;
    background: linear-gradient(90deg, #b324db, #ac8dcb);
    border-radius: 4px;
    transform-origin: center;
    animation: flyRight 3s ease-in-out infinite;
    opacity: 0;
    animation-delay: calc(var(--i) * 0.6s);
  }

  .pfile::before {
    content: "";
    position: absolute;
    top: 6px;
    left: 6px;
    width: 28px;
    height: 4px;
    background-color: #ffffff;
    border-radius: 2px;
  }

  .pfile::after {
    content: "";
    position: absolute;
    top: 13px;
    left: 6px;
    width: 18px;
    height: 4px;
    background-color: #ffffff;
    border-radius: 2px;
  }

  @keyframes flyRight {
    0% {
      left: -10%;
      transform: scale(0);
      opacity: 0;
    }
    50% {
      left: 45%;
      transform: scale(1.2);
      opacity: 1;
    }
    100% {
      left: 100%;
      transform: scale(0);
      opacity: 0;
    }
  }
`;

export default Loader;
