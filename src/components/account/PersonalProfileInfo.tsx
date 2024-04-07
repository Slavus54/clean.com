import {useState} from 'react'
import {useMutation} from '@apollo/client'
import {onGetName, onUpdateProfile} from '../../store/storage'
import ProfilePhoto from '../../assets/profile_photo.jpg'
import {PROFILE_ROLES, ACCOUNT_STATUSES} from '../../env/env'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import {buildNotification} from '../../store/effects'
import {updateProfilePersonalInfoM} from '../../graphql/profile/ProfileQueries'
import {AccountPageComponentProps} from '../../types/types'

const PersonalProfileInfo = ({profile, context}: AccountPageComponentProps) => {
    const [image, setImage] = useState(profile.image === '' ? ProfilePhoto : profile.image)
    const [info] = useState<any>(onGetName())

    const [state, setState] = useState({
        role: profile.role, 
        status: profile.status
    })

    const {role, status} = state

    const [updateProfilePersonalInfo] = useMutation(updateProfilePersonalInfoM, {
        onCompleted(data) {
            buildNotification(data.updateProfilePersonalInfo, 'Profile')
            onUpdateProfile(null) 
        }
    })

    const onUpdate = () => {
        updateProfilePersonalInfo({
            variables: {
                account_id: context.account_id, role, status, image
            }
        })
    }
 
    return (
        <>
            <ImageLook src={image} max={17} className='photo' alt='account photo' />
            <h3>{profile.name}</h3>
            <p className='pale'>Latest visit in {info.timestamp}</p>

            <div className='items small'>
                <select value={role} onChange={e => setState({...state, role: e.target.value})}>
                    {PROFILE_ROLES.map(el => <option value={el}>{el}</option>)}
                </select>
                <select value={status} onChange={e => setState({...state, status: e.target.value})}>
                    {ACCOUNT_STATUSES.map(el => <option value={el}>{el}</option>)}
                </select>
            </div> 
       
            <ImageLoader setImage={setImage} />

            <button onClick={onUpdate}>Update</button> 
        </> 
    )
}

export default PersonalProfileInfo