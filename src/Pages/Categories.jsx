import React from 'react';
import { Outlet, useLoaderData, useOutletContext } from 'react-router-dom';
import CategoriesList from '../components/CategoriesList';

export default function Categories() {
    const [initData, setInitData] = useOutletContext()
    const categories = useLoaderData();
    // console.log(categories);
    return (
        <>
            <CategoriesList categories={categories} />
            <Outlet context={[initData, setInitData]} />
        </>
    )
}
