import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {Datus} from 'datus.js'
import {PROJECT_THEMES, CLEANING_RESOURCES, TRASH_TYPES, CLEANING_VOLUME_LIMIT, INITIAL_PERCENT, SEARCH_PERCENT, PROJECT_TITLE, VIEW_CONFIG, token} from '../../../env/env'
import {Context} from '../../../context/WebProvider'
import CleaningInformation from '../../pieces/CleaningInformation'
import ImageLoader from '../../UI/ImageLoader'
import ImageLook from '../../UI/ImageLook'
import CloseIt from '../../UI/CloseIt'
import MapPicker from '../../UI/MapPicker'
import DataPagination from '../../UI/DataPagination'
import Loading from '../../UI/Loading'
import {buildNotification} from '../../../store/effects'
import {getCleaningM, manageCleaningStatusM, updateCleaningRouteM, updateCleaningThemeM, manageCleaningPacketM} from '../../../graphql/pages/CleaningPageQueries'
import {CollectionPropsType, Cords, MapView} from '../../../types/types'

const Cleaning: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState<MapView>(VIEW_CONFIG)
    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [percent, setPercent] = useState<number>(INITIAL_PERCENT)
    const [distance, setDistance] = useState<number>(0)
    const [image, setImage] = useState<string>('')

    const [cleaning, setCleaning] = useState<any | null>(null)
    const [personality, setPersonality] = useState<any | null>(null)
    const [packets, setPackets] = useState<any[]>([])
    const [packet, setPacket] = useState<any | null>(null)

    const centum = new Centum()
    const datus = new Datus()

    const [state, setState] = useState({
        theme: PROJECT_THEMES[0],
        content: '',
        resource: CLEANING_RESOURCES[0],
        volume: 0,
        text: '',
        category: TRASH_TYPES[0],
        likes: 0,
        dateUp: datus.timestamp('date')
    })
  
    const {theme, content, resource, volume, text, category, likes, dateUp} = state

    const [getCleaning] = useMutation(getCleaningM, {
        onCompleted(data) {
            setCleaning(data.getCleaning)
        }
    })

    const [manageCleaningStatus] = useMutation(manageCleaningStatusM, {
        onCompleted(data) {
            buildNotification(data.manageCleaningStatus)
        }
    })

    const [updateCleaningRoute] = useMutation(updateCleaningRouteM, {
        onCompleted(data) {
            buildNotification(data.updateCleaningRoute)
        }
    })

    const [updateCleaningTheme] = useMutation(updateCleaningThemeM, {
        onCompleted(data) {
            buildNotification(data.updateCleaningTheme)
        }
    })

    const [manageCleaningPacket] = useMutation(manageCleaningPacketM, {
        onCompleted(data) {
            buildNotification(data.manageCleaningPacket)
        }
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getCleaning({
                variables: {
                    shortid: id
                }
            })
        }   
        
        centum.title('Cleanings', PROJECT_TITLE)
    }, [context.account_id])

    useMemo(() => {
        if (cleaning !== null) {
            let result = cleaning.members.find(el => centum.search(el.account_id, context.account_id, SEARCH_PERCENT))

            if (result !== undefined) {
                setPersonality(result)
            }

            setCords(cleaning.cords)
        }
    }, [cleaning])

    useMemo(() => {
        if (cleaning !== null) {
            let latest: Cords = cleaning.dots[cleaning.dots.length - 1]
            let result: number = centum.haversine([latest.lat, latest.long, cords.lat, cords.long], 0)
            
            setDistance(result)
        }
    
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    useMemo(() => {
        if (cleaning !== null && personality !== null) {
            setState({...state, theme: cleaning.theme, content: cleaning.content, resource: personality.resource})
        }
    }, [personality])

    useMemo(() => {
        let result: number = centum.part(percent, CLEANING_VOLUME_LIMIT)

        setState({...state, volume: result})
    }, [percent])

    useMemo(() => {
        setState({...state, likes: packet === null ? 0 : 1})
    }, [packet])

    const onManageStatus = (option: string) => {
        manageCleaningStatus({
            variables: {
                name: context.name, id, option, resource, volume
            }
        })
    }

    const onUpdateRoute = () => {
        updateCleaningRoute({
            variables: {
                name: context.name, id, cords, distance
            }
        })
    }

    const onUpdateTheme = () => {
        updateCleaningTheme({
            variables: {
                name: context.name, id, theme, content
            }
        })
    }

    const onManagePacket = (option: string) => {
        manageCleaningPacket({
            variables: {
                name: context.name, id, option, text, category, image, likes, dateUp, coll_id: packet === null ? '' : packet.shortid
            }
        })
    }

    return (
        <>  
            {cleaning !== null && personality === null &&
                <>
                    <h2>Welcome to {cleaning.title}</h2>

                    <CleaningInformation dateUp={cleaning.dateUp} time={cleaning.time} />

                    <h4 className='pale'>I'll provide another {resource}</h4>
                    <select value={resource} onChange={e => setState({...state, resource: e.target.value})}>
                        {CLEANING_RESOURCES.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <h4 className='pale'>Garbage's volume: <b>{volume}</b> litres</h4>
                    <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />

                    <button onClick={() => onManageStatus('join')}>Join</button>
                </> 
            }

            {cleaning !== null && personality !== null &&
                <>
                    <h2>{cleaning.title}</h2>
                    
                    <CleaningInformation dateUp={cleaning.dateUp} time={cleaning.time} />

                    <h4 className='pale'>I'll provide another {resource}</h4>
                    <select value={resource} onChange={e => setState({...state, resource: e.target.value})}>
                        {CLEANING_RESOURCES.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <button onClick={() => onManageStatus('update')} className='light'>Update</button>

                    <h2>There are <b>{cleaning.dots.length}</b> waypoints on map</h2>

                    <h4 className='pale'>Distance: <b>{cleaning.distance}</b> + <b>{distance}</b> meters</h4>

                    <button onClick={onUpdateRoute}>Change Route</button>

                    <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cleaning.cords.lat} longitude={cleaning.cords.long}>
                            <MapPicker type='home' />
                        </Marker>

                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>

                        {cleaning.dots.map((el, idx) => 
                            <Marker latitude={el.lat} longitude={el.long}>
                                {idx + 1}
                            </Marker>
                        )}
                    </ReactMapGL>  

                    <h4 className='pale'>Theme of Chat</h4>
                    <textarea value={content} onChange={e => setState({...state, content: e.target.value})} placeholder='Content..' />

                    <select value={theme} onChange={e => setState({...state, theme: e.target.value})}>
                        {PROJECT_THEMES.map(el => <option value={el}>{el}</option>)}
                    </select>

                    <button onClick={onUpdateTheme}>Update</button>

                    {packet === null ?
                            <>
                                <h2>New Packet</h2>
                                <h4 className='pale'>Share with already collected garbage</h4>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Describe it...' />

                                <h4 className='pale'>Type</h4>
                                <div className='items small'>
                                    {TRASH_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                                </div>

                                <ImageLoader setImage={setImage} />

                                <button onClick={() => onManagePacket('create')}>Publish</button>

                                <DataPagination initialItems={cleaning.packets} setItems={setPackets} label='List of packets:' />
                                <div className='items half'>
                                    {packets.map(el => 
                                        <div onClick={() => setPacket(el)} className='item panel'>
                                            {centum.shorter(el.text)}
                                            <p className='pale'>{el.dateUp}</p>
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setPacket(null)} />
                                
                                {packet.image !== '' && <ImageLook src={packet.image} className='photo' alt='packet photo' />}

                                <h2>{packet.text} ({packet.dateUp})</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Type: {packet.category}</h4>
                                    <h4 className='pale'><b>{packet.likes}</b> likes</h4>
                                </div>

                                {context.name === packet.name ?
                                        <button onClick={() => onManagePacket('delete')}>Delete</button>
                                    :
                                        <button onClick={() => onManagePacket('like')}>Like</button>
                                }
                            </>
                    }

                    {context.name === cleaning.name ?
                            <h4 className='pale'>There are {cleaning.members.length - 1} members</h4>
                        :
                            <button onClick={() => onManageStatus('exit')} className='light'>Exit</button>
                    }
                </>           
            }

            {cleaning === null && <Loading label="Cleaning's" />}
        </>
    )
}

export default Cleaning