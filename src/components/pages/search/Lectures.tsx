import React, {useState, useMemo, useEffect, useContext} from 'react'
import {useQuery} from '@apollo/client'
import Centum from 'centum.js'
import {PROVINCES, ARCHITECTURES, SEARCH_PERCENT, PROJECT_TITLE} from '../../../env/env'
import {Context} from '../../../context/WebProvider'
import NavigatorWrapper from '../../router/NavigatorWrapper'
import DataPagination from '../../UI/DataPagination'
import Loading from '../../UI/Loading'
import {getLecturesQ} from '../../../graphql/pages/LecturePageQueries'

const Lectures: React.FC = () => {
    const {context} = useContext<any>(Context)

    const [lectures, setLectures] = useState<any[] | null>(null)
    const [filtered, setFiltered] = useState<any[]>([])

    const [title, setTitle] = useState<string>('')
    const [province, setProvince] = useState<string>(PROVINCES[0])
    const [architecture, setArchitecture] = useState<string>(ARCHITECTURES[0])

    const centum = new Centum()

    const {data, loading} = useQuery(getLecturesQ)

    useEffect(() => {
        if (data && context.account_id !== '') {
            setLectures(data.getLectures)
        }   
        
        centum.title('Lectures', PROJECT_TITLE)
    }, [data])

    useMemo(() => {
        if (lectures !== null) {
            let result: any[] = lectures.filter(el => el.province === province)

            if (title !== '' ) {
                result = result.filter(el => centum.search(el.title, title, SEARCH_PERCENT))
            }

            result = result.filter(el => el.architecture === architecture)

            setFiltered(result)
        }
    }, [lectures, title, province, architecture])

    return (
        <>
            <h4 className='pale'>Headline</h4>
            <textarea value={title} onChange={e => setTitle(e.target.value)} placeholder='Title of lecture...' />
     
            <h4 className='pale'>Province</h4>
            <div className='items small'>
                {PROVINCES.map(el => <div onClick={() => setProvince(el)} className={el === province ? 'item label active' : 'item label'}>{el}</div>)}
            </div>

            <select value={architecture} onChange={e => setArchitecture(e.target.value)}>
                {ARCHITECTURES.map(el => <option value={el}>{el}</option>)}
            </select>

            <DataPagination initialItems={filtered} setItems={setFiltered} label='List of lectures:' />

            {data &&
                <div className='items half'>
                    {filtered.map(el => 
                        <div className='item panel'>
                            <NavigatorWrapper url={`/lecture/${el.shortid}`} isRedirect={false}>
                                {centum.shorter(el.title)}
                            </NavigatorWrapper>
                        </div>    
                    )}
                </div> 
            }

            {loading && <Loading label='Lectures' />}
        </>
    )
}

export default Lectures