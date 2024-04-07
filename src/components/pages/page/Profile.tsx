import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import ProfilePhoto from '../../../assets/profile_photo.jpg'
import {RESPECT_LIMIT, INITIAL_PERCENT, TG_ICON, PROJECT_TITLE, VIEW_CONFIG, token} from '../../../env/env'
import {Context} from '../../../context/WebProvider'
import MapPicker from '../../UI/MapPicker'
import DataPagination from '../../UI/DataPagination'
import ImageLook from '../../UI/ImageLook'
import Loading from '../../UI/Loading'
import CloseIt from '../../UI/CloseIt'
import {buildNotification} from '../../../store/effects'
import {getProfileM} from '../../../graphql/pages/ProfilePageQueries'
import {manageProfileWorkM} from '../../../graphql/profile/ProfileQueries'
import {CollectionPropsType, Cords, MapView} from '../../../types/types'

const Profile: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState<MapView>(VIEW_CONFIG)

    const [cords, setCords] = useState<Cords>({lat: 0, long: 0})
    const [respects, setRespects] = useState<number>(0)
    const [percent, setPercent] = useState<number>(INITIAL_PERCENT)
    const [image, setImage] = useState<string>('')

    const [profile, setProfile] = useState<any | null>(null)
    const [works, setWorks] = useState<any[]>([])
    const [work, setWork] = useState<any | null>(null)
  
    const centum = new Centum()

    const [getProfile] = useMutation(getProfileM, {
        onCompleted(data) {
            setProfile(data.getProfile)
        }
    })

    const [manageProfileWork] = useMutation(manageProfileWorkM, {
        onCompleted(data) {
            buildNotification(data.manageProfileWork)
        }
    })

    useEffect(() => {
        if (context.account_id !== '') {
            getProfile({
                variables: {
                    account_id: id
                }
            })
        }   
        
        centum.title('Profile', PROJECT_TITLE)
    }, [context.account_id])

    useMemo(() => {
        if (profile !== null) {
            setCords(profile.cords) 
            
            setImage(profile.image === '' ? ProfilePhoto : profile.image)
        }
    }, [profile])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    useMemo(() => {
        setPercent(INITIAL_PERCENT)
    }, [work])

    useMemo(() => {
        let result: number = centum.part(percent, RESPECT_LIMIT, 0)

        setRespects(result)
    }, [percent])

    const onView = () => {
        centum.go(profile.telegram, 'telegram')
    }

    const onRespectWork = () => {
        manageProfileWork({
            variables: {
                account_id: context.account_id, option: 'respect', title: '', description: '', category: '', format: '', image: '', dateUp: '', respects, coll_id: work === null ? '' : work.shortid
            }
        })
    }

    return (
        <> 
            {profile !== null && profile.account_id !== context.account_id &&
                <>
                    <ImageLook src={image} className='photo' alt='account photo' />
                    <h1>{profile.name}</h1>

                    <ImageLook onClick={onView} src={TG_ICON} min={2} max={2} className='icon' />

                    <div className='items small'>
                        <h4 className='pale'>Role: {profile.role}</h4>
                        <h4 className='pale'>Status: {profile.status}</h4>
                    </div>

                    {work === null ? 
                            <>
                                <DataPagination initialItems={profile.works} setItems={setWorks} label='List of works:' />
                                <div className='items half'>
                                    {works.map(el => 
                                        <div onClick={() => setWork(el)} className='item panel'>
                                            {centum.shorter(el.title)}
                                            <p className='pale'>{el.dateUp}</p>
                                        </div>    
                                    )}
                                </div>
                            </>
                        :
                            <>
                                <CloseIt onClick={() => setWork(null)} />

                                {work.image !== '' && <ImageLook src={work.image} className='photo' alt="work's photo" />}

                                <h2><b>{work.title} ({work.format})</b></h2>
                                <h3>{work.description}</h3>

                                <div className='items small'>
                                    <h4 className='pale'>Type: {work.category}</h4>
                                    <h4 className='pale'><b>{work.respects + respects}</b> respects</h4>
                                </div>

                                <h3 className='left'>Published {work.dateUp}</h3>

                                <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />

                                <button onClick={onRespectWork}>Respect</button>
                            </>
                    }

                    <ReactMapGL {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                        <Marker latitude={cords.lat} longitude={cords.long}>
                            <MapPicker type='picker' />
                        </Marker>
                    </ReactMapGL> 
                </>
            }

            {profile === null && <Loading label="Profile's" />}
        </>
    )
}

export default Profile