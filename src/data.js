// EDIT ME: personal details and links
export const ME = {
  email: 'luckyamores14@gmail.com',
  linkedin: 'https://www.linkedin.com/in/lucky-amores-48560a369',
  github: 'https://github.com/luckyam10',
  location: 'San Pedro, Laguna, Philippines',
}
export const SCHOOL = { name: 'National University Laguna', program: 'Computer Science' }
export const ARCHIVE = 'https://luckyam10.github.io/luckyamores.github.io/'
// Dropbox folders with your project files (remove if you don't want them public)
export const FILES = [
  ['Project files, folder 1', 'https://www.dropbox.com/scl/fo/hebcrzda4lmicv9v99max/AIwCjiJvW-25v9YOGH56r6w?rlkey=c3f875atbazoqvik2x3pag0pf&st=dpg2x618&dl=0'],
  ['Project files, folder 2', 'https://www.dropbox.com/scl/fo/37ytn4zl6lwc26kpzdb8d/AFdTYQig4udjgSDdLDIR5oE?rlkey=9b9bfkprnvnj2gzd9mewnjwdo&st=uxg8ejk4&dl=0'],
]

export const FILTERS = ['All', 'AI & Security', 'Web', 'Backend', 'Java', 'Design']

export const PROJECTS = [
  { id: 'anomaly', tag: 'AI & Security', kind: 'Capstone', title: 'Hardware Anomaly Detection for Cryptojacking',
    blurb: 'Finds hidden crypto-mining by watching how a machine behaves instead of scanning for known malware.',
    detail: 'Hardware telemetry is scored with an Isolation Forest and a Z-Score check, so unusual sustained load stands out from normal use.',
    stack: ['Python', 'Isolation Forest', 'Z-Score', 'Telemetry'] },
  { id: 'healthbuddy', tag: 'AI & Security', kind: 'Deployed chatbot', title: 'HealthBuddy',
    blurb: 'A health-information chatbot that works out what the visitor is asking before it answers.',
    detail: 'Classifies each message by intent and ships with a dashboard showing model performance. Live on Render.',
    stack: ['Chatbot', 'Intent classification', 'Model dashboard', 'Render'],
    link: { label: 'Open the live app', href: 'https://healthbuddy-chatbot.onrender.com/' } },
  { id: 'workflow', tag: 'Design', kind: 'Interactive prototype', title: 'Form Approval Workflow System',
    blurb: 'A sign-in to sign-off journey for submitting and reviewing forms.',
    detail: 'Maps how a form travels from requester to approver, from the login screen through each approval stage.',
    stack: ['Figma Make', 'UX flow', 'Prototyping'],
    link: { label: 'Open the prototype', href: 'https://www.figma.com/make/HIHFG0I6R1Za3Z1R4OPTFk/Form-Approval-Workflow-System?code-node-id=1-5&p=f&fullscreen=1&preview-route=%2Flogin' } },
  // TODO: confirm the description and stack of the restaurant website, and add its link
  { id: 'restaurant', tag: 'Web', kind: 'Website', title: 'Restaurant Website',
    blurb: 'A responsive restaurant website that presents the place and makes it easy to find and contact.',
    detail: 'Built as a front-end project with a focus on clean layout and mobile-friendly pages.',
    stack: ['HTML', 'CSS', 'JavaScript'] },
  { id: 'signnu', tag: 'Web', kind: 'Web app', title: 'SignNU',
    blurb: 'A React and Vite web application built as a school project.',
    detail: 'Component-based front end with fast Vite tooling.',
    stack: ['React', 'Vite', 'JavaScript'] },
  { id: 'schedule', tag: 'Java', kind: 'Java program', title: 'Class Scheduling System',
    blurb: 'Arranges classes without clashing rooms, times or instructors.',
    detail: 'Object-oriented design around sections, rooms and time slots, with conflict checking at its core.',
    stack: ['Java', 'OOP', 'Scheduling logic'] },
  { id: 'notes', tag: 'Backend', kind: 'REST API', title: 'Express Notes API',
    blurb: 'A Node.js and Express backend for creating, reading, updating and deleting notes.',
    detail: 'Standard REST routes with JSON responses, built to practise backend structure and API design.',
    stack: ['Node.js', 'Express', 'REST', 'JSON'] },
]

export const SKILLS = [
  ['The Written Word', ['HTML', 'CSS', 'JavaScript', 'React', 'Vite']],
  ['Tongues of Logic', ['Java', 'Python', 'Node.js', 'Express']],
  ['Vaults of Data', ['MySQL', 'MongoDB', 'Excel']],
  ['Arcane Analysis', ['Isolation Forest', 'Z-Score', 'Intent classification']],
  ['Craft and Illusion', ['Figma', 'Photoshop', 'CapCut']],
]