import React from 'react'
import {LoadingPropsType} from '../../types/types'

const Loading: React.FC<LoadingPropsType> = ({label = ''}) => 
<>
    <img src='../loading.gif' className='loader' alt='Loading' />
    {label} loading...
</>

export default Loading