import React from 'react'
import { useOutletContext } from 'react-router-dom'
import TabsRouter from '../components/CustomTabs'

export default function Settings() {
    const [initData, setInitData] = useOutletContext();
    return <TabsRouter context={[initData, setInitData]} />
}
