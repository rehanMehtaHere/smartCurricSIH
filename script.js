// Sections
const studentSection = document.getElementById('studentSection');
const teacherSection = document.getElementById('teacherSection');
const parentSection = document.getElementById('parentSection');

// XP
let totalXP = 0;
const xpCounter = document.getElementById('xpCounter');
function addXP(amount) { totalXP += amount; xpCounter.textContent = 'XP: ' + totalXP; }

// Mood
const moods = document.querySelectorAll('.moods button');
const toast = document.getElementById('toast');
moods.forEach(m => m.addEventListener('click', () => {
  moods.forEach(x => x.classList.remove('active'));
  m.classList.add('active');
  showToast('Mood Saved!');
}));
function showToast(msg){ toast.textContent = msg; toast.classList.add('show'); setTimeout(()=>toast.classList.remove('show'),1500); }

// Notes
const notesModal = document.getElementById('notesModal');
const notesTitle = document.getElementById('notesTitle');
const notesBody = document.getElementById('notesBody');
const notesData = { Math: [], Science: [], English: [], History: [] };
document.querySelectorAll('.progressCard').forEach(card => card.addEventListener('click', ()=>{
  const subject = card.querySelector('h3,h4').textContent.trim();
  notesTitle.textContent = subject + ' Notes';
  renderNotes(subject);
  notesModal.style.display = 'flex';
}));
function renderNotes(subject){
  const files = notesData[subject] || [];
  notesBody.innerHTML = files.length === 0 ? '<p>No notes uploaded yet.</p>' : files.map(f => 
    `<div style="margin-bottom:15px;"><p>📄 ${f.name}</p><embed src="${f.url}" type="application/pdf" width="100%" height="200px" style="border:1px solid #ddd;border-radius:8px;"></div>`
  ).join('');
}

