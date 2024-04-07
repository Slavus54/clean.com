import {gql} from '@apollo/client'

export const createLectureM = gql`
    mutation createLecture($name: String!, $id: String!, $title: String!, $description: String!, $province: String!, $architecture: String!, $resource: String!, $format: String!, $link: String!) {
        createLecture(name: $name, id: $id, title: $title, description: $description, province: $province, architecture: $architecture, resource: $resource, format: $format, link: $link)
    }
`

export const getLecturesQ = gql`
    query {
        getLectures {
            shortid
            name
            title
            description
            province
            architecture
            resource
            format
            link
            conspects {
                shortid
                name
                text
                category
                course
                image
                dateUp
                respects
            }
            buildings {
                shortid
                name
                title
                material
                century   
                cords {
                    lat
                    long
                }
            }
        }
    }
`

export const getLectureM = gql`
    mutation getLecture($shortid: String!) {
        getLecture(shortid: $shortid) {
            shortid
            name
            title
            description
            province
            architecture
            resource
            format
            link
            conspects {
                shortid
                name
                text
                category
                course
                image
                dateUp
                respects
            }
            buildings {
                shortid
                name
                title
                material
                century   
                cords {
                    lat
                    long
                }
            }
        }
    }
`

export const manageLectureConspectM = gql`
    mutation manageLectureConspect($name: String!, $id: String!, $option: String!, $text: String!, $category: String!, $course: Float!, $image: String!, $dateUp: String!, $respects: Float!, $coll_id: String!) {
        manageLectureConspect(name: $name, id: $id, option: $option, text: $text, category: $category, course: $course, image: $image, dateUp: $dateUp, respects: $respects, coll_id: $coll_id)
    } 
`

export const updateLectureResourceM = gql`
    mutation updateLectureResource($name: String!, $id: String!, $resource: String!, $format: String!, $link: String!) {
        updateLectureResource(name: $name, id: $id, resource: $resource, format: $format, link: $link) 
    } 
`

export const publishLectureBuildingM = gql`
    mutation publishLectureBuilding($name: String!, $id: String!, $title: String!, $material: String!, $century: String!, $cords: ICord!) {
        publishLectureBuilding(name: $name, id: $id, title: $title, material: $material, century: $century, cords: $cords)
    } 
`