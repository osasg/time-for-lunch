import React from 'react';

export default function (Page) {
  return () => (
    <div className="d-layout">
      <Page />
    </div>
  );
}