// Weekly Challenges
const weeklyChallenge = document.querySelectorAll('.challenge');
weeklyChallenge.forEach(ch => ch.addEventListener('click', () => {
  if(!ch.classList.contains('done')){ ch.classList.add('done'); ch.innerHTML='✅ Completed<br><small>XP Added</small>'; addXP(50); }
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
function playRecording(index){ const r=recordings[index]; videoTitle.textContent=r.title; videoPlayer.src=r.link; videoModal.style.display='flex'; }
function closeVideoModal(){ videoModal.style.display='none'; videoPlayer.pause(); }
renderRecordings();

// Assignments
const assignments = [
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
    div.innerHTML=`<span>${a.completed?'✅ ':''}${a.name}</span><button onclick="startAssignment(${i})">${a.completed?'Restart':'Start Now'}</button>`;
    assignmentsListDiv.appendChild(div);
  });
  const completedCount = assignments.filter(a=>a.completed).length;
  if(completedCount>=3 && !assignmentsChallenge.classList.contains('done')){
    assignmentsChallenge.classList.add('done');
    assignmentsChallenge.innerHTML='✅ Completed<br><small>XP Added</small>';
    addXP(80);
  }
}
function startAssignment(index){ const a=assignments[index]; window.open(a.link,'_blank'); if(!assignments[index].completed){ assignments[index].completed=true; addXP(a.xp); } renderAssignments(); }
document.getElementById('assignmentsBtn').addEventListener('click', ()=>{ document.getElementById('assignmentsModal').style.display='flex'; renderAssignments(); });
function closeAssignmentsModal(){ document.getElementById('assignmentsModal').style.display='none'; }

// Threads
const input = document.getElementById('threadInput');
const list = document.getElementById('threadList');
input.addEventListener('keypress', e=>{
  if(e.key==='Enter' && input.value.trim()!==''){
    const div=document.createElement('div'); div.className='thread-item';
    div.innerHTML=`You asked: “${input.value}”<br><small>AI: generating summary...</small>`;
    list.prepend(div); input.value='';
  }
});

// Login & Section switching
const loginModal = document.getElementById('loginModal');
let currentSection=null;
function handleSectionClick(section){ currentSection=section; loginModal.style.display='flex'; }
document.querySelector('.loginBtn').addEventListener('click', () => {
  loginModal.style.display = 'flex';
});

const tabButtons=document.querySelectorAll('.tab-btn');
const tabContents=document.querySelectorAll('.tab-content');
tabButtons.forEach(btn=>btn.addEventListener('click',()=>{
  tabButtons.forEach(b=>b.classList.remove('active')); btn.classList.add('active');
  const target=btn.dataset.tab;
  tabContents.forEach(tc=>tc.style.display=(tc.id===target?'block':'none'));
}));

document.getElementById('loginSubmit').addEventListener('click',()=>{
  const activeTab=document.querySelector('.tab-btn.active').dataset.tab;
  let name,email,password;
  if(activeTab==='studentTab'){ name=document.getElementById('loginNameStudent').value.trim(); email=document.getElementById('loginEmailStudent').value.trim(); password=document.getElementById('loginPasswordStudent').value.trim(); }
  else if(activeTab==='teacherTab'){ name=document.getElementById('loginNameTeacher').value.trim(); email=document.getElementById('loginEmailTeacher').value.trim(); password=document.getElementById('loginPasswordTeacher').value.trim(); }
  else if(activeTab==='parentTab'){ name='Parent'; email=document.getElementById('loginEmailParent').value.trim(); password=document.getElementById('loginPasswordParent').value.trim(); }
  if(email && password && (activeTab!=='parentTab'?name:true)){
    loginModal.style.display='none';
    tabContents.forEach(tc=>tc.querySelectorAll('input').forEach(i=>i.value=''));
    studentSection.style.display = activeTab==='studentTab'?'block':'none';
    teacherSection.style.display = activeTab==='teacherTab'?'block':'none';
    parentSection.style.display = activeTab==='parentTab'?'block':'none';
  }else alert('Please fill all fields!');
});

// Parent attendance chart
new Chart(document.getElementById('parentAttendanceChart').getContext('2d'),{
  type:'line',
  data:{labels:['Week 1','Week 2','Week 3','Week 4','Week 5'],datasets:[{label:'Attendance %',data:[88,90,85,92,95],borderColor:'#3b82f6',backgroundColor:'rgba(59,130,246,0.1)',fill:true,tension:0.3,pointRadius:5}]},
  options:{responsive:true,scales:{y:{beginAtZero:true,max:100}}}
});

// Attendance card
const attendanceCard = document.getElementById('attendanceCard');
const attendanceModal = document.getElementById('attendanceModal');
let attendanceChart = null;
attendanceCard.addEventListener('click',()=>{
  attendanceModal.style.display='flex';
  if(!attendanceChart){
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    attendanceChart = new Chart(ctx,{type:'line',data:{labels:['Week 1','Week 2','Week 3','Week 4','Week 5'],datasets:[{label:'Attendance %',data:[88,90,85,92,95],borderColor:'#4f46e5',backgroundColor:'rgba(79,70,229,0.1)',fill:true,tension:0.3,pointRadius:5}]},options:{responsive:true,scales:{y:{beginAtZero:true,max:100}}}});
  }
});
function closeAttendanceModal(){ attendanceModal.style.display='none'; }

// QR Scanner
const html5QrCode = new Html5Qrcode("reader");
html5QrCode.start({facingMode:"environment"},{fps:10,qrbox:250},
  (decodedText)=>document.getElementById('qrResult').textContent='Scanned: '+decodedText,
  ()=>{}
);

// Announcements
const announcementsBtn=document.querySelector('.announcement');
const announcementPopup=document.getElementById('announcementPopup');
const announcementListDiv=document.getElementById('announcementList');
let announcements=["Welcome to SmartCurric+ Interactive!","New Math quiz available this week.","Science lab sessions start from Monday."];
function showAnnouncementPopup(){ announcementListDiv.innerHTML=''; announcements.slice().reverse().forEach(a=>{ const div=document.createElement('div'); div.className='announcement-item'; div.textContent=a; announcementListDiv.appendChild(div); }); announcementPopup.style.display='block'; }
function closeAnnouncementPopup(){ announcementPopup.style.display='none'; }
announcementsBtn.addEventListener('click',showAnnouncementPopup);
function addAnnouncement(text){ announcements.push(text); showAnnouncementPopup(); }
document.getElementById('postAnnouncementBtn')?.addEventListener('click',()=>{
  const text=document.getElementById('announcementInput').value.trim();
  if(!text) return alert("Enter an announcement!");
  addAnnouncement(text); document.getElementById('announcementInput').value='';
});

// Dummy schedule data, replace/fetch from backend as needed
const studentSchedule = [
  {date: '24.9.2025', day: 'Monday', time: '9:00-10:00', subject: 'Math' },
  {date: '24.9.2025', day: 'Monday', time: '11:00-12:00', subject: 'Science' },
  {date: '24.9.2025', day: 'Tuesday', time: '9:00-10:00', subject: 'English' },
  {date: '24.9.2025', day: 'Wednesday', time: '10:00-11:00', subject: 'History' },
  {date: '24.9.2025', day: 'Thursday', time: '12:00-1:00', subject: 'Math' },
  {date: '24.9.2025', day: 'Friday', time: '9:00-10:00', subject: 'Science' }
];

const teacherSchedule = [
  {date: '24.9.2025', day: 'Monday', time: '9:00-10:00', subject: 'Math - Grade 9' },
  {date: '24.9.2025', day: 'Tuesday', time: '11:00-12:00', subject: 'Math - Grade 10' },
  {date: '24.9.2025', day: 'Thursday', time: '1:00-2:00', subject: 'Project Review' }
];

// teacher qr generator
const assessmentButtonsDiv = document.getElementById('assessmentButtons'); // container for buttons under Dynamic QR Code
const teacherQRDiv = document.getElementById('teacherQR');
const qrHelperText = document.getElementById('qrHelperText');

let qrInterval = null;
let qrGenCount = 0;
let currentButton = null;

function generateQRCodeForSession(session) {
  teacherQRDiv.innerHTML = '';
  const codeData = `${session.subject}-${Date.now()}`;
  QRCode.toCanvas(codeData, {width: 200}, (err, canvas) => {
    if(err) {
      console.error(err);
      qrHelperText.textContent = 'Error generating QR code.';
      return;
    }
    teacherQRDiv.appendChild(canvas);
  });
}

function onSessionButtonClick(session, buttonElement) {
  // Clear previous interval if any
  if(qrInterval) clearInterval(qrInterval);

  qrGenCount = 0;
  currentButton = buttonElement;
  qrHelperText.textContent = `Showing QR for "${session.subject}". It will regenerate every 10 seconds for 6 times.`;
  generateQRCodeForSession(session);

  qrInterval = setInterval(() => {
    qrGenCount++;
    if(qrGenCount >= 6) {
      clearInterval(qrInterval);
      qrHelperText.textContent = `QR regeneration completed for "${session.subject}".`;
      teacherQRDiv.innerHTML = '';  // Remove QR
      if(currentButton) {
        currentButton.style.display = 'none'; // Hide the clicked button
      }
      currentButton = null;
      return;
    }
    generateQRCodeForSession(session);
  }, 10000);
}

function renderSessionButtons() {
  assessmentButtonsDiv.innerHTML = '';
  teacherSchedule.forEach((session, idx) => {
    const btn = document.createElement('button');
    btn.textContent = `${session.subject}`;
    btn.className = 'assessment-btn';
    btn.style.marginRight = '12px';
    btn.style.marginBottom = '8px';
    btn.style.padding = '8px 16px';
    btn.style.borderRadius = '10px';
    btn.style.border = 'none';
    btn.style.background = '#4f46e5';
    btn.style.color = '#fff';
    btn.style.fontWeight = '600';
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => onSessionButtonClick(session, btn));
    assessmentButtonsDiv.appendChild(btn);
  });
}
renderSessionButtons();

