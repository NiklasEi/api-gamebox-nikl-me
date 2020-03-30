'use strict';

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/data/modules/`
      }
    },
    'gatsby-plugin-typescript',
    'gatsby-plugin-tslint'
  ]
};
