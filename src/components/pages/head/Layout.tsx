import {useMemo, useContext} from 'react'
import {Context} from '../../../context/WebProvider'
import Router from '../../router/Router'

const Layout = () => {
    const {change_context, context} = useContext(Context)

    useMemo(() => {
        change_context('create', null)
    }, [])

    return (
        <div className='main'>
            <Router account_id={context.account_id} name={context.name} />
        </div>
    )
}

export default Layout