// Render for student
function renderStudentSchedule() {
  const container = document.getElementById('studentScheduleCards');
  container.innerHTML = '';
  studentSchedule.forEach(item => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<h3>${item.subject}</h3>
      <p>${item.date} , ${item.day}, ${item.time}</p>`;
    container.appendChild(div);
  });
}
renderStudentSchedule();

// Render for teacher
function renderTeacherSchedule() {
  const container = document.getElementById('teacherScheduleCards');
  container.innerHTML = '';
  teacherSchedule.forEach(item => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<h3>${item.subject}</h3>
      <p>${item.date} , ${item.day}, ${item.time}</p>`;
    container.appendChild(div);
  });
}
renderTeacherSchedule();

// Use teacherSchedule array for sessions
const sessionSelect = document.getElementById('sessionSelect');
function populateSessionDropdown() {
  sessionSelect.innerHTML = '';
  teacherSchedule.forEach((session, idx) => {
    const option = document.createElement('option');
    option.value = idx;
    option.textContent = `${session.date} , ${session.day} , ${session.time}, ${session.subject}`;
    sessionSelect.appendChild(option);
  });
}
populateSessionDropdown();

// Store notes by session index
const notesDataBySession = {}; // { sessionIdx: [ {name, url} ] }
const pdfNameInput = document.getElementById('pdfName');
const pdfFileInput = document.getElementById('pdfFile');
const uploadBtn = document.getElementById('uploadBtn');

uploadBtn.addEventListener('click', () => {
  const sessionIdx = sessionSelect.value;
  const name = pdfNameInput.value.trim();
  const file = pdfFileInput.files[0];
  if(!name || !file) return alert('Enter name & choose PDF');
  const url = URL.createObjectURL(file);
  if(!notesDataBySession[sessionIdx]) notesDataBySession[sessionIdx] = [];
  notesDataBySession[sessionIdx].push({ name, url });
  pdfNameInput.value = '';
  pdfFileInput.value = '';
  alert('PDF uploaded!');
});

// Global exports
window.closeVideoModal=closeVideoModal;
window.closeAssignmentsModal=closeAssignmentsModal;
window.closeAttendanceModal=closeAttendanceModal;
window.closeNotesModal=()=>notesModal.style.display='none';
window.playRecording=playRecording;
