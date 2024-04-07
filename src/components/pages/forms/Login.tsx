import {useState, useEffect, useContext} from 'react'
import {useMutation} from '@apollo/client'
import {onGetName} from '../../../store/storage'
import Centum from 'centum.js'
import {PROJECT_TITLE} from '../../../env/env'
import {Context} from '../../../context/WebProvider'
import {loginProfileM} from '../../../graphql/profile/ProfileQueries'

const Login = () => {
    const {change_context} = useContext(Context)
    const [state, setState] = useState({
        name: onGetName()?.name,
        password: ''
    })

    const centum = new Centum()

    const {name, password} = state   

    useEffect(() => {
        centum.title('Login to Account', PROJECT_TITLE)
    }, [])

    const [loginProfile] = useMutation(loginProfileM, {
        onCompleted(data) {
            let info = data.loginProfile

            change_context('update', info, 3)
            window.location.reload()
        }
    })

    const onLogin = () => {
        loginProfile({
            variables: {
                name, password
            }
        })
    }

    return (
        <div className='main'>
            <h1>Enter to Account</h1>
            <input value={name} onChange={e => setState({...state, name: e.target.value})} placeholder='Fullname' type='text' /> 
            <input value={password} onChange={e => setState({...state, password: e.target.value})} placeholder='Password' type='text' />           

            <button onClick={onLogin}>Login</button>
        </div>
    )
}

export default Login