import {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {PROFILE_ROLES, ACCOUNT_STATUSES, SEARCH_PERCENT, PROJECT_TITLE, VIEW_CONFIG, token} from '../../../env/env'
import {gain} from '../../../store/storage'
import {getNotifyPermission} from '../../../store/effects'
import {Context} from '../../../context/WebProvider'
import ImageLoader from '../../UI/ImageLoader'
import MapPicker from '../../UI/MapPicker'
import FormPagination from '../../UI/FormPagination'
import {createProfileM} from '../../../graphql/profile/ProfileQueries'
import {TownType, MapView} from '../../../types/types'

const Register = () => {
    const {change_context} = useContext<any>(Context)
    const [view, setView] = useState<MapView>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())
    const [image, setImage] = useState<string>('')
    const [idx, setIdx] = useState<number>(0)

    const [state, setState] = useState({
        name: '', 
        password: '', 
        telegram: '',
        role: PROFILE_ROLES[0], 
        status: ACCOUNT_STATUSES[0],
        region: towns[0].title, 
        cords: towns[0].cords
    })

    const centum = new Centum()

    const {name, password, telegram, role, status, region, cords} = state

    useEffect(() => {
        centum.title('Create an Account', PROJECT_TITLE)
    }, [])

    const [createProfile] = useMutation(createProfileM, {
        onCompleted(data) {
            change_context('update', data.createProfile, 1)
            getNotifyPermission()
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
        createProfile({
            variables: {
                name, password, telegram, role, status, region, cords, image
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <h4 className='pale'>Name</h4>
                        <input value={name} onChange={e => setState({...state, name: e.target.value})} placeholder='Fullname' type='text' />
                
                        <h4 className='pale'>Security</h4>
                        <input value={password} onChange={e => setState({...state, password: e.target.value})} placeholder='Password' type='text' />  
                        <ImageLoader setImage={setImage} />
                
                    </>,
                    <>
                        <h4 className='pale'>Connect to Telegram</h4>
                        <input value={telegram} onChange={e => setState({...state, telegram: e.target.value})} placeholder='Tag of profile' type='text' /> 

                        <h4 className='pale'>Role and Status</h4>
                        <div className='items small'>
                            <select value={role} onChange={e => setState({...state, role: e.target.value})}>
                                {PROFILE_ROLES.map(el => <option value={el}>{el}</option>)}
                            </select>
                            <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                                {ACCOUNT_STATUSES.map(el => <option value={el}>{el}</option>)}
                            </select>
                        </div> 
                    </>,
                    <>
                        <h4 className='pale'>Where are you?</h4>
                        <input value={region} onChange={e => setState({...state, region: e.target.value})} placeholder='Nearest town' type='text' />
                        <ReactMapGL onClick={e => setState({...state, cords: centum.mapboxCords(e)})} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                            <Marker latitude={cords.lat} longitude={cords.long}>
                                <MapPicker type='picker' />
                            </Marker>
                        </ReactMapGL>  
                        <button onClick={onCreate}>Create</button>
                    </>
                ]} 
            >
                <h2>New Account</h2>
            </FormPagination>          
        </div>
    )
}

export default Register