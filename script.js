// Sections
const studentSection = document.getElementById('studentSection');
const teacherSection = document.getElementById('teacherSection');
const parentSection = document.getElementById('parentSection');

// XP
let totalXP = 0;
const xpCounter = document.getElementById('xpCounter');
async function loadXP() {
  if (!currentUser || currentRole !== "student") return;
  const res = await fetch("/api/xp");
  const data = await res.json();
  totalXP = data.totalXP || 0;
  xpCounter.textContent = 'XP: ' + totalXP;
}
async function saveXP() {
  if (!currentUser || currentRole !== "student") return;
  currentUser.xp = totalXP;
  await fetch("/api/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(currentUser)
  });
}
function addXP(amount) {
  totalXP += amount;
  xpCounter.textContent = 'XP: ' + totalXP;
  saveXP();
}

// Mood
const moods = document.querySelectorAll('.moods button');
const toast = document.getElementById('toast');
moods.forEach(m => m.addEventListener('click', () => {
  moods.forEach(x => x.classList.remove('active'));
  m.classList.add('active');
  showToast('Mood Saved!');
}));
function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),1500);
}

// Notes
const notesModal = document.getElementById('notesModal');
const notesTitle = document.getElementById('notesTitle');
const notesBody = document.getElementById('notesBody');
const notesDataBySession = {}; // { sessionIdx: [ {name,url} ] }

async function loadNotes() {
  const res = await fetch("/api/notes");
  const data = await res.json();
  Object.assign(notesDataBySession, data.sessions || {});
}
async function saveNotes() {
  await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessions: notesDataBySession })
  });
}
function renderNotes(sessionIdx){
  const files = notesDataBySession[sessionIdx] || [];
  notesBody.innerHTML = files.length === 0 
    ? '<p>No notes uploaded yet.</p>' 
    : files.map(f => `<div style="margin-bottom:15px;"><p>📄 ${f.name}</p>
      <embed src="${f.url}" type="application/pdf" width="100%" height="200px" style="border:1px solid #ddd;border-radius:8px;"></div>`).join('');
}

// Weekly Challenges
const weeklyChallenge = document.querySelectorAll('.challenge');
weeklyChallenge.forEach(ch => ch.addEventListener('click', () => {
  if(!ch.classList.contains('done')){
    ch.classList.add('done');
    ch.innerHTML='✅ Completed<br><small>XP Added</small>';
    addXP(50);
  }
}));

// Recordings
const recordings = [
  {title:'Math - Algebra Basics',link:'https://example.com/video1.mp4'},
  {title:'Science - Photosynthesis',link:'https://example.com/video2.mp4'},
  {title:'English - Reading Comprehension',link:'https://example.com/video3.mp4'},
  {title:'History - World War II',link:'https://example.com/video4.mp4'}
];
const recordingsListDiv = document.getElementById('recordingsList');
const videoModal = document.getElementById('videoModal');
const videoPlayer = document.getElementById('videoPlayer');
const videoTitle = document.getElementById('videoTitle');
function renderRecordings(){
  recordingsListDiv.innerHTML='';
  recordings.forEach((r,i)=>{
    const div = document.createElement('div'); div.className='card';
    div.innerHTML=`<h3>${r.title}</h3><button onclick="playRecording(${i})">Play</button>`;
    recordingsListDiv.appendChild(div);
  });
}
function playRecording(index){
  const r = recordings[index];
  videoTitle.textContent = r.title;
  videoPlayer.src = r.link;
  videoModal.style.display='flex';
}
function closeVideoModal(){ videoModal.style.display='none'; videoPlayer.pause(); }
renderRecordings();

// Assignments
let assignments = [
  {name:'Math Quiz - 15 min',link:'https://example.com/math-quiz',completed:false,xp:30},
  {name:'Science Experiment Summary',link:'https://example.com/science-summary',completed:false,xp:30},
  {name:'English Reading Comprehension',link:'https://example.com/english-reading',completed:false,xp:30},
  {name:'History Timeline Activity',link:'https://example.com/history-timeline',completed:false,xp:30}
];
const assignmentsListDiv = document.getElementById('assignmentsList');
const assignmentsChallenge = Array.from(weeklyChallenge).find(ch=>ch.innerText.includes('Complete 3 Smart Assignments'));

