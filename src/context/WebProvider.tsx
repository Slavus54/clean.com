import React, {useState, createContext} from 'react'
import {useLocation} from 'wouter'
//@ts-ignore
import Cookies from 'js-cookie'
import {ContextStateType} from '../types/types'
import {PROFILE_INFO_KEY} from '../env/env'

export const initialState: ContextStateType = {
    account_id: '',
    name: '',
    role: ''
}

export const Context = createContext<any>(initialState)

type Props = {
    children: React.ReactNode
}

export const WebProvider = ({children}: Props) => {
    const [loc, setLoc] = useLocation()
    const [context, setContext] = useState(initialState) 

    const change_context = (command = 'create', data = null, expires = 1, redirect_url = '/') => {
        if (command === 'create') {
            let cookie = Cookies.get(PROFILE_INFO_KEY)
            let result = cookie === undefined ? null : JSON.parse(cookie)

            if (result === null) {
                Cookies.set(PROFILE_INFO_KEY, result, {expires: 1})
            } else {
                setContext({...context, account_id: result.account_id, name: result.name, role: result.role})
            }
        } else if (command === 'update') {
            Cookies.set(PROFILE_INFO_KEY, JSON.stringify(data), {expires})

            setLoc(redirect_url)
        }   
    }

    return <Context.Provider value={{context, change_context}}>{children}</Context.Provider>
}