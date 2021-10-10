import {alpha, createTheme, InputBase, PaletteMode, styled, Theme, ThemeProvider} from '@mui/material'
import React, {FC, useEffect, useState} from 'react'
import Container from '@mui/material/Container'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import {Movie, Pagination} from './types'
import {getMovieFetchQuery, BASE_URL} from './external'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import SearchIcon from '@mui/icons-material/Search';


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

        fetchMovies(query).catch(console.error)

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

    const getFilteredMovieList = () => {
        return movies.filter(movie => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    return (
        <ThemeProvider theme={theme}>
            <Container>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                            >
                                Movees DB
                            </Typography>
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                    onChange={onChangeSearchInput}
                                />
                            </Search>
                        </Toolbar>
                    </AppBar>

                <TableContainer component={Paper}>
                    <Table aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell align="right">Budget</TableCell>
                                <TableCell align="right">Release date</TableCell>
                                <TableCell align="right">Vote average</TableCell>
                                <TableCell align="right">Genres</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                getFilteredMovieList()
                                    .slice(paginationState.page * paginationState.pageSize, paginationState.page * paginationState.pageSize + paginationState.pageSize)
                                    .map((movie, index) => (
                                <TableRow
                                    key={index}
                                >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{movie.title}</TableCell>
                                    <TableCell align="right">{movie.budget}</TableCell>
                                    <TableCell align="right">{movie.release_date}</TableCell>
                                    <TableCell align="right">{movie.vote_average}</TableCell>
                                    <TableCell align="right">{movie.genres[0].genre_name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={getFilteredMovieList().length}
                        page={paginationState.page}
                        onPageChange={onPageChange}
                        rowsPerPage={paginationState.pageSize}
                        onRowsPerPageChange={onChangeRowsPerPage}
                    />
                </TableContainer>
            </Container>
        </ThemeProvider>
    )
}

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));