function renderAssignments(){
  assignmentsListDiv.innerHTML='';
  assignments.forEach((a,i)=>{
    const div=document.createElement('div');
    div.className='assignment-item'+(a.completed?' completed':'');
    div.innerHTML=`<span>${a.completed?'✅ ':''}${a.name}</span>
      <button onclick="startAssignment(${i})">${a.completed?'Restart':'Start Now'}</button>`;
    assignmentsListDiv.appendChild(div);
  });
  const completedCount = assignments.filter(a=>a.completed).length;
  if(completedCount>=3 && assignmentsChallenge && !assignmentsChallenge.classList.contains('done')){
    assignmentsChallenge.classList.add('done');
    assignmentsChallenge.innerHTML='✅ Completed<br><small>XP Added</small>';
    addXP(80);
  }
}

async function loadAssignments() {
  const res = await fetch("/api/assignments");
  assignments = await res.json() || assignments;
  renderAssignments();
}
async function saveAssignments() {
  await fetch("/api/assignments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(assignments)
  });
}
function startAssignment(index) {
  if (!currentUser) return;
  const a = assignments[index];
  window.open(a.link, "_blank");
  if (!a.completed) {
    assignments[index].completed = true;
    addXP(a.xp);
    saveAssignments();
  }
}
document.getElementById('assignmentsBtn').addEventListener('click', ()=>{
  document.getElementById('assignmentsModal').style.display='flex';
  renderAssignments();
});
function closeAssignmentsModal(){ document.getElementById('assignmentsModal').style.display='none'; }

// Threads / Discussions
const discussionModal = document.getElementById('discussionModal');
const discussionButton = document.querySelector('#discussionCard button');
const closeDiscussionModalBtn = document.getElementById('closeDiscussionModal');
const discussionInput = document.getElementById('discussionInput');
const sendDiscussionBtn = document.getElementById('sendDiscussionBtn');
const discussionThreads = document.getElementById('discussionThreads');

let discussions = [{ user: 'AI', message: 'Welcome to Peer Discussions!' }];

function renderDiscussionThreads() {
  discussionThreads.innerHTML='';
  discussions.forEach(d=>{
    const div=document.createElement('div');
    div.style.padding='8px';
    div.style.marginBottom='5px';
    div.style.borderRadius='6px';
    div.style.background=d.user==='AI' ? '#e0e7ff' : '#d1fae5';
    div.innerHTML=`<strong>${d.user}:</strong> ${d.message}`;
    discussionThreads.appendChild(div);
  });
  discussionThreads.scrollTop = discussionThreads.scrollHeight;
}

discussionButton.addEventListener('click', ()=>{
  discussionModal.style.display='flex';
  renderDiscussionThreads();
  discussionInput.focus();
});

closeDiscussionModalBtn.addEventListener('click', ()=>{
  discussionModal.style.display='none';
  discussionInput.value='';
});

sendDiscussionBtn.addEventListener('click', ()=>{
  const msg = discussionInput.value.trim();
  if(msg){
    discussions.push({user:'You', message:msg});
    renderDiscussionThreads();
    discussionInput.value='';
    discussionInput.focus();
  }
});

discussionInput.addEventListener('keypress', e=>{
  if(e.key==='Enter') sendDiscussionBtn.click();
});

discussionModal.addEventListener('click', e=>{
  if(e.target===discussionModal){
    discussionModal.style.display='none';
    discussionInput.value='';
  }
});

// Login
const loginModal = document.getElementById('loginModal');
let currentUser = null;
let currentRole = null; // "student" or "teacher"

document.getElementById('loginSubmit').addEventListener('click', async ()=>{
  const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab;
  if(!activeTab) return alert("Select a role first");

  const emailInput = activeTab==='studentTab' ? 'loginEmailStudent' : 'loginEmailTeacher';
  const passInput = activeTab==='studentTab' ? 'loginPasswordStudent' : 'loginPasswordTeacher';
  
  const email = document.getElementById(emailInput).value.trim();
  const password = document.getElementById(passInput).value.trim();

  let res = await fetch(`/api/${activeTab==='studentTab'?'students':'teachers'}`);
  let data = await res.json();
  
  // Adjust if API returns object { students: [...] } or { teachers: [...] }
  const users = data.students || data.teachers || data;
  
  currentUser = users.find(u => u.email.trim()===email && u.password.trim()===password);
  currentRole = activeTab==='studentTab' ? 'student' : 'teacher';

  if(currentUser){
    loginModal.style.display='none';
    alert(`Welcome, ${currentUser.name}!`);
    if(currentRole==='student') await loadXP(), await loadAssignments(), await loadNotes();
  } else {
    alert("Invalid login");
  }
});

// Export modal functions
window.closeVideoModal = closeVideoModal;
window.closeAssignmentsModal = closeAssignmentsModal;
window.closeNotesModal = ()=>notesModal.style.display='none';
window.playRecording = playRecording;
