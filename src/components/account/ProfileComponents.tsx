import {useState, useEffect} from 'react'
import Centum from 'centum.js'
import components from '../../env/components.json'
import {SEARCH_PERCENT} from '../../env/env'
import NavigatorWrapper from '../router/NavigatorWrapper'
import DataPagination from '../UI/DataPagination'
import {AccountPageComponentProps} from '../../types/types'

const ProfileComponents = ({profile, context}: AccountPageComponentProps) => {
    const [items, setItems] = useState<any[]>([])
    const [title, setTitle] = useState<string>('')

    const centum = new Centum()

    useEffect(() => {
        let result: any[] = profile.account_components

        if (title !== '') {
            result = result.filter(el => centum.search(el.title, title, SEARCH_PERCENT))
        }

        setItems(result)
    }, [title])

    return (
        <>
            <h2>Create and Explore</h2>
            <div className='items small'>
                {components.map(el => 
                    <NavigatorWrapper key={el.path} id='' isRedirect={false} url={`/create-${el.path}/${context.account_id}`}>
                        <h4>{el.title}</h4>
                    </NavigatorWrapper>   
                )}
            </div>

            <h2>Search</h2>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Title of component...' type='text' />

            <DataPagination initialItems={profile.account_components} setItems={setItems} label='Components:' />
            <div className='items half'>
                {items.map(el =>
                    <div key={el.shortid} className='item panel'>
                        <NavigatorWrapper id='' isRedirect={false} url={`/${el.path}/${el.shortid}`}>
                            {centum.shorter(el.title)}
                            <h5 className='pale'>{el.path}</h5>
                        </NavigatorWrapper>    
                    </div>
                )}
            </div> 
        </> 
    )
}

export default ProfileComponents