// Authentication

import Login from '../pages/forms/Login'
import Register from '../pages/forms/Register'

// Project's Components

import CreateProject from '../pages/forms/CreateProject'
import Projects from '../pages/search/Projects'
import Project from '../pages/page/Project'

// Lecture's Components

import CreateLecture from '../pages/forms/CreateLecture'
import Lectures from '../pages/search/Lectures'
import Lecture from '../pages/page/Lecture'

// Cleaning's Components

import CreateCleaning from '../pages/forms/CreateCleaning'
import Cleanings from '../pages/search/Cleanings'
import Cleaning from '../pages/page/Cleaning'

// Rental's Components

import CreateRental from '../pages/forms/CreateRental'
import Rentals from '../pages/search/Rentals'
import Rental from '../pages/page/Rental'

// Profile's Components

import Profiles from '../pages/search/Profiles'
import Profile from '../pages/page/Profile'

// Home Component

import Home from '../pages/head/Home'

import {RouteType} from '../../types/types'

export const routes: RouteType[] = [
    {
        title: 'Home',
        access_value: 0,
        url: '/',
        component: Home,
        isVisible: true
    },
    {
        title: 'To Account',
        access_value: -1,
        url: '/login',
        component: Login,
        isVisible: true
    },
    {
        title: 'Projects',
        access_value: 1,
        url: '/projects',
        component: Projects,
        isVisible: true
    },
    {
        title: 'Lectures',
        access_value: 1,
        url: '/lectures',
        component: Lectures,
        isVisible: true
    },
    {
        title: 'Cleanings',
        access_value: 1,
        url: '/cleanings',
        component: Cleanings,
        isVisible: true
    },
    {
        title: 'Rentals',
        access_value: 1,
        url: '/rentals',
        component: Rentals,
        isVisible: true
    },
    {
        title: 'Profiles',
        access_value: 1,
        url: '/profiles',
        component: Profiles,
        isVisible: true
    },
    {
        title: '',
        access_value: -1,
        url: '/register',
        component: Register,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/create-project/:id',
        component: CreateProject,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/project/:id',
        component: Project,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/create-lecture/:id',
        component: CreateLecture,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/lecture/:id',
        component: Lecture,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/create-cleaning/:id',
        component: CreateCleaning,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/cleaning/:id',
        component: Cleaning,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/create-rental/:id',
        component: CreateRental,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/rental/:id',
        component: Rental,
        isVisible: false
    },
    {
        title: '',
        access_value: 1,
        url: '/profile/:id',
        component: Profile,
        isVisible: false
    },
]