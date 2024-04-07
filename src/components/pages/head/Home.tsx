import React, {useContext} from 'react'
import Welcome from './Welcome'
import AccountPage from './AccountPage'
import {Context} from '../../../context/WebProvider'

const Home: React.FC = () => {
    const {context} = useContext(Context)

    return (
        <>
            {context.account_id === '' ? <Welcome /> : <AccountPage />}  
        </>
    )
}

export default Home