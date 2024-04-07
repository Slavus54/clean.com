import {gql} from '@apollo/client'

export const updateProfilePersonalInfoM = gql`
    mutation updateProfilePersonalInfo($account_id: String!, $role: String!, $status: String!, $image: String!) {
        updateProfilePersonalInfo(account_id: $account_id, role: $role, status: $status, image: $image) 
    }
`

export const updateProfileGeoInfoM = gql`
    mutation updateProfileGeoInfo($account_id: String!, $region: String!, $cords: ICord!) {
        updateProfileGeoInfo(account_id: $account_id, region: $region, cords: $cords) 
    }
`

export const updateProfilePasswordM = gql`
    mutation updateProfilePassword($account_id: String!, $current_password: String!, $new_password: String!) {
        updateProfilePassword(account_id: $account_id, current_password: $current_password, new_password: $new_password)
    }
`

export const manageProfileWorkM = gql`
    mutation manageProfileWork($account_id: String!, $option: String!, $title: String!, $description: String!, $category: String!, $format: String!, $image: String!, $dateUp: String!, $respects: Float!, $coll_id: String!)  {
        manageProfileWork(account_id: $account_id, option: $option, title: $title, description: $description, category: $category, format: $format, image: $image, dateUp: $dateUp, respects: $respects, coll_id: $coll_id) 
    }
`

export const createProfileM = gql`
    mutation createProfile($name: String!, $password: String!, $telegram: String!, $role: String!, $status: String!, $region: String!, $cords: ICord!, $image: String!) {
        createProfile(name: $name, password: $password, telegram: $telegram, role: $role, status: $status, region: $region, cords: $cords, image: $image) {
            account_id
            name
            role
        }
    }
`

export const loginProfileM = gql`
    mutation loginProfile($name: String!, $password: String!) {
        loginProfile(name: $name, password: $password) {
            account_id
            name
            role
        }
    }
`
