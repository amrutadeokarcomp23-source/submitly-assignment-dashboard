// Seed data. Dates are generated relative to "today" the first time the app runs,
// so the demo always has a mix of overdue, upcoming and submitted work.

const day = 24 * 60 * 60 * 1000

const toDateInput = (offsetDays) => {
  const d = new Date(Date.now() + offsetDays * day)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export const USERS = [
  { id: 'a1', name: 'Prof. Meera Kulkarni', role: 'admin', email: 'meera@college.edu' },
  { id: 'a2', name: 'Prof. Rahul Verma', role: 'admin', email: 'rahul@college.edu' },
  { id: 's1', name: 'Amruta Deokar', role: 'student', email: 'amruta@college.edu' },
  { id: 's2', name: 'Rohan Patil', role: 'student', email: 'rohan@college.edu' },
  { id: 's3', name: 'Sneha Joshi', role: 'student', email: 'sneha@college.edu' },
  { id: 's4', name: 'Aditya Shah', role: 'student', email: 'aditya@college.edu' },
  { id: 's5', name: 'Pooja More', role: 'student', email: 'pooja@college.edu' },
]

export const buildSeedState = () => {
  const assignments = [
    {
      id: 'as1',
      title: 'DAA Mini Project Report',
      description: 'Compare merge sort and multithreaded merge sort. Submit the PDF report on the shared Drive folder.',
      dueDate: toDateInput(-3),
      driveLink: 'https://drive.google.com/drive/folders/daa-mini-project',
      createdBy: 'a1',
      assignedTo: 'all',
    },
    {
      id: 'as2',
      title: 'Operating Systems Lab 5',
      description: 'Implement the Banker’s algorithm in C and upload the source along with sample output.',
      dueDate: toDateInput(2),
      driveLink: 'https://drive.google.com/drive/folders/os-lab-5',
      createdBy: 'a1',
      assignedTo: 'all',
    },
    {
      id: 'as3',
      title: 'Machine Learning Case Study',
      description: 'Pick a dataset from Kaggle, train two models and write a 2-page comparison.',
      dueDate: toDateInput(7),
      driveLink: 'https://drive.google.com/drive/folders/ml-case-study',
      createdBy: 'a1',
      assignedTo: ['s1', 's2', 's3'],
    },
    {
      id: 'as4',
      title: 'Database Systems Assignment 2',
      description: 'Normalise the given schema up to BCNF and write the SQL for all queries.',
      dueDate: toDateInput(5),
      driveLink: 'https://drive.google.com/drive/folders/dbms-a2',
      createdBy: 'a2',
      assignedTo: 'all',
    },
    {
      id: 'as5',
      title: 'Computer Networks Packet Tracer',
      description: 'Design a campus network with VLANs and submit the .pkt file.',
      dueDate: toDateInput(-1),
      driveLink: 'https://drive.google.com/drive/folders/cn-packet-tracer',
      createdBy: 'a2',
      assignedTo: ['s1', 's4', 's5'],
    },
  ]

  const iso = (offset) => new Date(Date.now() + offset * day).toISOString()

  // submissions[assignmentId][studentId] = { submittedAt }
  const submissions = {
    as1: { s1: { submittedAt: iso(-4) }, s3: { submittedAt: iso(-3) } },
    as2: { s2: { submittedAt: iso(-1) } },
    as3: {},
    as4: { s1: { submittedAt: iso(-1) }, s2: { submittedAt: iso(0) }, s5: { submittedAt: iso(0) } },
    as5: { s4: { submittedAt: iso(-2) } },
  }

  return { users: USERS, assignments, submissions }
}
