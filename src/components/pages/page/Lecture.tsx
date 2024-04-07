import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {Datus} from 'datus.js'
import {RESOURCE_TYPES, MATERIALS, CENTURIES, INITIAL_PERCENT, SEARCH_PERCENT, PROJECT_TITLE, RESPECT_LIMIT, COURSE_LIMIT, VIEW_CONFIG, token, CONSPECT_TYPES} from '../../../env/env'
import {gain} from '../../../store/storage'
import {Context} from '../../../context/WebProvider'
import CounterView from '../../UI/CounterView'
import ImageLoader from '../../UI/ImageLoader'
import ImageLook from '../../UI/ImageLook'
import CloseIt from '../../UI/CloseIt'
import MapPicker from '../../UI/MapPicker'
import DataPagination from '../../UI/DataPagination'
import Loading from '../../UI/Loading'
import {buildNotification} from '../../../store/effects'
import {getLectureM, manageLectureConspectM, updateLectureResourceM, publishLectureBuildingM} from '../../../graphql/pages/LecturePageQueries'
import {CollectionPropsType, MapView, TownType, Cords} from '../../../types/types'

const Lecture: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState<MapView>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [cords, setCords] = useState<Cords>(towns[0].cords)
    const [percent, setPercent] = useState<number>(INITIAL_PERCENT)
    const [respects, setRespects] = useState<number>(0)
    const [course, setCourse] = useState<number>(COURSE_LIMIT / 2)
    const [region, setRegion] = useState<string>(towns[0].title)
    const [image, setImage] = useState<string>('')

    const [lecture, setLecture] = useState<any | null>(null)
    const [conspects, setConspects] = useState<any[]>([])
    const [conspect, setConspect] = useState<any | null>(null)
    const [buildings, setBuildings] = useState<any[]>([])
    const [building, setBuilding] = useState<any | null>(null)    

    const centum = new Centum()
    const datus = new Datus()

    const [state, setState] = useState({
        text: '',
        category: RESOURCE_TYPES[0],
        dateUp: datus.timestamp('date'),
        resource: '',
        format: RESOURCE_TYPES[0],
        link: '',
        title: '',
        material: MATERIALS[0],
        century: CENTURIES[0]
    })

    const {text, category, dateUp, resource, format, link, title, material, century} = state

    const [getLecture] = useMutation(getLectureM, {
        onCompleted(data) {
            setLecture(data.getLecture)
        }
    })

    const [manageLectureConspect] = useMutation(manageLectureConspectM, {
        onCompleted(data) {
            buildNotification(data.manageLectureConspect)
        }
    })

    const [updateLectureResource] = useMutation(updateLectureResourceM, {
        onCompleted(data) {
            buildNotification(data.updateLectureResource)
        }
    })

    const [publishLectureBuilding] = useMutation(publishLectureBuildingM, {
        onCompleted(data) {
            buildNotification(data.publishLectureBuilding)
        }
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getLecture({
                variables: {
                    shortid: id
                }
            })
        }   
        
        centum.title('Lecture', PROJECT_TITLE)
    }, [context.account_id])

    useMemo(() => {
        if (lecture !== null) {
            setState({...state, resource: lecture.resource, format: lecture.format, link: lecture.link})
        }
    }, [lecture])

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
        setPercent(building === null ? 0 : INITIAL_PERCENT)

        if (building !== null) {
            setCords(building.cords)
        }
    }, [building])

    useMemo(() => {
        let result: number = centum.part(percent, RESPECT_LIMIT, 0)

        setRespects(result)
    }, [percent])

    const onView = () => {
        centum.go(`https://www.google.ru/maps/@${building.cords.lat},${building.cords.long},150m/data=!3m1!1e3`)
    }

    const onManageConspect = (option: string) => {
        manageLectureConspect({
            variables: {
                name: context.name, id, option, text, category, course, image, dateUp, respects, coll_id: conspect === null ? '' : conspect.shortid
            }
        })
    }

    const onUpdateResource = () => {
        updateLectureResource({
            variables: {
                name: context.name, id, resource, format, link
            }
        })
    }

    const onPublishBuilding = () => {
        publishLectureBuilding({
            variables: {
                name: context.name, id, title, material, century, cords
            }
        })
    }

    return (
        <>
            {lecture !== null &&
                <>
                    <h2>{lecture.title}</h2>
                    <h3 className='pale text article'>{lecture.description}</h3>

                    <h2>Current Resource Information</h2>
                    <div className='items small'>
                        <div className='item'>
                            <h4 className='pale'>Headline</h4>
                            <input value={resource} onChange={e => setState({...state, resource: e.target.value})} placeholder='Title' type='text' />
                        </div>
                        <div className='item'>
                            <h4 className='pale'>Link</h4>
                            <input value={link} onChange={e => setState({...state, link: e.target.value})} placeholder='URL' type='text' />
                        </div>
                    </div>
                    
                    <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                        {RESOURCE_TYPES.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <button onClick={onUpdateResource} className='light'>Update</button>

                    {conspect === null ? 
                            <>
                                <h2>New Conspect</h2>
                                <h4 className='pale'>Share information from university's lessons</h4>
                            
                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Headline...' />

                                <h4 className='pale'>Theme</h4>
                                <div className='items small'>
                                    {CONSPECT_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                                </div>

                                <CounterView num={course} setNum={setCourse} part={1} min={1} max={COURSE_LIMIT}>
                                    Course: {course}/{COURSE_LIMIT}
                                </CounterView>

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManageConspect('create')}>Publish</button>

                                <DataPagination initialItems={lecture.conspects} setItems={setConspects} label="Lecture's conspects:" />
                                <div className='items half'>
                                    {conspects.map(el => 
                                        <div onClick={() => setConspect(el)} className='item panel'>
                                            {centum.shorter(el.text)}
                                            <p className='pale'>{el.dateUp}</p>
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setConspect(null)} />

                                {conspect.image !== '' && <ImageLook src={conspect.image} min={24} max={24} className='photo gallery' alt='conspect photo' />}

                                <p>{conspect.text}</p>

                                <div className='items small'>   
                                    <h4 className='pale'>Theme: {conspect.category}</h4>
                                    <h4 className='pale'>Course: {conspect.course}</h4>
                                </div>

                                <p>Already <b>{conspect.respects}</b> respects!</p>

                                {context.name === conspect.name ?
                                        <button onClick={() => onManageConspect('delete')}>Delete</button>
                                    :
                                        <>
                                            <h4 className='pale'>Conspect's Rating</h4>

                                            <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />
                                            <button onClick={() => onManageConspect('respect')}>Respect</button>
                                        </>
                                }
                            </>
                    }

                    {building === null ? 
                            <>
                                <h2>New Building</h2>
                                <h4 className='pale'>Mark an example on map</h4>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Title' />

                                <div className='items small'>
                                    <select value={material} onChange={e => setState({...state, material: e.target.value})}>
                                        {MATERIALS.map(el => <option value={el}>{el}</option>)}
                                    </select>
                                    <select value={century} onChange={e => setState({...state, century: e.target.value})}>
                                        {CENTURIES.map(el => <option value={el}>{el}</option>)}
                                    </select>
                                </div>
                                
                                <h4 className='pale'>Where it located?</h4>
                                <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Nearest town' type='text' />

                                <button onClick={onPublishBuilding}>Create</button>

                                <DataPagination initialItems={lecture.buildings} setItems={setBuildings} label='Buildings on map:' />
                                <div className='items half'>
                                    {buildings.map(el => 
                                        <div onClick={() => setBuilding(el)} className='item card'>
                                            {centum.shorter(el.title, 2)}
                                            <p className='pale'>{el.century}</p>
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setBuilding(null)} />

                                <h2>{building.title}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Material: {building.material}</h4>
                                    <h4 className='pale'>Century: {building.century}</h4>
                                </div>

                                <button onClick={onView} className='light'>Look</button>
                            </>
                    }
                
                    <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='home' />
                        </Marker>

                        {buildings.map(el => 
                            <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                                <MapPicker type='picker' />
                            </Marker>
                        )}
                    </ReactMapGL>  
                </>
            }

            {lecture === null && <Loading label="Lecture's" />}
        </>
    )
}

export default Lecture