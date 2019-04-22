import mainPage from './pages/main'
import aboutPage from './pages/about'
import loginPage from './pages/about/login'
import modifyPage from './pages/about/modify'
import feedbackPage from './pages/feedback'
import languagePage from './pages/language'
import areaPage from './pages/area'
import industryPage from './pages/industry'
import profilePage from './pages/profile'
import jobsPage from './pages/jobs'
import jobtypePage from './pages/jobs/type'
import jobaddtypePage from './pages/jobs/addtype'
import jobaddPage from './pages/jobs/add'
import jobviewPage from './pages/jobs/view'
import companysPage from './pages/companys'
import companytypePage from './pages/companys/type'
import companyaddtypePage from './pages/companys/addtype'
import companyaddPage from './pages/companys/add'
import companyviewPage from './pages/companys/view'
import projectsPage from './pages/projects'
import projecttypePage from './pages/projects/type'
import projectaddtypePage from './pages/projects/addtype'
import projectaddPage from './pages/projects/add'
import projectviewPage from './pages/projects/view'
import talentsPage from './pages/talents'
import talenttypePage from './pages/talents/type'
import talentaddtypePage from './pages/talents/addtype'
import talentaddPage from './pages/talents/add'
import talentviewPage from './pages/talents/view'
import consultantsPage from './pages/consultants'
import consultanttypePage from './pages/consultants/type'
import consultantaddtypePage from './pages/consultants/addtype'
import consultantaddPage from './pages/consultants/add'
import consultantviewPage from './pages/consultants/view'
import dispatchersPage from './pages/dispatchers'
import dispatchertypePage from './pages/dispatchers/type'
import dispatcheraddtypePage from './pages/dispatchers/addtype'
import dispatcheraddPage from './pages/dispatchers/add'
import dispatcherviewPage from './pages/dispatchers/view'
import knowledgePage from './pages/knowledge'
import knowledgetypePage from './pages/knowledge/type'
import knowledgeaddtypePage from './pages/knowledge/addtype'
import knowledgeaddPage from './pages/knowledge/add'
import knowledgecertificatesPage from './pages/knowledge/certificates'
import knowledgeapplicationsPage from './pages/knowledge/applications'
import knowledgelikesPage from './pages/knowledge/likes'
import knowledgecontentsPage from './pages/knowledge/contents'
import knowledgecontentsaddCPage from './pages/knowledge/contents/addCertificate'
import knowledgecontentsaddHPage from './pages/knowledge/contents/addHtml'
import knowledgecontentsaddIPage from './pages/knowledge/contents/addInput'
import knowledgecontentsaddSPage from './pages/knowledge/contents/addSelect'
import knowledgecontentsviewCPage from './pages/knowledge/contents/viewCertificate'
import knowledgecontentsviewHPage from './pages/knowledge/contents/viewHtml'
import knowledgecontentsviewIPage from './pages/knowledge/contents/viewInput'
import knowledgecontentsviewSPage from './pages/knowledge/contents/viewSelect'
import toolsPage from './pages/tools'
import tooltypePage from './pages/tools/type'
import tooladdtypePage from './pages/tools/addtype'
import tooladdPage from './pages/tools/add'
import toolviewPage from './pages/tools/view'
import eventsPage from './pages/events'
import eventtypePage from './pages/events/type'
import eventaddtypePage from './pages/events/addtype'
import eventaddPage from './pages/events/add'
import eventviewPage from './pages/events/view'
import reportsPage from './pages/reports'
import reporttypePage from './pages/reports/type'
import reportaddPage from './pages/reports/add'
import messagePage from './pages/message'
import postPage from './pages/post'
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
    path: '/about/login/',
    component: loginPage,
    name: 'login'
  },
  {
    path: '/about/modify/',
    component: modifyPage,
    name: 'modify',
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
    path: '/jobs/addtype/',
    component: jobaddtypePage
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
    path: '/jobs/view/',
    component: jobviewPage,
    name: 'viewJob',
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
    path: '/companys/addtype/',
    component: companyaddtypePage
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
    path: '/company/view/',
    component: companyviewPage,
    name: 'viewCompany',
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
    path: '/projects/addtype/',
    component: projectaddtypePage
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
    path: '/projects/view/',
    component: projectviewPage,
    name: 'viewProject',
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
    path: '/talents/addtype/',
    component: talentaddtypePage
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
    path: '/talents/view/',
    component: talentviewPage,
    name: 'viewTalent',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/consultants/type/',
    component: consultanttypePage
  },
  {
    path: '/consultants/addtype/',
    component: consultantaddtypePage
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
    path: '/consultants/view/',
    component: consultantviewPage,
    name: 'viewConsultant',
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
    path: '/dispatchers/addtype/',
    component: dispatcheraddtypePage
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
    path: '/dispatchers/view/',
    component: dispatcherviewPage,
    name: 'viewDispatcher',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/knowledge/',
    component: knowledgePage,
    name: 'knowledges',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/knowledge/type/',
    component: knowledgetypePage
  },
  {
    path: '/knowledge/addtype/',
    component: knowledgeaddtypePage
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
    path: '/knowledge/certificates/',
    component: knowledgecertificatesPage
  },
  {
    path: '/knowledge/applications/',
    component: knowledgeapplicationsPage
  },
  {
    path: '/knowledge/likes/',
    component: knowledgelikesPage
  },
  {
    path: '/knowledge/contents/',
    component: knowledgecontentsPage,
    name: 'KnowledgeContents',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/knowledge/contents/addCertificate',
    component: knowledgecontentsaddCPage,
    name: 'KnowledgeContentsaddC',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/knowledge/contents/addHtml',
    component: knowledgecontentsaddHPage,
    name: 'KnowledgeContentsaddH',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/knowledge/contents/addInput',
    component: knowledgecontentsaddIPage,
    name: 'KnowledgeContentsaddI',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/knowledge/contents/addSelect',
    component: knowledgecontentsaddSPage,
    name: 'KnowledgeContentsaddS',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/knowledge/contents/viewCertificate',
    component: knowledgecontentsviewCPage,
    name: 'KnowledgeContentsviewC',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/knowledge/contents/viewHtml',
    component: knowledgecontentsviewHPage,
    name: 'KnowledgeContentsviewH',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/knowledge/contents/viewInput',
    component: knowledgecontentsviewIPage,
    name: 'KnowledgeContentsviewI',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/knowledge/contents/viewSelect',
    component: knowledgecontentsviewSPage,
    name: 'KnowledgeContentsviewS',
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
    path: '/tools/addtype/',
    component: tooladdtypePage
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
    path: '/tools/view/',
    component: toolviewPage,
    name: 'viewTool',
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
    path: '/events/addtype/',
    component: eventaddtypePage
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
    path: '/events/view/',
    component: eventviewPage,
    name: 'viewEvent',
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
  }
]
