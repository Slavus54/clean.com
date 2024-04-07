import {gql} from '@apollo/client'

export const createRentalM = gql`
    mutation createRental($name: String!, $id: String!, $title: String!, $category: String!, $format: String!, $rooms: Float!, $square: Float!, $region: String!, $cords: ICord!, $year: Float!, $cost: Float!) {
        createRental(name: $name, id: $id, title: $title, category: $category, format: $format, rooms: $rooms, square: $square, region: $region, cords: $cords, year: $year, cost: $cost)
    }
`

export const getRentalsQ = gql`
    query {
        getRentals {
            shortid
            name
            title
            category
            format
            rooms
            square
            region
            cords {
                lat
                long
            }
            year
            cost
            questions {
                shortid
                name
                text
                category
                reply
                answered
                likes
            }
            photos {
                shortid
                title
                format
                image
                dateUp
            }
        }
    }
`

export const getRentalM = gql`
    mutation getRental($shortid: String!) {
        getRental(shortid: $shortid) {
            shortid
            name
            title
            category
            format
            rooms
            square
            region
            cords {
                lat
                long
            }
            year
            cost
            questions {
                shortid
                name
                text
                category
                reply
                answered
                likes
            }
            photos {
                shortid
                title
                format
                image
                dateUp
            }
        }
    }
`

export const manageRentalQuestionM = gql`
    mutation manageRentalQuestion($name: String!, $id: String!, $option: String!, $text: String!, $category: String!, $reply: String!, $answered: Boolean!, $likes: Float!, $coll_id: String!) {
        manageRentalQuestion(name: $name, id: $id, option: $option, text: $text, category: $category, reply: $reply, answered: $answered, likes: $likes, coll_id: $coll_id)
    }
`

export const updateRentalInformationM = gql`
    mutation updateRentalInformation($name: String!, $id: String!, $year: Float!, $cost: Float!) {
        updateRentalInformation(name: $name, id: $id, year: $year, cost: $cost)
    }
`

export const publishRentalPhotoM = gql`
    mutation publishRentalPhoto($name: String!, $id: String!, $title: String!, $format: String!, $image: String!, $dateUp: String!) {
        publishRentalPhoto(name: $name, id: $id, title: $title, format: $format, image: $image, dateUp: $dateUp)
    }
`