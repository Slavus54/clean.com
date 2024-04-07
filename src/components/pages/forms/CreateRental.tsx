import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {Datus} from 'datus.js'
import {ESTATE_TYPES, LOCALITIES, ROOMS, SQUARE_LIMIT, RENTAL_YEAR_LIMIT, RENTAL_DEFAULT_COST, INITIAL_PERCENT, SEARCH_PERCENT, PROJECT_TITLE, VIEW_CONFIG, token} from '../../../env/env'
import {gain} from '../../../store/storage'
import {Context} from '../../../context/WebProvider'
import MapPicker from '../../UI/MapPicker'
import CounterView from '../../UI/CounterView'
import FormPagination from '../../UI/FormPagination'
import {buildNotification} from '../../../store/effects'
import {createRentalM} from '../../../graphql/pages/RentalPageQueries'
import {TownType, MapView, CollectionPropsType} from '../../../types/types'

const CreateRental: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState<MapView>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [percent, setPercent] = useState<number>(INITIAL_PERCENT)
    const [counter, setCounter] = useState<number>(0)
    const [idx, setIdx] = useState<number>(0)

    const centum = new Centum()
    const datus = new Datus()

    const [state, setState] = useState({
        title: '', 
        category: ESTATE_TYPES[0], 
        format: LOCALITIES[0], 
        rooms: ROOMS[0], 
        square: 0,
        region: towns[0].title, 
        cords: towns[0].cords,
        year: datus.year(RENTAL_YEAR_LIMIT - counter)?.year, 
        cost: RENTAL_DEFAULT_COST
    })

    const {title, category, format, rooms, square, region, cords, year, cost} = state

    useEffect(() => {
        centum.title('New Rental', PROJECT_TITLE)
    }, [])

    const [createRental] = useMutation(createRentalM, {
        optimisticResponse: true,
        onCompleted(data) {
            buildNotification(data.createRental)
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

    useMemo(() => {
        let result: number = datus.year(RENTAL_YEAR_LIMIT - counter)?.year

        setState({...state, year: result})
    }, [counter])

    useEffect(() => {
        let result: number = centum.part(percent, SQUARE_LIMIT, 0)

        setState({...state, square: result})
    }, [percent])

    const onCreate = () => {
        createRental({
            variables: {
                name: context.name, id, title, category, format, rooms, square, region, cords, year, cost
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
                            {ESTATE_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>
                        
                        <CounterView num={counter} setNum={setCounter} part={1} min={0} max={RENTAL_YEAR_LIMIT}>
                            Latest Rent: {year}
                        </CounterView>

                        <h4 className='pale'>Place and Rooms</h4>
                        <div className='items small'>
                            <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                                {LOCALITIES.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={rooms} onChange={e => setState({...state, rooms: parseInt(e.target.value)})}>
                                {ROOMS.map(el => <option value={el}>{el}</option>)}
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
                                <h4 className='pale'>How much it cost?</h4>
                                <input value={cost} onChange={e => setState({...state, cost: parseInt(e.target.value)})} placeholder='Cost' type='text' />
                            </div>
                        </div>

                        <h4 className='pale'>Square: <b>{square}</b> m²</h4>
                        <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />
                                                
                        <ReactMapGL onClick={e => setState({...state, cords: centum.mapboxCords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker type='picker' />
                            </Marker>
                        </ReactMapGL>  

                        {isNaN(cost) ?
                                <button onClick={() => setState({...state, cost: RENTAL_DEFAULT_COST})}>Reset</button> 
                            :
                                <button onClick={onCreate}>Create</button>
                        }
                    </>
                ]} 
            >
                <h2>New Rental</h2>
            </FormPagination>          
        </div>
    )
}

export default CreateRental