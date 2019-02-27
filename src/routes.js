import mainPage from './pages/main'
import aboutPage from './pages/about'
import feedbackPage from './pages/feedback'
import languagePage from './pages/language'
import areaPage from './pages/area'
import industryPage from './pages/industry'
import profilePage from './pages/profile'
import jobsPage from './pages/jobs'
import jobtypePage from './pages/jobs/type'
import jobaddPage from './pages/jobs/add'
import companysPage from './pages/companys'
import companytypePage from './pages/companys/type'
import companyaddPage from './pages/companys/add'
import projectsPage from './pages/projects'
import projecttypePage from './pages/projects/type'
import projectaddPage from './pages/projects/add'
import talentsPage from './pages/talents'
import talenttypePage from './pages/talents/type'
import talentaddPage from './pages/talents/add'
import consultantsPage from './pages/consultants'
import consultanttypePage from './pages/consultants/type'
import consultantaddPage from './pages/consultants/add'
import dispatchersPage from './pages/dispatchers'
import dispatchertypePage from './pages/dispatchers/type'
import dispatcheraddPage from './pages/dispatchers/add'
import knowledgePage from './pages/knowledge'
import knowledgetypePage from './pages/knowledge/type'
import knowledgeaddPage from './pages/knowledge/add'
import toolsPage from './pages/tools'
import tooltypePage from './pages/tools/type'
import tooladdPage from './pages/tools/add'
import eventsPage from './pages/events'
import eventtypePage from './pages/events/type'
import eventaddPage from './pages/events/add'
import reportsPage from './pages/reports'
import reporttypePage from './pages/reports/type'
import reportaddPage from './pages/reports/add'
import messagePage from './pages/message'
import postPage from './pages/post'
import Login from '@/components/Login'
import Dashboard from '@/components/Dashboard'
import Settings from '@/components/Settings'

export default [
  {
    path: '/',
    component: mainPage,
  },
  {
    path: '/profile/',
    component: profilePage,
    name: 'profile',
    meta: {
      requiresAuth: true
    }
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
    component: aboutPage,
    name: 'about',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/message/',
    component: messagePage,
    name: 'message',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/post/',
    component: postPage,
    name: 'post',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/jobs/',
    component: jobsPage
  },
  {
    path: '/jobs/type/',
    component: jobtypePage
  },
  {
    path: '/jobs/add/',
    component: jobaddPage,
    name: 'addJob',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/companys/',
    component: companysPage
  },
  {
    path: '/companys/type/',
    component: companytypePage
  },
  {
    path: '/companys/add',
    component: companyaddPage,
    name: 'addCompany',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/projects/',
    component: projectsPage
  },
  {
    path: '/projects/type/',
    component: projecttypePage
  },
  {
    path: '/projects/add/',
    component: projectaddPage,
    name: 'addProject',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/talents/',
    component: talentsPage
  },
  {
    path: '/talents/type/',
    component: talenttypePage
  },
  {
    path: '/talents/add/',
    component: talentaddPage,
    name: 'addTalent',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/consultants/type/',
    component: consultanttypePage
  },
  {
    path: '/consultants/add/',
    component: consultantaddPage,
    name: 'addConsultant',
    meta: {
      requiresAuth: true
    }
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
    path: '/dispatchers/type/',
    component: dispatchertypePage
  },
  {
    path: '/dispatchers/add/',
    component: dispatcheraddPage,
    name: 'addDispatcher',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/knowledge/',
    component: knowledgePage
  },
  {
    path: '/knowledge/type/',
    component: knowledgetypePage
  },
  {
    path: '/knowledge/add/',
    component: knowledgeaddPage,
    name: 'addKnowledge',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/tools/',
    component: toolsPage
  },
  {
    path: '/tools/type/',
    component: tooltypePage
  },
  {
    path: '/tools/add/',
    component: tooladdPage,
    name: 'addTool',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/events/',
    component: eventsPage
  },
  {
    path: '/events/type/',
    component: eventtypePage
  },
  {
    path: '/events/add/',
    component: eventaddPage,
    name: 'addEvent',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/reports/',
    component: reportsPage
  },
  {
    path: '/reports/type/',
    component: reporttypePage
  },
  {
    path: '/reports/add/',
    component: reportaddPage,
    name: 'addReport',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: {
      requiresAuth: true
    }
  }
]
