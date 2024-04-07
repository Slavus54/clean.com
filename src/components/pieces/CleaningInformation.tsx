import React from 'react'
import {CleaningInfoProps} from '../../types/types'

const CleaningInformation: React.FC<CleaningInfoProps> = ({dateUp, time}) => 

    <div className='items small'>
        <h4 className='pale'>Date: <b>{dateUp}</b></h4>
        <h4 className='pale'>Start in <b>{time}</b></h4>
    </div>

export default CleaningInformation