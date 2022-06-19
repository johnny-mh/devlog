const siteMetadata = {
  pathPrefix: "./", // Prefix for all links. If you deploy your site to example.com/portfolio your pathPrefix should be "portfolio"
  title: "JOHNNY DEV", // Navigation and Site Title
  titleAlt: "JOHNNY DEV", // Title for JSONLD
  description: "Developer who want to write good codes",
  headline: "Developer who want to write good codes", // Headline for schema.org JSONLD
  siteUrl: "https://johnny-mh.github.io", // Domain of your site. No trailing slash!
  siteLanguage: "kr", // Language Tag on <html> element
  banner: "/logo.png", // Used for SEO
  ogLanguage: "ko_KR", // Facebook Language

  // JSONLD / Manifest
  favicon: "src/images/favicon.png", // Used for manifest favicon generation
  shortName: "JOHNNY DEV", // shortname for manifest. MUST be shorter than 12 characters
  author: "johnny.kim", // Author for schemaORGJSONLD
  themeColor: "#FFFFFF",
  backgroundColor: "#FFFFFF",

  twitter: "", // Twitter Username
  facebook: "", // Facebook Site Name
  googleAnalyticsID: "UA-153662393-1",

  skipNavId: "reach-skip-nav", // ID for the "Skip to content" a11y feature
}

module.exports = {
  siteMetadata,
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
        name: siteMetadata.title,
        short_name: siteMetadata.titleAlt,
        start_url: siteMetadata.pathPrefix,
        background_color: siteMetadata.backgroundColor,
        theme_color: siteMetadata.themeColor,
        display: `standalone`,
        icon: siteMetadata.favicon,
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
