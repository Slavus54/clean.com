import PersonalProfileInfo from './PersonalProfileInfo'
import GeoProfileInfo from './GeoProfileInfo'
import ProfileSecurity from './ProfileSecurity'
import ProfileWorks from './ProfileWorks'
import ProfileComponents from './ProfileComponents'

import {AccountPageComponentType} from '../../types/types'

const components: AccountPageComponentType[] = [
    {
        title: 'Account',
        icon: './profile/account.png',
        component: PersonalProfileInfo
    },
    {
        title: 'Location',
        icon: './profile/geo.png',
        component: GeoProfileInfo
    },
    {
        title: 'Security',
        icon: './profile/security.png',
        component: ProfileSecurity
    },
    {
        title: 'Works',
        icon: './profile/works.png',
        component: ProfileWorks
    },
    {
        title: 'Collections',
        icon: './profile/collections.png',
        component: ProfileComponents
    }
]

export const default_component = components[0]

export default components