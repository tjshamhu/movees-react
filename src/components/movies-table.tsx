import React, {FC} from 'react'
import {Movie} from '../types'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import TablePagination from '@mui/material/TablePagination'
import Chip from '@mui/material/Chip'

type Props = {
    movies: Array<Movie>
    onPageChange: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number) => void,
    onChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    page: number,
    pageSize: number
}

export const MoviesTable: FC<Props> = ({movies, onPageChange, onChangeRowsPerPage,  pageSize, page}) => {

    const getMovieRatingChipColor = (rating: number) => {
        if (rating >= 8) return 'success'
        if (rating >= 6) return 'warning'
        return 'error'
    }

    return <TableContainer component={Paper}>
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
                    movies
                        .slice(page * pageSize, page * pageSize + pageSize)
                        .map((movie, index) => (
                            <TableRow
                                key={index}
                            >
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{movie.title}</TableCell>
                                <TableCell align="right">{movie.budget}</TableCell>
                                <TableCell align="right">{movie.release_date}</TableCell>
                                <TableCell align="right">
                                    <Chip label={movie.vote_average} size="small" color={getMovieRatingChipColor(movie.vote_average)} />
                                </TableCell>
                                <TableCell align="right">
                                        {movie.genres.map((genre, index) => <Chip key={index} label={genre.genre_name}/>)}
                                </TableCell>
                            </TableRow>
                        ))}
            </TableBody>
        </Table>
        <TablePagination
            component="div"
            count={movies.length}
            page={page}
            onPageChange={onPageChange}
            rowsPerPage={pageSize}
            onRowsPerPageChange={onChangeRowsPerPage}
        />
    </TableContainer>
}
