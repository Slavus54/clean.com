import {gql} from '@apollo/client'

export const getProfilesQ = gql`
    query {
        getProfiles {
            account_id
            name
            password
            telegram
            role
            status 
            region
            cords {
                lat
                long
            } 
            image
            works {
                shortid
                title
                description
                category
                format
                image
                dateUp
                respects
            }
            account_components {
                shortid
                title
                path
            }
        }
    }
`

export const getProfileM = gql`
    mutation getProfile($account_id: String!) {
        getProfile(account_id: $account_id) {
            account_id
            name
            password
            telegram
            role
            status 
            region
            cords {
                lat
                long
            } 
            image
            works {
                shortid
                title
                description
                category
                format
                image
                dateUp
                respects
            }
            account_components {
                shortid
                title
                path
            }
        }
    }
`