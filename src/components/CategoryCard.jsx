import { Card, CardActionArea, CardContent, Typography } from '@mui/material'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

export default function CategoryCard({ data }) {
    return (
        <>
            <Card>
                <CardActionArea component={RouterLink} to={data.id}>
                    <CardContent>
                        <Typography variant="h3" component="h3" sx={{ fontSize: 22, textTransform: "capitalize" }} >{data.title}</Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </>
    )
}
