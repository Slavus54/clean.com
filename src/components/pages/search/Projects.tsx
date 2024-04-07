import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useQuery} from '@apollo/client'
import Centum from 'centum.js'
import {PROJECT_TYPES, SEARCH_PERCENT, PROJECT_TITLE, VIEW_CONFIG, token} from '../../../env/env'
import {gain} from '../../../store/storage'
import {Context} from '../../../context/WebProvider'
import NavigatorWrapper from '../../router/NavigatorWrapper'
import MapPicker from '../../UI/MapPicker'
import DataPagination from '../../UI/DataPagination'
import Loading from '../../UI/Loading'
import {getProjectsQ} from '../../../graphql/pages/ProjectPageQueries'
import {TownType, Cords, MapView} from '../../../types/types'

const Projects: React.FC = () => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState<MapView>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())

    const [projects, setProjects] = useState<any[] | null>(null)
    const [filtered, setFiltered] = useState<any[]>([])

    const [title, setTitle] = useState<string>('')
    const [category, setCategory] = useState<string>(PROJECT_TYPES[0])
    const [region, setRegion] = useState<string>(towns[0].title)
    const [cords, setCords] = useState<Cords>(towns[0].cords)

    const centum = new Centum()

    const {data, loading} = useQuery(getProjectsQ)

    useEffect(() => {
        if (data && context.account_id !== '') {
            setProjects(data.getProjects)
        }   
        
        centum.title('Projects', PROJECT_TITLE)
    }, [data])

    useMemo(() => {
        if (region !== '') {
            let result = towns.find(el => centum.search(el.title, region, SEARCH_PERCENT, true)) 
    
            if (result !== undefined) {
                setRegion(result.title)
                setCords(result.cords)
            }           
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    useMemo(() => {
        if (projects !== null) {
            let result: any[] = projects.filter(el => el.region === region)

            if (title !== '' ) {
                result = result.filter(el => centum.search(el.title, title, SEARCH_PERCENT))
            }

            result = result.filter(el => el.category === category)

            setFiltered(result)
        }
    }, [projects, title, category, region])

    return (
        <>
            <div className='items small'>
                <div className='item'>
                    <h4 className='pale'>Headline</h4>
                    <input value={title} onChange={e => setTitle(e.target.value)} placeholder='Title' type='text' />
                </div>

                <div className='item'>
                    <h4 className='pale'>Where it located?</h4>
                    <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Nearest town' type='text' />
                </div>              
            </div>

            <h4 className='pale'>Type</h4>
            <div className='items small'>
                {PROJECT_TYPES.map(el => <div onClick={() => setCategory(el)} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
            </div>

            <DataPagination initialItems={filtered} setItems={setFiltered} label='Projects on map:' />

            {data &&
                <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                    <Marker latitude={cords.lat} longitude={cords.long}>
                        <MapPicker type='picker' />
                    </Marker>

                    {filtered.map(el => 
                        <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                            <NavigatorWrapper url={`/project/${el.shortid}`} isRedirect={false}>
                                {centum.shorter(el.title)}
                            </NavigatorWrapper>
                        </Marker>
                    )}
                </ReactMapGL>  
            }

            {loading && <Loading label='Projects' />}
        </>
    )
}

export default Projects