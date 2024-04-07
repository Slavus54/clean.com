import {gql} from '@apollo/client'

export const createProjectM = gql`
    mutation createProject($name: String!, $id: String!, $title: String!, $category: String!, $architecture: String!, $century: String!, $author: String!, $region: String!, $cords: ICord!, $status: String!, $rating: Float!) {
        createProject(name: $name, id: $id, title: $title, category: $category, architecture: $architecture, century: $century, author: $author, region: $region, cords: $cords, status: $status, rating: $rating)
    }
`

export const getProjectsQ = gql`
    query {
        getProjects {
            shortid
            name
            title
            category
            architecture
            century
            author
            region
            cords {
                lat
                long
            }
            status
            rating
            details {
                shortid
                name
                title
                category
                image
                likes
                dateUp
            }
            facts {
                shortid
                name
                text
                level
                isTrue
            }
        }
    }
`

export const getProjectM = gql`
    mutation getProject($shortid: String!) {
        getProject(shortid: $shortid) {
            shortid
            name
            title
            category
            architecture
            century
            author
            region
            cords {
                lat
                long
            }
            status
            rating
            details {
                shortid
                name
                title
                category
                image
                likes
                dateUp
            }
            facts {
                shortid
                name
                text
                level
                isTrue
            }
        }
    }
`

export const manageProjectDetailM = gql`
    mutation manageProjectDetail($name: String!, $id: String!, $option: String!, $title: String!, $category: String!, $image: String!, $likes: Float!, $dateUp: String!, $coll_id: String!) {
        manageProjectDetail(name: $name, id: $id, option: $option, title: $title, category: $category, image: $image, likes: $likes, dateUp: $dateUp, coll_id: $coll_id)
    }
`

export const updateProjectInformationM = gql`
    mutation updateProjectInformation($name: String!, $id: String!, $status: String!, $rating: Float!) {
        updateProjectInformation(name: $name, id: $id, status: $status, rating: $rating)
    }
`

export const makeProjectFactM = gql`
    mutation makeProjectFact($name: String!, $id: String!, $text: String!, $level: String!, $isTrue: Boolean!) {
        makeProjectFact(name: $name, id: $id, text: $text, level: $level, isTrue: $isTrue)
    }
`