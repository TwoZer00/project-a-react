import { Stack } from '@mui/material';
import React from 'react';
import CategoryCard from './CategoryCard';

export default function CategoriesList({ categories }) {
    return (
        <>
            <Stack direction={"row"} flexWrap={"wrap"} justifyContent={"center"} paddingBottom={2} gap={2}>
                {categories?.map((category, index) => { return <CategoryCard key={category.id + index} data={category} /> })}
            </Stack>
        </>
    )
}
