import mainPage from './pages/main'
import mainLearningPage from './pages/main.learning'
import mainJobPage from './pages/main.job'
import mainYellowPage from './pages/main.yellowpage'
import mainProjectPage from './pages/main.bid'
import mainTalentPage from './pages/main.talent'
import mainConsultantPage from './pages/main.consultant'
import mainDispatcherPage from './pages/main.dispatcher'
import mainToolPage from './pages/main.ai'
import mainEventPage from './pages/main.event'
import aboutPage from './pages/about'
import downloadPage from './pages/download'
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
import jobapplicationPage from './pages/jobs/applications'
import joblikePage from './pages/jobs/likes'
import companysPage from './pages/companys'
import companytypePage from './pages/companys/type'
import companyaddtypePage from './pages/companys/addtype'
import companyaddPage from './pages/companys/add'
import companyapplicationPage from './pages/companys/applications'
import companylikePage from './pages/companys/likes'
import projectsPage from './pages/projects'
import projecttypePage from './pages/projects/type'
import projectaddtypePage from './pages/projects/addtype'
import projectaddPage from './pages/projects/add'
import projectapplicationPage from './pages/projects/applications'
import projectlikePage from './pages/projects/likes'
import talentsPage from './pages/talents'
import talenttypePage from './pages/talents/type'
import talentaddtypePage from './pages/talents/addtype'
import talentaddPage from './pages/talents/add'
import talentapplicationPage from './pages/talents/applications'
import talentlikePage from './pages/talents/likes'
import consultantsPage from './pages/consultants'
import consultanttypePage from './pages/consultants/type'
import consultantaddtypePage from './pages/consultants/addtype'
import consultantaddPage from './pages/consultants/add'
import consultantapplicationPage from './pages/consultants/applications'
import consultantlikePage from './pages/consultants/likes'
import dispatchersPage from './pages/dispatchers'
import dispatchertypePage from './pages/dispatchers/type'
import dispatcheraddtypePage from './pages/dispatchers/addtype'
import dispatcheraddPage from './pages/dispatchers/add'
import dispatcherapplicationPage from './pages/dispatchers/applications'
import dispatcherlikePage from './pages/dispatchers/likes'
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
import knowledgecontentsaddAdPage from './pages/knowledge/contents/addAdvertisment'
import knowledgecontentsaddAuPage from './pages/knowledge/contents/addAudio'
import knowledgecontentsaddPiPage from './pages/knowledge/contents/addPicture'
import knowledgecontentsaddFlPage from './pages/knowledge/contents/addFlash'
import knowledgecontentsaddMsPage from './pages/knowledge/contents/addMultiSelect'
import knowledgecontentsaddYtPage from './pages/knowledge/contents/addYoutube'
import knowledgecontentsviewCPage from './pages/knowledge/contents/viewCertificate'
import knowledgecontentsviewHPage from './pages/knowledge/contents/viewHtml'
import knowledgecontentsviewIPage from './pages/knowledge/contents/viewInput'
import knowledgecontentsviewSPage from './pages/knowledge/contents/viewSelect'
import knowledgecontentsviewAdPage from './pages/knowledge/contents/viewAdvertisment'
import knowledgecontentsviewAuPage from './pages/knowledge/contents/viewAudio'
import knowledgecontentsviewPiPage from './pages/knowledge/contents/viewPicture'
import knowledgecontentsviewFlPage from './pages/knowledge/contents/viewFlash'
import knowledgecontentsviewMsPage from './pages/knowledge/contents/viewMultiSelect'
import knowledgecontentsviewYtPage from './pages/knowledge/contents/viewYoutube'
import toolsPage from './pages/tools'
import tooltypePage from './pages/tools/type'
import tooladdtypePage from './pages/tools/addtype'
import tooladdPage from './pages/tools/add'
import toolapplicationPage from './pages/tools/applications'
import toollikePage from './pages/tools/likes'
import eventsPage from './pages/events'
import eventtypePage from './pages/events/type'
import eventaddtypePage from './pages/events/addtype'
import eventaddPage from './pages/events/add'
import eventapplicationPage from './pages/events/applications'
import eventlikePage from './pages/events/likes'
import reportsPage from './pages/reports'
import reporttypePage from './pages/reports/type'
import reportaddPage from './pages/reports/add'
import messagePage from './pages/message'
import postPage from './pages/post'
export default [
  {
    path: '/knowledgemain/',
    component: mainPage,
  },
  {
    path: '/',
    component: mainLearningPage,
  },
  {
    path: '/jobmain/',
    component: mainJobPage,
  },
  {
    path: '/companymain/',
    component: mainYellowPage,
  },
  {
    path: '/projectmain/',
    component: mainProjectPage,
  },
  {
    path: '/talentmain/',
    component: mainTalentPage,
  },
  {
    path: '/consultantmain/',
    component: mainConsultantPage,
  },
  {
    path: '/dispatchermain/',
    component: mainDispatcherPage,
  },
  {
    path: '/toolmain/',
    component: mainToolPage,
  },
  {
    path: '/eventmain/',
    component: mainEventPage,
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
    path: '/download/',
    component: downloadPage
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
    path: '/job/',
    component: jobsPage
  },
  {
    path: '/job/type/',
    component: jobtypePage
  },
  {
    path: '/job/addtype/',
    component: jobaddtypePage
  },
  {
    path: '/job/add/',
    component: jobaddPage,
    name: 'addJob',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/job/applications/',
    component: jobapplicationPage,
    name: 'applicationJob',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/job/likes/',
    component: joblikePage,
    name: 'likeJob',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/company/',
    component: companysPage
  },
  {
    path: '/company/type/',
    component: companytypePage
  },
  {
    path: '/company/addtype/',
    component: companyaddtypePage
  },
  {
    path: '/company/add',
    component: companyaddPage,
    name: 'addCompany',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/company/applications/',
    component: companyapplicationPage,
    name: 'applicationCompany',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/company/likes/',
    component: companylikePage,
    name: 'likeCompany',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/project/',
    component: projectsPage
  },
  {
    path: '/project/type/',
    component: projecttypePage
  },
  {
    path: '/project/addtype/',
    component: projectaddtypePage
  },
  {
    path: '/project/add/',
    component: projectaddPage,
    name: 'addProject',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/project/applications/',
    component: projectapplicationPage,
    name: 'applicationProject',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/project/likes/',
    component: projectlikePage,
    name: 'likeProject',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/talent/',
    component: talentsPage
  },
  {
    path: '/talent/type/',
    component: talenttypePage
  },
  {
    path: '/talent/addtype/',
    component: talentaddtypePage
  },
  {
    path: '/talent/add/',
    component: talentaddPage,
    name: 'addTalent',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/talent/applications/',
    component: talentapplicationPage,
    name: 'applicationTalent',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/talent/likes/',
    component: talentlikePage,
    name: 'likeTalent',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/consultant/type/',
    component: consultanttypePage
  },
  {
    path: '/consultant/addtype/',
    component: consultantaddtypePage
  },
  {
    path: '/consultant/add/',
    component: consultantaddPage,
    name: 'addConsultant',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/consultant/applications/',
    component: consultantapplicationPage,
    name: 'applicationConsultant',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/consultant/likes/',
    component: consultantlikePage,
    name: 'likeConsultant',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/consultant/',
    component: consultantsPage
  },
  {
    path: '/dispatcher/',
    component: dispatchersPage
  },
  {
    path: '/dispatcher/type/',
    component: dispatchertypePage
  },
  {
    path: '/dispatcher/addtype/',
    component: dispatcheraddtypePage
  },
  {
    path: '/dispatcher/add/',
    component: dispatcheraddPage,
    name: 'addDispatcher',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/dispatcher/applications/',
    component: dispatcherapplicationPage,
    name: 'applicationDispatcher',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/dispatcher/applications/',
    component: dispatcherapplicationPage,
    name: 'applicationDispatcher',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/dispatcher/likes/',
    component: dispatcherlikePage,
    name: 'likeDispatcher',
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
    path: '/knowledge/contents/addAdvertisment',
    component: knowledgecontentsaddAdPage,
    name: 'KnowledgeContentsaddAd',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/knowledge/contents/addAudio',
    component: knowledgecontentsaddAuPage,
    name: 'KnowledgeContentsaddAu',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/knowledge/contents/addPicture',
    component: knowledgecontentsaddPiPage,
    name: 'KnowledgeContentsaddPi',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/knowledge/contents/addFlash',
    component: knowledgecontentsaddFlPage,
    name: 'KnowledgeContentsaddFl',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/knowledge/contents/addMultiSelect',
    component: knowledgecontentsaddMsPage,
    name: 'KnowledgeContentsaddMs',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/knowledge/contents/addYoutube',
    component: knowledgecontentsaddYtPage,
    name: 'KnowledgeContentsaddYt',
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
    path: '/knowledge/contents/viewAdvertisment',
    component: knowledgecontentsviewAdPage,
    name: 'KnowledgeContentsviewAd',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/knowledge/contents/viewAudio',
    component: knowledgecontentsviewAuPage,
    name: 'KnowledgeContentsviewAu',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/knowledge/contents/viewPicture',
    component: knowledgecontentsviewPiPage,
    name: 'KnowledgeContentsviewPi',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/knowledge/contents/viewFlash',
    component: knowledgecontentsviewFlPage,
    name: 'KnowledgeContentsviewFl',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/knowledge/contents/viewMultiSelect',
    component: knowledgecontentsviewMsPage,
    name: 'KnowledgeContentsviewMs',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/knowledge/contents/viewYoutube',
    component: knowledgecontentsviewYtPage,
    name: 'KnowledgeContentsviewYt',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/tool/',
    component: toolsPage
  },
  {
    path: '/tool/type/',
    component: tooltypePage
  },
  {
    path: '/tool/addtype/',
    component: tooladdtypePage
  },
  {
    path: '/tool/add/',
    component: tooladdPage,
    name: 'addTool',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/tool/applications/',
    component: toolapplicationPage,
    name: 'applicationTool',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/tool/likes/',
    component: toollikePage,
    name: 'likeTool',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/event/',
    component: eventsPage
  },
  {
    path: '/event/type/',
    component: eventtypePage
  },
  {
    path: '/event/addtype/',
    component: eventaddtypePage
  },
  {
    path: '/event/add/',
    component: eventaddPage,
    name: 'addEvent',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/event/applications/',
    component: eventapplicationPage,
    name: 'applicationEvent',
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/event/likes/',
    component: eventlikePage,
    name: 'likeEvent',
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
