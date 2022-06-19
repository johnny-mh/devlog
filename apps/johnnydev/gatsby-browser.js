/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it
import "./src/styles/reset.scss"
import "./src/styles/site.scss"
import "./src/styles/markdown-content.scss"

import dayjs from "dayjs"
import "dayjs/locale/ko"

dayjs.locale("ko")
dayjs.extend(require("dayjs/plugin/localizedFormat"))
