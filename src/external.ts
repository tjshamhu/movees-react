export const BASE_URL ='https://mo-vees.herokuapp.com/api'

type Params = {
    page?: number,
    pageSize?: number,
    searchTerm?: string
}

export const getMovieFetchQuery = ({page = 1, pageSize = 25, searchTerm = ''}: Params) => `
{
  movies(page: ${page} pageSize: ${pageSize} searchTerm: "${searchTerm}") {
    title
    budget
    release_date
    vote_average
    genres {
      genre_name
    }
  }
}
`
