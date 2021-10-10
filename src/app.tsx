import {
    createTheme,
    Divider,
    PaletteMode,
    Theme,
    ThemeProvider
} from '@mui/material'
import React, {FC, useEffect, useState} from 'react'
import Typography from '@mui/material/Typography'
import {MoviesTable} from './components/movies-table'
import {Movie, Pagination} from './types'
import {getMovieFetchQuery, BASE_URL} from './external'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import {Search} from './components/search-input'
import {ThemeSwitcher} from './components/theme-switch'
import LinearProgress from '@mui/material/LinearProgress'
import Box from '@mui/material/Box'

const initialState = {
    page: 0,
    pageSize: 25,
}

export const App: FC = () => {
    const [lightMode, darkMode] = (['light', 'dark'] as Array<PaletteMode>)
        .map((mode: PaletteMode) => createTheme({
            palette: {mode}
        }))
    const [theme, setTheme] = useState<Theme>(lightMode)
    const [paginationState, setPaginationState] = useState<Pagination>(initialState)
    const [movies, setMovies] = useState<Array<Movie>>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const query = getMovieFetchQuery({
            page: 1,
            pageSize: 200,
        })

        const fetchMovies = async (query: string) => {
            const rawResponse = await fetch(BASE_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({query})
            })
            const response = await rawResponse.json()
            const movies = response.data.movies
            setMovies(movies)
        }

        fetchMovies(query)
            .catch(console.error)
            .finally(() => setLoading(false))

    }, [])

    const onPageChange = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
        newPage: number
    ) => setPaginationState({
        ...paginationState,
        page: newPage
    })

    const onChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => setPaginationState({
        ...paginationState,
        pageSize: Number(event.target.value) || 25,
    })

    const onChangeSearchInput = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => setSearchTerm(event.target.value)

    const onChangeThemeSwitch = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => setTheme(event.target.checked ? darkMode : lightMode)

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h5" component="div" flex="1">Movees DB</Typography>
                    <Search onChange={onChangeSearchInput}/>
                    <ThemeSwitcher checked={theme.palette.mode === 'dark'} onChange={onChangeThemeSwitch}/>
                </Toolbar>
            </AppBar>
            <Divider/>
            { loading ?
                <Box sx={{ width: '100%' }}>
                    <LinearProgress />
                </Box> :
                <MoviesTable
                    page={paginationState.page}
                    pageSize={paginationState.pageSize}
                    onPageChange={onPageChange}
                    onChangeRowsPerPage={onChangeRowsPerPage}
                    movies={movies.filter(movie => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))}
                />
            }
        </ThemeProvider>
    )
}
