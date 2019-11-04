const withSass = require("@zeit/next-sass");
const path = require('path');

module.exports = withSass({
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  }
});