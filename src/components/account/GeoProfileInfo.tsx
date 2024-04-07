import {useState, useMemo, useEffect} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {SEARCH_PERCENT, VIEW_CONFIG, token} from '../../env/env'
import {gain, onUpdateProfile} from '../../store/storage'
import MapPicker from '../UI/MapPicker'
import {buildNotification} from '../../store/effects'
import {updateProfileGeoInfoM} from '../../graphql/profile/ProfileQueries'
import {AccountPageComponentProps, Cords, TownType} from '../../types/types'

const GeoProfileInfo = ({profile, context} : AccountPageComponentProps) => {
    const [view, setView] = useState(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [cords, setCords] = useState<Cords>(profile.cords)
    const [state, setState] = useState({
        region: profile.region
    })

    const centum = new Centum()

    const {region} = state

    const [updateProfileGeoInfo] = useMutation(updateProfileGeoInfoM, {
        onCompleted(data) {
            buildNotification(data.updateProfileGeoInfo, 'Profile')   
            onUpdateProfile(null) 
        }
    })


    useEffect(() => {
        if (region !== '' && region !== profile.region) {
            let result = towns.find(el => centum.search(el.title, region, SEARCH_PERCENT, true))

            if (result !== undefined) {
                setState({...state, region: result.title})
                setCords(result.cords)
            }
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 17})
    }, [cords])

    const onReset = () => {
        setCords({lat: profile.cords.lat, long: profile.cords.long})
    }

    const onUpdate = () => {
        updateProfileGeoInfo({
            variables: {
                account_id: context.account_id, region, cords
            }
        })
    }

    return (
        <>         
            <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Nearest town' type='text' />
            
            <div className='items small'>
                <button onClick={onReset}>Reset</button>
                <button onClick={onUpdate}>Update</button>
            </div>
            
            <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                <Marker latitude={cords.lat} longitude={cords.long}>
                    <MapPicker type='picker' />
                </Marker>     
            </ReactMapGL>     
        </> 
    )
}

export default GeoProfileInfo