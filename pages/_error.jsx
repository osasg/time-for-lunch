import React from 'react';

export default function () {
  return (
    <div className="not-found-page">
      <h1>Page not found</h1>
      <button onClick={() => window.history.go(-1)} className="btn">Back</button>
    </div>
  );
}