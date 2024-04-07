// architecture 
export interface AccountPageComponentProps {
    profile: any,
    context: any
}

export type AccountPageComponentType = {
    title: string
    icon: string
    component: any
}

export type CollectionPropsType = {
    params: {
        id: string
    }
}

// Mapbox and Towns API

export type Cords = {
    lat: number
    long: number
}

export type MapView = {
    latitude: number
    longitude: number
    width: string
    height: string
    zoom: number
}

export type TownType = {
    title: string
    cords: Cords
}

// routing

export type NavigatorWrapperPropsType = {
    children: any
    isRedirect: boolean
    id?: string
    url?: string
}

export interface RouteType {
    title: string
    access_value?: number
    url: string
    component?: any
    isVisible?: boolean
}

// Context API

export interface ContextStateType {
    account_id: string
    name: string
    role: string
}

// UI&UX

export type ImageLookProps = {
    src: any
    className: string
    min?: number
    max?: number
    speed?: number
    onClick?: any
    alt?: string
}

export type BrowserImageProps = {
    url: string,
    alt?: string
}

export type SimpleTriggerProps = {
    onClick: any
}

export type DataPaginationProps = {
    initialItems: any[]
    setItems: any
    label?: string
}

export type LoadingPropsType =  {
    label?: string
}

export type FormPaginationProps = {
    children: any
    num: number
    setNum: any
    items: any[]
}

export type ImageLoaderProps = {
    setImage: any
    label?: string
}

export type CounterViewProps = {
    selector?: string
    num: number
    setNum: any
    part?: number
    min?: number
    max?: number
    children: any
}

export type PopupPropsType = {
    text: string
}

export type AlertFunctionType = (text: string) => void

export type ContextPropsType = {
    account_id: string
    name: string
}

// store

export type RouteSliceItem = {
    shortid: string
    title: string
    cords: Cords
}

export type RouteSliceType = {
    distance: number
    cords: Cords
    routes: RouteSliceItem[]
}

export type OutlaySliceItem = {
    shortid: string
    title: string
    cost: number
}

export type OutlaySliceType = {
    outlaysItems: OutlaySliceItem[]
    total: number
}

export type SlicedStateType = {
    route: RouteSliceType
    outlay: OutlaySliceType
}



// pieces

export interface CleaningInfoProps {
    dateUp: string
    time: string
}