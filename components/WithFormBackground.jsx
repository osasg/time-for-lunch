import React from 'react';

export default function WithFormBackground(Page) {
  const Wrapper = (props) => (
    <div className="form-background">
      <Page />
    </div>
  );

  Wrapper.getInitialProps = async (ctx) => {
    return Page.getInitialProps
      ? await Page.getInitialProps(ctx)
      : {};
  }

  return Wrapper;
}

