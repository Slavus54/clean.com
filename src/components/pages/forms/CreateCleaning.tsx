import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {Datus, minutesMax} from 'datus.js'
import {CLEANING_TYPES, CLEANING_RESOURCES, LEVELS, PROJECT_THEMES, TIMER_PART, CLEANING_VOLUME_LIMIT, INITIAL_PERCENT, SEARCH_PERCENT, PAGINATION_LIMIT, PROJECT_TITLE, VIEW_CONFIG, token} from '../../../env/env'
import {gain} from '../../../store/storage'
import {Context} from '../../../context/WebProvider'
import CounterView from '../../UI/CounterView'
import MapPicker from '../../UI/MapPicker'
import FormPagination from '../../UI/FormPagination'
import {buildNotification} from '../../../store/effects'
import {createCleaningM} from '../../../graphql/pages/CleaningPageQueries'
import {TownType, MapView, Cords, CollectionPropsType} from '../../../types/types'

const CreateCleaning: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState<MapView>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [idx, setIdx] = useState<number>(0)

    const centum = new Centum()
    const datus = new Datus()

    const [dates] = useState<string[]>(datus.dates('day', PAGINATION_LIMIT))
    const [timer, setTimer] = useState<number>(minutesMax / 3)
    const [percent, setPercent] = useState<number>(INITIAL_PERCENT)
    const [isCentre, setIsCentre] = useState<boolean>(true)

    const [state, setState] = useState({
        title: '', 
        category: CLEANING_TYPES[0], 
        level: LEVELS[0], 
        theme: PROJECT_THEMES[0], 
        content: '',
        channel: '', 
        dateUp: dates[0], 
        time: '',
        region: towns[0].title, 
        cords: towns[0].cords,
        dots: [], 
        distance: 0, 
        resource: CLEANING_RESOURCES[0], 
        volume: 0
    })

    const {title, category, level, theme, content, channel, dateUp, time, region, cords, dots, distance, resource, volume} = state

    useEffect(() => {
        centum.title('New Cleaning', PROJECT_TITLE)
    }, [])

    const [createCleaning] = useMutation(createCleaningM, {
        optimisticResponse: true,
        onCompleted(data) {
            buildNotification(data.createCleaning)
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

    useEffect(() => {
        let result: string = datus.time(timer)

        setState({...state, time: result})
    }, [timer])

    useMemo(() => {
        let result: number = centum.part(percent, CLEANING_VOLUME_LIMIT, 0)

        setState({...state, volume: result})
    }, [percent])

    const onSetCords = (result: Cords) => {
        let latest = dots.length === 0 ? cords : dots[dots.length - 1]
        let size: number = centum.haversine([latest.lat, latest.long, result.lat, result.long], 0)

        if (isCentre) {
            setState({...state, cords: result})
        } else {
            setState({...state, dots: [...dots, result], distance: distance + size})
        }
    }

    const onCreate = () => {
        createCleaning({
            variables: {
                name: context.name, id, title, category, level, theme, content, channel, dateUp, time, region, cords, dots, distance, resource, volume
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <h4 className='pale'>Headline</h4>
                        <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Title' type='text' />
                
                        <select value={level} onChange={e => setState({...state, level: e.target.value})}>
                            {LEVELS.map(el => <option value={el}>{el}</option>)}
                        </select>

                        <h4 className='pale'>Area</h4>
                        <div className='items small'>
                            {CLEANING_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>

                        <h4 className='pale'>I'll provide another {resource}</h4>
                        <select value={resource} onChange={e => setState({...state, resource: e.target.value})}>
                            {CLEANING_RESOURCES.map(el => <option value={el}>{el}</option>)}
                        </select>

                        <h4 className='pale'>Garbage's volume: <b>{volume}</b> litres</h4>
                        <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />
                    </>,    
                    <>
                        <h4 className='pale'>Theme of Chat</h4>
                        <textarea value={content} onChange={e => setState({...state, content: e.target.value})} placeholder='Content..' />

                        <select value={theme} onChange={e => setState({...state, theme: e.target.value})}>
                            {PROJECT_THEMES.map(el => <option value={el}>{el}</option>)}
                        </select>

                        <h4 className='pale'>Connect via Telegram</h4>
                        <input value={channel} onChange={e => setState({...state, channel: e.target.value})} placeholder='URL of channel' type='text' />

                        <h4 className='pale'>Date and Time</h4>
                        <div className='items small'>
                            {dates.map(el => <div onClick={() => setState({...state, dateUp: el})} className={el === dateUp ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>

                        <CounterView num={timer} setNum={setTimer} part={TIMER_PART} min={minutesMax / 3} max={minutesMax}>
                            Start in {time}
                        </CounterView>
                    </>,         
                    <>
                        <h4 className='pale'>Where it located?</h4>
                        <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Nearest town' type='text' />

                        <div className='items small'>
                            <button onClick={() => setIsCentre(false)} className='light'>Coords: {isCentre ? 'Centre' : 'Waypoint'}</button>
                            <h5 className='pale'>Distance: <b>{distance}</b> meters</h5>
                        </div>                      
                                                
                        <ReactMapGL onClick={e => onSetCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker type='home' />
                            </Marker>

                            {dots.map(el => 
                                <Marker latitude={el.lat} longitude={el.long}>
                                    <MapPicker type='picker' />
                                </Marker>    
                            )}
                        </ReactMapGL>  

                        <button onClick={onCreate}>Create</button>
                    </>
                ]} 
            >
                <h2>New Cleaning</h2>
            </FormPagination>          
        </div>
    )
}

export default CreateCleaning