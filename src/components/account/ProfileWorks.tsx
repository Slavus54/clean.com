import {useState} from 'react'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {Datus} from 'datus.js'
import {WORK_TYPES, WORK_FORMATS} from '../../env/env'
import ImageLoader from '../UI/ImageLoader'
import ImageLook from '../UI/ImageLook'
import CloseIt from '../UI/CloseIt'
import DataPagination from '../UI/DataPagination'
import {onUpdateProfile} from '../../store/storage'
import {buildNotification} from '../../store/effects'
import {manageProfileWorkM} from '../../graphql/profile/ProfileQueries'
import {AccountPageComponentProps} from '../../types/types'

const ProfileWorks = ({profile, context}: AccountPageComponentProps) => {
    const [works, setWorks] = useState<any[] | null>([])
    const [work, setWork] = useState<any | null>(null)
    const [respects] = useState<number>(0)
    const [image, setImage] = useState<string>('')

    const centum = new Centum()
    const datus = new Datus()

    const [state, setState] = useState({
        title: '', 
        description: '', 
        category: WORK_TYPES[0], 
        format: WORK_FORMATS[0],
        dateUp: datus.timestamp('date')
    })

    const {title, description, category, format, dateUp} = state

    const [manageProfileWork] = useMutation(manageProfileWorkM, {
        onCompleted(data) {
            buildNotification(data.manageProfileWork, 'Profile')
            onUpdateProfile(null) 
        }
    })

    const onManageWork = (option: string) => {
        manageProfileWork({
            variables: {
                account_id: context.account_id, option, title, description, category, format, image, dateUp, respects, coll_id: work === null ? '' : work.shortid
            }
        })
    }
    
    return (
        <>
            {work === null ?
                    <>
                        <h2>New Work</h2>

                        <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Title' type='text' />

                        <textarea value={description} onChange={e => setState({...state, description: e.target.value})} placeholder='Describe it...' />

                        <h4 className='pale'>Type</h4>
                        <div className='items small'>
                            {WORK_TYPES.map(el => <div onClick={() => setState({...state, category: el})} className={el === category ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>

                        <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                            {WORK_FORMATS.map(el => <option value={el}>{el}</option>)}
                        </select>

                        <ImageLoader setImage={setImage} />

                        <button onClick={() => onManageWork('create')}>Create</button>

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

                        <h2><b>{work.title}</b></h2>
                        <h3>{work.description}</h3>

                        <div className='items small'>
                            <h4 className='pale'>Type: {work.category}</h4>
                            <h4 className='pale'>Format: {work.format}</h4>
                        </div>

                        <h3 className='left'>{work.dateUp}</h3>

                        <button onClick={() => onManageWork('delete')}>Delete</button>
                    </>
            }
        </> 
    )
}

export default ProfileWorks