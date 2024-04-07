import React, {useState, useMemo, useEffect, useContext} from 'react'
import ReactMapGL, {Marker} from 'react-map-gl'
import {useQuery} from '@apollo/client'
import Centum from 'centum.js'
import {PROFILE_ROLES, SEARCH_PERCENT, PROJECT_TITLE, VIEW_CONFIG, token} from '../../../env/env'
import {gain} from '../../../store/storage'
import {Context} from '../../../context/WebProvider'
import NavigatorWrapper from '../../router/NavigatorWrapper'
import MapPicker from '../../UI/MapPicker'
import DataPagination from '../../UI/DataPagination'
import Loading from '../../UI/Loading'
import {getProfilesQ} from '../../../graphql/pages/ProfilePageQueries'
import {TownType, Cords, MapView} from '../../../types/types'

const Profiles: React.FC = () => {
    const {context} = useContext<any>(Context)
    const [view, setView] = useState<MapView>(VIEW_CONFIG)
    const [towns] = useState<TownType[]>(gain())

    const [profiles, setProfiles] = useState<any[] | null>(null)
    const [filtered, setFiltered] = useState<any[]>([])

    const [name, setName] = useState<string>('')
    const [role, setRole] = useState<string>(context.role)
    const [region, setRegion] = useState<string>(towns[0].title)
    const [cords, setCords] = useState<Cords>(towns[0].cords)

    const centum = new Centum()

    const {data, loading} = useQuery(getProfilesQ)

    useEffect(() => {
        if (data && context.account_id !== '') {
            setProfiles(data.getProfiles)
        }   
        
        centum.title('Profiles', PROJECT_TITLE)
    }, [data])

    useMemo(() => {
        if (region !== '') {
            let result = towns.find(el => centum.search(el.title, region, SEARCH_PERCENT, true)) 
    
            if (result !== undefined) {
                setRegion(result.title)
                setCords(result.cords)
            }           
        }
    }, [region])

    useMemo(() => {
        setView({...view, latitude: cords.lat, longitude: cords.long, zoom: 16})
    }, [cords])

    useMemo(() => {
        if (profiles !== null) {
            let result: any[] = profiles.filter(el => el.region === region)

            if (name !== '' ) {
                result = result.filter(el => centum.search(el.name, name, SEARCH_PERCENT))
            }

            result = result.filter(el => el.role === role)

            setFiltered(result)
        }
    }, [profiles, name, role, region])

    return (
        <> 
            <div className='items small'>
                <div className='item'>
                    <h4 className='pale'>Username</h4>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder='Name' type='text' /> 
                </div>
                <div className='item'>
                    <h4 className='pale'>Where it located?</h4>
                    <input value={region} onChange={e => setRegion(e.target.value)} placeholder='Nearest town' type='text' />
                </div>
            </div>

            <h4 className='pale'>Role</h4>
            <select value={role} onChange={e => setRole(e.target.value)}>
                {PROFILE_ROLES.map(el => <option value={el}>{el}</option>)}
            </select>

            <DataPagination initialItems={filtered} setItems={setFiltered} label='Users on map:' />

            {data &&
                <ReactMapGL onClick={e => setCords(centum.mapboxCords(e))} {...view} onViewportChange={(e: any) => setView(e)} mapboxApiAccessToken={token}>
                    <Marker latitude={cords.lat} longitude={cords.long}>
                        <MapPicker type='picker' />
                    </Marker>

                    {filtered.map(el => 
                        <Marker latitude={el.cords.lat} longitude={el.cords.long}>
                            <NavigatorWrapper id={el.account_id} isRedirect={true}>
                                {centum.shorter(el.name)}
                            </NavigatorWrapper>
                        </Marker>
                    )}
                </ReactMapGL>  
            }

            {loading && <Loading label='Profiles' />}
        </>
    )
}

export default Profiles