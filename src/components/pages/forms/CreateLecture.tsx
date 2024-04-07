import React, {useState, useMemo, useEffect, useContext} from 'react'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {PROVINCES, ARCHITECTURES, RESOURCE_TYPES, PROJECT_TITLE} from '../../../env/env'
import {Context} from '../../../context/WebProvider'
import FormPagination from '../../UI/FormPagination'
import {buildNotification} from '../../../store/effects'
import {createLectureM} from '../../../graphql/pages/LecturePageQueries'
import {CollectionPropsType} from '../../../types/types'

const CreateLecture: React.FC<CollectionPropsType> = ({params: {id}}) => {
    const {context} = useContext<any>(Context)
    const [idx, setIdx] = useState<number>(0)

    const centum = new Centum()

    const [state, setState] = useState({
        title: '', 
        description: '', 
        province: PROVINCES[0], 
        architecture: ARCHITECTURES[0], 
        resource: '', 
        format: RESOURCE_TYPES[0], 
        link: ''
    })

    const {title, description, province, architecture, resource, format, link} = state

    useEffect(() => {
        centum.title('New Lecture', PROJECT_TITLE)
    }, [])

    const [createLecture] = useMutation(createLectureM, {
        optimisticResponse: true,
        onCompleted(data) {
            buildNotification(data.createLecture)
        }
    })

    const onCreate = () => {
        createLecture({
            variables: {
                name: context.name, id, title, description, province, architecture, resource, format, link
            }
        })
    }

    return (
        <div className='main'>          
            <FormPagination num={idx} setNum={setIdx} items={[
                    <>
                        <h4 className='pale'>Headline</h4>
                        <input value={title} onChange={e => setState({...state, title: e.target.value})} placeholder='Title' type='text' />

                        <h4 className='pale'>Province & Style</h4>
                        <div className='items small'>
                            {PROVINCES.map(el => <div onClick={() => setState({...state, province: el})} className={el === province ? 'item label active' : 'item label'}>{el}</div>)}
                        </div>

                        <select value={architecture} onChange={e => setState({...state, architecture: e.target.value})}>
                            {ARCHITECTURES.map(el => <option value={el}>{el}</option>)}
                        </select>

                        <textarea value={description} onChange={e => setState({...state, description: e.target.value})} placeholder='Description here...' />                        
                    </>,             
                    <>
                        <h4 className='pale'>Current Resource Information</h4>
                        <div className='items small'>
                            <div className='item'>
                                <h4 className='pale'>Headline</h4>
                                <input value={resource} onChange={e => setState({...state, resource: e.target.value})} placeholder='Title' type='text' />
                            </div>
                            <div className='item'>
                                <h4 className='pale'>Link</h4>
                                <input value={link} onChange={e => setState({...state, link: e.target.value})} placeholder='URL' type='text' />
                            </div>
                        </div>
                        
                        <select value={format} onChange={e => setState({...state, format: e.target.value})}>
                            {RESOURCE_TYPES.map(el => <option value={el}>{el}</option>)}
                        </select>

                        <button onClick={onCreate}>Create</button>
                    </>
                ]} 
            >
                <h2>New Lecture</h2>
            </FormPagination>          
        </div>
    )
}

export default CreateLecture