import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {Datus} from 'datus.js'
import {QUESTION_TYPES, PHOTO_FORMATS, RENTAL_DEFAULT_COST, RENTAL_YEAR_LIMIT, INITIAL_PERCENT, SEARCH_PERCENT, PROJECT_TITLE, VIEW_CONFIG, token} from '../../../env/env'
import {Context} from '../../../context/WebProvider'
import MapPicker from '../../UI/MapPicker'
import CounterView from '../../UI/CounterView'
import ImageLoader from '../../UI/ImageLoader'
import ImageLook from '../../UI/ImageLook'
import CloseIt from '../../UI/CloseIt'
import DataPagination from '../../UI/DataPagination'
import Loading from '../../UI/Loading'
import {buildNotification} from '../../../store/effects'
import {getRentalM, manageRentalQuestionM, updateRentalInformationM, publishRentalPhotoM} from '../../../graphql/pages/RentalPageQueries'
import {CollectionPropsType, Cords, MapView} from '../../../types/types'

const Rental: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState<MapView>(VIEW_CONFIG)
    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [isAuthor, setIsAuthor] = useState<boolean>(false)
    const [cost, setCost] = useState<number>(RENTAL_DEFAULT_COST)
    const [counter, setCounter] = useState<number>(0)
    const [image, setImage] = useState<string>('')

    const [rental, setRental] = useState<any | null>(null)
    const [question, setQuestion] = useState<any | null>(null)
    const [photos, setPhotos] = useState<any[]>([])
    const [photo, setPhoto] = useState<any | null>(null)

    const centum = new Centum()
    const datus = new Datus()

    const [state, setState] = useState({
        year: datus.year(RENTAL_YEAR_LIMIT - counter)?.year,
        text: '',
        category: QUESTION_TYPES[0],
        reply: '',
        answered: false,
        likes: 0,
        title: '',
        format: PHOTO_FORMATS[0],
        dateUp: datus.timestamp('date')
    })

    const {year, text, category, reply, answered, likes, title, format, dateUp} = state

    const [getRental] = useMutation(getRentalM, {
        onCompleted(data) {
            setRental(data.getRental)
        }
    })

    const [manageRentalQuestion] = useMutation(manageRentalQuestionM, {
        onCompleted(data) {
            buildNotification(data.manageRentalQuestion)
        }
    })

    const [updateRentalInformation] = useMutation(updateRentalInformationM, {
        onCompleted(data) {
            buildNotification(data.updateRentalInformation)
        }
    })

    const [publishRentalPhoto] = useMutation(publishRentalPhotoM, {
        onCompleted(data) {
            buildNotification(data.publishRentalPhoto)
        }
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getRental({
                variables: {
                    shortid: id
                }
            })
        }   
        
        centum.title('Rental', PROJECT_TITLE)
    }, [context.account_id])

    useMemo(() => {
        if (rental !== null) {
            let difference: number = datus.year() - rental.year
            
            setCounter(difference)
            setCords(rental.cords)
            setCost(rental.cost)    
            
            setIsAuthor(context.name === rental.name)
        }
    }, [rental])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    useMemo(() => {
        let result: number = datus.year(RENTAL_YEAR_LIMIT - counter)?.year

        setState({...state, year: result})
    }, [counter])

    useMemo(() => {
        let flag: boolean = question === null

        setState({...state, likes: flag ? 0 : 1, answered: !flag, reply: ''})
    }, [question])

    const onQuestion = () => {
        if (question === null) {
            let result = centum.random(rental.questions)?.value
       
            if (result !== undefined) {
                setQuestion(result)
            }
        }
    }

    const onManageQuestion = (option: string) => {
        manageRentalQuestion({
            variables: {
                name: context.name, id, option, text, category, reply, answered, likes, coll_id: question === null ? '' : question.shortid
            }
        })
    }

    const onUpdateInfo = () => {
        updateRentalInformation({
            variables: {
                name: context.name, id, year, cost
            }
        })
    }

    const onPublishPhoto = () => {
        publishRentalPhoto({
            variables: {
                name: context.name, id, title, format, image, dateUp
            }
        })
    }

    return (
        <>
            {rental !== null &&
                <>
                    <h1>{rental.title}</h1>
                    
                    <div className='items small'>
                        <h4 className='pale'>Type: {rental.castegory}</h4>  
                        <h4 className='pale'>Square: <b>{rental.square}m²</b></h4>
                    </div> 

                    {isAuthor ? 
                            <>
                                <h2>New Photo</h2>
                                <h4 className='pale'>Share own estate's image</h4>

                                <textarea value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Describe it...' />

                                <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                                    {PHOTO_FORMATS.map(el => <option value={el}>{el}</option>)}
                                </select>

                                <ImageLoader setImage={setImage} />

                                <button onClick={onPublishPhoto}>Publish</button>

                                <h4 className='pale'>How much it cost?</h4>
                                <input value={cost} onChange={e => setCost(parseInt(e.target.value))} placeholder='Cost' type='text' />

                                <CounterView num={counter} setNum={setCounter} part={1} min={0} max={RENTAL_YEAR_LIMIT}>
                                    Latest Rent: {year}
                                </CounterView>

                                {isNaN(cost) ? 
                                        <button onClick={() => setCost(RENTAL_DEFAULT_COST)}>Reset</button>
                                    :
                                        <button onClick={onUpdateInfo}>Update</button>
                                }
                            </>
                        :
                            <>
                                <h2>New Question</h2>
                                <h4>Try to gain reply from {rental.name}</h4>

                                <textarea value={text} onChange={e => setState({...state, text: e.target.value})} placeholder='Content...' />

                                <h4 className='pale'>Theme</h4>
                                <div className='items small'>
                                    {QUESTION_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                                </div>

                                <button onClick={() => onManageQuestion('create')}>Ask</button>
                            </>
                    }
                    
                    <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                    </ReactMapGL> 

                    {question === null ? 
                            <>
                                <h4 className='pale'>There are {rental.questions.length} questions</h4>
                                <button onClick={onQuestion} className='light'>Generate</button>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setQuestion(null)} />

                                <p>{question.text}?</p>

                                {isAuthor && !question.answered &&
                                    <>
                                        <textarea value={reply} onChange={e => setState({...state, reply: e.target.value})} placeholder='Answer...' />
                                    
                                        <button onClick={() => onManageQuestion('reply')}>Reply</button>
                                    </>
                                }

                                <div className='items small'>       
                                    <h4 className='pale'>Theme: {question.category}</h4>
                                    <h4 className='pale'><b>{question.likes}</b> likes</h4>
                                </div> 

                                {context.name === question.name ? 
                                        <button onClick={() => onManageQuestion('delete')}>Delete</button>
                                    :
                                        <button onClick={() => onManageQuestion('like')}>Like</button>
                                }
                            </>
                    }

                    {photo === null ? 
                            <>
                                <DataPagination initialItems={rental.photos} setItems={setPhotos} label='Gallery:' />
                                <div className='items half'>
                                    {photos.map(el => 
                                        <div onClick={() => setPhoto(el)} className='item panel'>
                                            {centum.shorter(el.title)}
                                            <p className='pale'>{el.dateUp}</p>
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setPhoto(null)} />

                                {photo.image !== '' && <ImageLook src={photo.image} className='photo' alt='rental photo' />}

                                <h2>{photo.title}</h2>

                                <div className='items small'>
                                    <h4 className='pale'>Type: {photo.format}</h4>
                                    <h4 className='pale'>Published {photo.dateUp}</h4>
                                </div>
                            </>
                    }
                </>
            }

            {rental === null && <Loading label="Rental's" />}
        </>
    )
}

export default Rental