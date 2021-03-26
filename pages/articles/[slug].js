import { Layout, AppLink } from "../../components"
import { stringToDate } from "../../utils"

const ArticlePage = ({
  published_at,
  title,
  body_markdown,
  user,
  tag_list,
}) => {
  return (
    <PageLayout>
      <div className="py-12 border-t-2 border-green-700 border-opacity-30 space-y-4">
        <div className="text-center text-gray-500 text-opacity-95">
          {stringToDate(published_at)}
        </div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex flex-row justify-around">
          <div className="">
            <AppLink
              href={`https://github.com/${user.github_username}`}
              target="_blank"
            >
              <a className="text-gray-700">{`@${user.username}`}</a>
            </AppLink>
          </div>
          <div className="flex flex-row">
            {tag_list.length &&
              tag_list
                .split(",")
                .map((tag, index) => (
                  <div key={index} className="pl-1">{`#${tag.trim()}`}</div>
                ))}
          </div>
        </div>
        <div className="text-justify">{body_markdown}</div>
      </div>
    </PageLayout>
  )
}

const PageLayout = ({ children }) => {
  return (
    <Layout>
      <AppLink href="/articles">
        <a className="text-green-700">← Articles</a>
      </AppLink>
      {children}
    </Layout>
  )
}

export async function getStaticPaths() {
  const res = await fetch(`${process.env.API_HOST}/articles/me`, {
    method: "GET",
    headers: { "api-key": process.env.DEV_TO_API_KEY },
  })
  const articles = await res.json()

  const paths = articles.map(({ slug }) => ({
    params: { slug: slug },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const res = await fetch(
    `${process.env.API_HOST}/articles/${process.env.DEV_TO_USERNAME}/${params.slug}`,
    {
      method: "GET",
      headers: { "api-key": process.env.DEV_TO_API_KEY },
    }
  )
  const article = await res.json()
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1

  return {
    props: article,
  }
}

export default ArticlePage
