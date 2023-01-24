module.exports = {
  pathPrefix: './', // Prefix for all links. If you deploy your site to example.com/portfolio your pathPrefix should be "portfolio"
  title: 'JOHNNY DEV', // Navigation and Site Title
  titleAlt: 'JOHNNY DEV', // Title for JSONLD
  description: 'Developer who want to write good codes',
  headline: 'Developer who want to write good codes', // Headline for schema.org JSONLD
  siteUrl: 'https://johnny-mh.github.io', // Domain of your site. No trailing slash!
  siteLanguage: 'kr', // Language Tag on <html> element
  banner: '/logo.png', // Used for SEO
  ogLanguage: 'ko_KR', // Facebook Language

  // JSONLD / Manifest
  favicon: 'src/images/favicon.png', // Used for manifest favicon generation
  shortName: 'JOHNNY DEV', // shortname for manifest. MUST be shorter than 12 characters
  author: 'johnny.kim', // Author for schemaORGJSONLD
  themeColor: '#FFFFFF',
  backgroundColor: '#FFFFFF',

  twitter: '', // Twitter Username
  facebook: '', // Facebook Site Name
  googleAnalyticsID: 'G-R9PQNBWGC9',

  skipNavId: 'reach-skip-nav', // ID for the "Skip to content" a11y feature
}
