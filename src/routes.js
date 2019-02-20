import mainPage from './pages/main'
import aboutPage from './pages/about'
import feedbackPage from './pages/feedback'
import languagePage from './pages/language'
import areaPage from './pages/area'
import industryPage from './pages/industry'
import profilePage from './pages/profile'
import jobsPage from './pages/jobs'
import companysPage from './pages/companys'
import projectsPage from './pages/projects'
import talentsPage from './pages/talents'
import consultantsPage from './pages/consultants'
import dispatchersPage from './pages/dispatchers'
import knowledgePage from './pages/knowledge'
import toolsPage from './pages/tools'
import eventsPage from './pages/events'
import messagePage from './pages/message'
import postPage from './pages/post'

export default [
  {
    path: '/',
    component: mainPage,
  },
  {
    path: '/profile/',
    component: profilePage
  },
  {
    path: '/language/',
    component: languagePage
  },
  {
    path: '/area/',
    component: areaPage
  },
  {
    path: '/industry/',
    component: industryPage
  },
  {
    path: '/feedback/',
    component: feedbackPage
  },
  {
    path: '/about/',
    component: aboutPage
  },
  {
    path: '/message/',
    component: messagePage
  },
  {
    path: '/post/',
    component: postPage
  },
  {
    path: '/jobs/',
    component: jobsPage
  },
  {
    path: '/companys/',
    component: companysPage
  },
  {
    path: '/projects/',
    component: projectsPage
  },
  {
    path: '/talents/',
    component: talentsPage
  },
  {
    path: '/consultants/',
    component: consultantsPage
  },
  {
    path: '/dispatchers/',
    component: dispatchersPage
  },
  {
    path: '/knowledge/',
    component: knowledgePage
  },
  {
    path: '/tools/',
    component: toolsPage
  },
  {
    path: '/events/',
    component: eventsPage
  }
]
