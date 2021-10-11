export type Movie = {
    title: string
    budget: number
    release_date: string
    vote_average: number
    genres: Array<{
        genre_name: string
    }>
}

export type Pagination = {
    page: number
    pageSize: number
}
