module.exports = {
  siteMetadata: {
    title: `johnnydev`,
    description: `This is a gatsby application created by Nx.`,
  },
  plugins: [
    "gatsby-plugin-styled-components",

    {
      resolve: "gatsby-plugin-svgr",
      options: {
        svgo: false,
        ref: true,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: { name: "post", path: `${__dirname}/content/posts` },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: { name: "page", path: `${__dirname}/content/pages` },
    },
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    {
      resolve: require.resolve(`@nrwl/gatsby/plugins/nx-gatsby-ext-plugin`),
      options: {
        path: __dirname,
      },
    },
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `johnnydev`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/logo.svg`,
      },
    },
    `gatsby-plugin-sass`,
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          "gatsby-remark-prismjs",
          "gatsby-remark-autolink-headers",
          {
            resolve: "gatsby-remark-images",
            options: { maxWidth: 1366, showCaptions: ["alt"], quality: 85 },
          },
        ],
      },
    },
  ],
}
