import {useState, useMemo, useContext} from 'react'
import {useMutation} from '@apollo/client'
import Centum from 'centum.js'
import {Datus} from 'datus.js'
import {onUpdateName, onUpdateProfile, onGetProfile} from '../../../store/storage'
import {PROJECT_TITLE} from '../../../env/env'
import {Context} from '../../../context/WebProvider'
import Loading from '../../UI/Loading'
import FormPagination from '../../UI/FormPagination'
import ImageLook from '../../UI/ImageLook'
import Exit from '../../UI/Exit'
import {getProfileM} from '../../../graphql/pages/ProfilePageQueries'
import components, {default_component} from '../../account/index'

const AccountPage = () => {
    const centum = new Centum()
    const datus = new Datus()

    const {change_context, context} = useContext(Context)
    const [profile, setProfile] = useState(null)
    const [page, setPage] = useState(default_component)
    const [pageIndex, setPageIndex] = useState<number>(0)   
    
    const [getProfile] = useMutation(getProfileM, {
        onCompleted(data) {
            let info = data.getProfile

            if (info !== null) {
                onUpdateProfile(info)
                setProfile(info)
            } else {
                change_context('update', null)
                window.location.reload()
            }
        }
    })
    
    useMemo(() => {
        if (context.account_id !== '') {
            let data = onGetProfile()
       
            if (data !== null) {
                setProfile(data)
            } else {
                getProfile({
                    variables: {
                        account_id: context.account_id
                    }
                })
            }

            onUpdateName(context.name, datus.timestamp('time'))

            centum.title('Home', PROJECT_TITLE)
        }
    }, [context.account_id])
    
    useMemo(() => {
        let result = components[pageIndex]

        setPage(result)
    }, [pageIndex])
    
    return (
        <>
            {profile !== null && 
                <>
                    <FormPagination num={pageIndex} setNum={setPageIndex} items={components.map(el => el.component)}>
                        {page !== null && 
                            <div className='item'>
                                <ImageLook src={page.icon} min={2} max={2} className='icon' />
                                <h4 className='form-title'>{page.title}</h4>
                            </div>
                        }
                    </FormPagination>

                    <div className='main'>
                        {page !== null && <page.component profile={profile} context={context} />}             
                    </div>

                    <Exit />
                </>
            }

            {profile === null && <Loading label="Profile's" />}
        </>
    )
}

export default AccountPage