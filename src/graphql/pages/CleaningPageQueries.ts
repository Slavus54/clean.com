import {gql} from '@apollo/client'

export const createCleaningM = gql`
    mutation createCleaning($name: String!, $id: String!, $title: String!, $category: String!, $level: String!, $theme: String!, $content: String!, $channel: String!, $dateUp: String!, $time: String!, $region: String!, $cords: ICord!, $dots: [ICord]!, $distance: Float!, $resource: String!, $volume: Float!) {
        createCleaning(name: $name, id: $id, title: $title, category: $category, level: $level, theme: $theme, content: $content, channel: $channel, dateUp: $dateUp, time: $time, region: $region, cords: $cords, dots: $dots, distance: $distance, resource: $resource, volume: $volume) 
    }
`

export const getCleaningsQ = gql`
    query {
        getCleanings {
            shortid
            name
            title
            category
            level
            theme
            content
            channel
            dateUp
            time
            region
            cords {
                lat
                long
            }
            dots {
                lat
                long
            }
            distance
            members {
                account_id
                name
                resource
                volume
            }
            packets {
                shortid
                name
                text
                category
                image
                likes
                dateUp
            }
        }
    }
`

export const getCleaningM = gql`
    mutation getCleaning($shortid: String!) {
        getCleaning(shortid: $shortid) {
            shortid
            name
            title
            category
            level
            theme
            content
            channel
            dateUp
            time
            region
            cords {
                lat
                long
            }
            dots {
                lat
                long
            }
            distance
            members {
                account_id
                name
                resource
                volume
            }
            packets {
                shortid
                name
                text
                category
                image
                likes
                dateUp
            }
        }
    }
`

export const manageCleaningStatusM = gql`
    mutation manageCleaningStatus($name: String!, $id: String!, $option: String!, $resource: String!, $volume: Float!) {
        manageCleaningStatus(name: $name, id: $id, option: $option, resource: $resource, volume: $volume) 
    }
`

export const updateCleaningRouteM = gql`
    mutation updateCleaningRoute($name: String!, $id: String!, $cords: ICord!, $distance: Float!) {
        updateCleaningRoute(name: $name, id: $id, cords: $cords, distance: $distance) 
    }
`

export const updateCleaningThemeM = gql`
    mutation updateCleaningTheme($name: String!, $id: String!, $theme: String!, $content: String!) {
        updateCleaningTheme(name: $name, id: $id, theme: $theme, content: $content) 
    }
`

export const manageCleaningPacketM = gql`
    mutation manageCleaningPacket($name: String!, $id: String!, $option: String!, $text: String!, $category: String!, $image: String!, $likes: Float!, $dateUp: String!, $coll_id: String!) {
        manageCleaningPacket(name: $name, id: $id, option: $option, text: $text, category: $category, image: $image, likes: $likes, dateUp: $dateUp, coll_id: $coll_id)
    }
`