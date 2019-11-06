import React from 'react';

export default function () {
  return (
    <div className="not-found-page">
      <h1>Page not found</h1>
      <button onClick={() => window.history.go(-1)} className="btn">Back</button>
      <style jsx>{`
        .not-found-page {
          height: 100vh;
          width: 628px;
          text-align: center;
          margin: auto;
          margin-top: 164px;
        }
      `}</style>
    </div>
  );
}