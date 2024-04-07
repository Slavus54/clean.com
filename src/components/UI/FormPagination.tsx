import React from 'react'
import LeftArrow from '../../assets/left.png'
import RightArrow from '../../assets/right.png'
import ImageLook from './ImageLook'
import {FormPaginationProps} from '../../types/types'

const FormPagination: React.FC<FormPaginationProps> = ({children, num, setNum, items = []}) => {
    return (
        <>
            <div className='items small'>
                <ImageLook onClick={() => num > 0 && setNum(num - 1)} src={LeftArrow} min={2} max={2} className='icon' alt='prev' />
                {children}
                <ImageLook onClick={() => num < items.length - 1 && setNum(num + 1)} src={RightArrow} min={2} max={2} className='icon' alt='next' />
            </div>
            {items[num]}           
        </>
    )
}

export default FormPagination