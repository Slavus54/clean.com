import {useState, useMemo} from 'react'
import {useMutation} from '@apollo/client'
import uniqid from 'uniqid'
import {INITIAL_PERCENT, DANGER_ICON} from '../../env/env'
import ImageLook from '../UI/ImageLook'
import {onUpdateProfile} from '../../store/storage'
import {buildNotification} from '../../store/effects'
import {updateProfilePasswordM} from '../../graphql/profile/ProfileQueries'
import {AccountPageComponentProps} from '../../types/types'

const ProfileSecurity = ({profile, context}: AccountPageComponentProps) => {
    const [isPass, setIsPass] = useState<boolean>(true)
    const [percent, setPercent] = useState<number>(INITIAL_PERCENT)
    const [state, setState] = useState({
        current_password: '',
        new_password: ''
    })

    const {current_password, new_password} = state

    const [updateProfilePassword] = useMutation(updateProfilePasswordM, {
        onCompleted(data) {
            buildNotification(data.updateProfilePassword, 'Profile')
            onUpdateProfile(null) 
        }
    })

    useMemo(() => {
        let length: number = Math.floor(percent / 10)
        let salt: string = profile.name.split(' ').join('').toLowerCase().slice(0, length)
        let flag: boolean = percent > (INITIAL_PERCENT / 2)

        setState({...state, new_password: uniqid(salt)})
        setIsPass(flag)
    }, [percent])

    const onUpdate = () => {
        updateProfilePassword({
            variables: {
                account_id: context.account_id, current_password, new_password
            }
        })
    }
    
    return (
        <>
            <h2>Protect your account</h2>
            <div className='items small'>
                <input value={current_password} onChange={e => setState({...state, current_password: e.target.value})} placeholder='Current password' type='text' />
                <input value={new_password} onChange={e => setState({...state, new_password: e.target.value})} placeholder='New password' type='text' />
            </div>

            <h4 className='pale'>Level of Defense: <b>{percent}%</b></h4>
            <input value={percent} onChange={e => setPercent(parseInt(e.target.value))} type='range' step={1} />
        
            {isPass && current_password !== '' ? 
                    <button onClick={onUpdate}>Update</button>
                :
                    <ImageLook src={DANGER_ICON} min={2} max={2} className='icon' />
            }
        </> 
    )
}

export default ProfileSecurity