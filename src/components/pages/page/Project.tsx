import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {Datus} from 'datus.js'
import {DETAIL_TYPES, LEVELS, PROJECT_STATUSES, PROJECT_TITLE, VIEW_CONFIG, token} from '../../../env/env'
import {Context} from '../../../context/WebProvider'
import MapPicker from '../../UI/MapPicker'
import ImageLoader from '../../UI/ImageLoader'
import ImageLook from '../../UI/ImageLook'
import CloseIt from '../../UI/CloseIt'
import DataPagination from '../../UI/DataPagination'
import Loading from '../../UI/Loading'
import {buildNotification} from '../../../store/effects'
import {getProjectM, manageProjectDetailM, updateProjectInformationM, makeProjectFactM} from '../../../graphql/pages/ProjectPageQueries'
import {Cords, MapView, CollectionPropsType} from '../../../types/types'

const Project: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState<MapView>(VIEW_CONFIG)
    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [points, setPoints] = useState<number>(0)
    const [likes, setLikes] = useState<number>(0)
    const [image, setImage] = useState<string>('')

    const [project, setProject] = useState<any | null>(null)
    const [details, setDetails] = useState<any[]>([])
    const [detail, setDetail] = useState<any | null>(null)
    const [fact, setFact] = useState<any | null>(null)
    
    const centum = new Centum()  
    const datus = new Datus()

    const [state, setState] = useState({
        title: '',
        category: DETAIL_TYPES[0],
        dateUp: datus.timestamp('date'),
        text: '',
        level: LEVELS[0],
        isTrue: true,
        status: PROJECT_STATUSES[0],
        rating: 0
    })

    const {title, category, dateUp, text, level, isTrue, status, rating} = state

    const [getProject] = useMutation(getProjectM, {
        onCompleted(data) {
            setProject(data.getProject)
        }
    })

    const [manageProjectDetail] = useMutation(manageProjectDetailM, {
        onCompleted(data) {
            buildNotification(data.manageProjectDetail)
        }
    })

    const [updateProjectInformation] = useMutation(updateProjectInformationM, {
        onCompleted(data) {
            buildNotification(data.updateProjectInformation)
        }
    })

    const [makeProjectFact] = useMutation(makeProjectFactM, {
        onCompleted(data) {
            buildNotification(data.makeProjectFact)
        }
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getProject({
                variables: {
                    shortid: id
                }
            })
        }   
        
        centum.title('Project', PROJECT_TITLE)
    }, [context.account_id])

    useMemo(() => {
        if (project !== null) {
            setCords(project.cords)

            setState({...state, status: project.status, rating: project.rating})      
        }
    }, [project])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    useMemo(() => {
        setLikes(detail === null ? 0 : detail.likes + 1)
    }, [detail])

    const onFact = () => {
        if (fact === null) {
            let result = centum.random(project.facts)?.value

            if (result !== undefined) {
                setFact(result)
            }
        } else {
            let award: number = LEVELS.indexOf(fact.level) + 1

            if (fact.isTrue === isTrue) {
                setPoints(points + award)
            }

            setFact(null)
        }
    }

    const onManageDetail = (option: string) => {
        manageProjectDetail({
            variables: {
                name: context.name, id, option, title, category, image, likes, dateUp, coll_id: detail === null ? '' : detail.shortid 
            }
        })
    }

    const onUpdateInfo = () => {
        updateProjectInformation({
            variables: {
                name: context.name, id, status, rating
            }
        })
    }

    const onMakeFact = () => {
        makeProjectFact({
            variables: {
                name: context.name, id, text, level, isTrue
            }
        })
    }

    return (
        <>
            {project !== null &&
                <>
                    <h2>{project.title}</h2>

                    <div className='items small'>
                        <h4 className='pale'>Type: {project.category}</h4>
                        <h4 className='pale'>Century: {project.century}</h4>
                    </div>

                    <ReactMapGL {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                    </ReactMapGL>

                    {detail === null ? 
                            <>
                                <h2>Project's Detail</h2>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Describe it...' />

                                <h4 className='pale'>Type</h4>
                                <div className='items small'>
                                    {DETAIL_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                                </div>

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageDetail('create')}>Create</button>

                                <DataPagination initialItems={project.details} setItems={setDetails} label='List of details:' />
                                <div className='items half'>
                                    {details.map(el => 
                                        <div onClick={() => setDetail(el)} className='item panel'>
                                            {centum.shorter(el.title)}
                                            <p className='pale'>{el.dateUp}</p>
                                        </div>    
                                    )}
                                </div>
                            </>
                        :      
                            <>
                                <CloseIt onClick={() => setDetail(null)} />

                                {detail.image !== '' && <ImageLook src={detail.image} className='photo' alt='detial photo' />}
                                <h2>{detail.title}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Type: {detail.category}</h4>
                                    <h4 className='pale'><b>{detail.likes}</b> likes</h4>
                                </div>

                                {context.name === detail.name ?
                                        <button onClick={() => onManageDetail('delete')}>Delete</button>
                                    :
                                        <button onClick={() => onManageDetail('like')}>Like</button>
                                }
                            </>              
                    }

                   

                    <h4 className='pale'>Safety: <b>{rating}%</b></h4>
                    <input value={rating} onChange={e => setState({...state, rating: parseInt(e.target.value)})} type='range' step={1} />

                    <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                        {PROJECT_STATUSES.map(el => <option value={el}>{el}</option>)}
                    </select> 

                    <button onClick={onUpdateInfo} className='light'>Update</button>

                    {fact === null ? 
                            <>
                                <h2>Fact Guessing Game</h2>

                                <h4 className='pale'>Points: <b>{points}</b></h4>

                                <button onClick={onFact} className='light'>New</button>

                                <h2>Something New</h2>
                            
                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Content...' />

                                <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                                    {LEVELS.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <p onClick={() => setState({...state, isTrue: !isTrue})} className='pale'>Position: {isTrue ? 'Truth' : 'Lie'}</p>

                                <button onClick={onMakeFact}>Publish</button>
                            </>
                        :      
                            <>
                                <h2>Fact from {fact.name}</h2>
                                <p>Text: {fact.text}</p>

                                <p onClick={() => setState({...state, isTrue: !isTrue})} className='pale'>Position: {isTrue ? 'Truth' : 'Lie'}</p>

                                <button onClick={onFact} className='light'>Check</button>
                            </>              
                    }
                </>
            }

            {project === null && <Loading label="Project's" />}
        </>
    )
}

export default Project