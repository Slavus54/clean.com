import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {PROJECT_TYPES, ARCHITECTURES, CENTURIES, PROJECT_STATUSES, INITIAL_PERCENT, SEARCH_PERCENT, PROJECT_TITLE, VIEW_CONFIG, token} from '../../../env/env'
import {gain} from '../../../store/storage'
import {Context} from '../../../context/WebProvider'
import MapPicker from '../../UI/MapPicker'
import FormPagination from '../../UI/FormPagination'
import {buildNotification} from '../../../store/effects'
import {createProjectM} from '../../../graphql/pages/ProjectPageQueries'
import {TownType, MapView, CollectionPropsType} from '../../../types/types'

const CreateProject: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState<MapView>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [idx, setIdx] = useState<number>(0)

    const centum = new Centum()

    const [state, setState] = useState({
        title: '', 
        category: PROJECT_TYPES[0], 
        architecture: ARCHITECTURES[0], 
        century: CENTURIES[0], 
        author: '',
        region: towns[0].title, 
        cords: towns[0].cords,
        status: PROJECT_STATUSES[0], 
        rating: INITIAL_PERCENT
    })

    const {title, category, architecture, century, author, region, cords, status, rating} = state

    useEffect(() => {
        centum.title('New Project', PROJECT_TITLE)
    }, [])

    const [createProject] = useMutation(createProjectM, {
        optimisticResponse: true,
        onCompleted(data) {
            buildNotification(data.createProject)
        }
    })

    useMemo(() => {
        if (region !== '') {
            let result = towns.find(el => centum.search(el.title, region, SEARCH_PERCENT, true)) 
    
            if (result !== undefined) {
                setState({...state, region: result.title, cords: result.cords})
            }           
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    const onCreate = () => {
        createProject({
            variables: {
                name: context.name, id, title, category, architecture, century, author, region, cords, status, rating
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <h4 className='pale'>Headline</h4>
                        <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Title' type='text' />
                
                        <h4 className='pale'>Type</h4>
                        <div className='items small'>
                            {PROJECT_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>

                        <h4 className='pale'>Style and Century</h4>
                        <div className='items small'>
                            <select value={architecture} onChange={e => setState({...state, architecture: e.target.value})}>
                                {ARCHITECTURES.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={century} onChange={e => setState({...state, century: e.target.value})}>
                                {CENTURIES.map(el => <option value={el}>{el}</option>)}
                            </select>
                        </div> 
                    </>,             
                    <>
                        <div className='items small'>
                            <div className='item'>
                                <h4 className='pale'>Where it located?</h4>
                                <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Nearest town' type='text' />
                            </div>

                            <div className='item'>
                                <h4 className='pale'>Who is architector?</h4>
                                <input value={author} onChange={e => setState({...state, author: e.target.value})} placeholder='Fullname' type='text' />
                            </div>
                        </div>

                        <h4 className='pale'>Safety: <b>{rating}%</b></h4>
                        <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />

                        <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                            {PROJECT_STATUSES.map(el => <option value={el}>{el}</option>)}
                        </select>
                                                
                        <ReactMapGL onClick={e => setState({...state, cords: centum.mapboxCords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker type='picker' />
                            </Marker>
                        </ReactMapGL>  

                        <button onClick={onCreate}>Create</button>
                    </>
                ]} 
            >
                <h2>New Project</h2>
            </FormPagination>          
        </div>
    )
}

export default CreateProject