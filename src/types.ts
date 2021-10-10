export type Movie = {
    title: string
    overview: string
    budget: number
    release_date: string
    vote_average: number
    cast: {
        character_name: string
    }
    genres: {
        genre_name: string
    }
}

export type Pagination = {
    loading: boolean
    page: number
    pageSize: number
    searchTerm: string
}
