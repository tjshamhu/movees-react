import {createTheme, Theme, ThemeProvider} from '@mui/material'
import React, {FC, useEffect, useState} from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import {Movie, Pagination} from './types'
import {getMovieFetchQuery, BASE_URL} from './external'

const initialState = {
    loading: false,
    page: 1,
    pageSize: 25,
    searchTerm: '',
}

export const App: FC = () => {
    const mdTheme = createTheme()
    const [theme, setTheme] = useState<Theme>(mdTheme)
    const [paginationState, setPaginationState] = useState<Pagination>(initialState)
    const [movies, setMovies] = useState<Array<Movie>>([])


    useEffect( () => {
        const query = getMovieFetchQuery({
            page: paginationState.page,
            pageSize: paginationState.pageSize,
            searchTerm: paginationState.searchTerm
        })

        const fetchMovies = async (query: string) => {
            const rawResponse = await fetch(BASE_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query })
            })
            const response = await rawResponse.json()
            const movies = response.data.movies
            setMovies(movies)
        }

        fetchMovies(query).catch(console.error)

    }, [movies, paginationState])

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <header className="App-header">
                </header>
                <Container maxWidth="lg" sx={{m: 20}}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8} lg={9}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 240,
                                }}
                            >
                                <Typography component="h2" variant="h6" color="primary" gutterBottom>Movees
                                    DB</Typography>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Budget</TableCell>
                                            <TableCell>Release date</TableCell>
                                            <TableCell>Vote Average</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {movies.map((row, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{row.title}</TableCell>
                                                <TableCell>{row.budget}</TableCell>
                                                <TableCell>{row.release_date}</TableCell>
                                                <TableCell>{row.vote_average}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        </ThemeProvider>
    )
}
