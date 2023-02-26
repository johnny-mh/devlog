const siteMetadata = require('./site-metadata')

module.exports = {
  siteMetadata,
  graphqlTypegen: true,
  trailingSlash: 'always',
  plugins: [
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sass`,
    'gatsby-plugin-emotion',
    `gatsby-plugin-sitemap`,
    {
      resolve: "gatsby-plugin-webpack-bundle-analyser-v2",
      options: {
        devMode: true,
      },
    },
    {
      resolve: 'gatsby-plugin-svgr',
      options: {
        svgo: false,
        ref: true,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
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
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-prismjs',
          'gatsby-remark-autolink-headers',
          `gatsby-remark-images-medium-zoom`,
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1366,
              showCaptions: ['alt'],
              quality: 85,
              linkImagesToOriginal: false,
            },
          },
          {
            resolve: 'gatsby-remark-external-links',
            options: { target: '_blank', rel: 'nofollow' },
          },
        ],
      },
    },

    {
      resolve: 'gatsby-source-filesystem',
      options: { name: 'post', path: `${__dirname}/content/posts` },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: { name: 'page', path: `${__dirname}/content/pages` },
    },
    {
      resolve: `gatsby-plugin-fusejs`,
      options: {
        query: `
          {
            allMarkdownRemark(filter: {fields: {type: {eq: "post"}}}) {
              nodes {
                id
                rawMarkdownBody
                fields {
                  slug
                }
                frontmatter {
                  title
                }
              }
            }
          }
        `,
        keys: ['title', 'body'],
        normalizer: ({ data }) =>
          data.allMarkdownRemark.nodes.map((node) => ({
            id: node.id,
            path: node.fields.slug,
            title: node.frontmatter.title,
            body: node.rawMarkdownBody,
          })),
      },
    },

    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
            {
              site {
                siteMetadata {
                  title
                  description
                  siteUrl
                  site_url: siteUrl
                }
              }
            }
          `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.nodes.map((node) => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + node.fields.slug,
                  guid: site.siteMetadata.siteUrl + node.fields.slug,
                  custom_elements: [
                    {
                      'content:encoded': node.html,
                    },
                  ],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { fields: {date: DESC} }
                  filter: {fields: {type: {eq: "post"}}}
                ) {
                  nodes {
                    excerpt
                    fields {
                      slug
                      date
                    }
                    frontmatter {
                      title
                    }
                    html
                  }
                }
              }
              `,
            output: '/rss.xml',
            title: `${siteMetadata.siteUrl} RSS Feed`,
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: siteMetadata.siteUrl,
        sitemap: `${siteMetadata.siteUrl}/sitemap/sitemap-index.xml`,
        policy: [
          {
            userAgent: '*',
            allow: '/',
            disallow: [
              '/about/',
              '/archives/',
              '/post/category/',
              '/post/tag/',
            ],
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        trackingIds: [siteMetadata.googleAnalyticsID],
      },
    },
  ],
}
