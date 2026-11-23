/* Interview-only flow. No global dashboard, role selection, mic-test or coach changes. */
(() => {
  const original = {
    start: startInterviewSession, render: renderInterview, duck: setDuckState,
    countdown: startTurnCountdown, speak: speakDuckText, stop: stopAllAudioAndRecording,
    record: startVoiceRecording, stopRecord: stopVoiceRecording, submit: submitSpokenAnswer,
    hints: unlockNextHint, advance: advanceToAdaptiveNextQuestion, complete: finalizeInterviewSession
  };
  const prompts = [
    ['Tell me about yourself.', ['education','skills','interest'], 'Talk about your studies, skills, and what kind of work you want to do.'],
    ['What are you good at, and what would you like to improve?', ['strength','improve','learn'], 'Name a skill you have and one skill you are working on.'],
    ['What is something you did well, and why?', ['work','proud','learn'], 'Explain what went well and what you learned.'],
    ['Why do you want this job?', ['role','learn','contribute'], 'Say what interests you about the job and what you can offer.'],
    ['How do you work with a team?', ['team','listen','help'], 'Explain how you listen, share work, and help others.'],
    ['How do you plan your work when you have many tasks?', ['plan','priority','deadline'], 'Explain how you choose what to do first and keep people updated.'],
    ['How do you solve a problem?', ['problem','think','check'], 'Explain how you understand the problem and decide what to try.'],
    ['How do you handle feedback or mistakes?', ['feedback','learn','improve'], 'Explain how you listen, learn, and make a change.'],
    ['How would you help an upset customer or classmate?', ['listen','calm','help'], 'Explain how you would listen and find a helpful next step.'],
    ['What would you like to learn in the next few years?', ['goal','skills','learn'], 'Name a goal and a few skills you want to build.']
  ];
  let mouthTimer, pulseTimer, recorder, mediaStream, chunks = [], recordings = [];
  let lastSession = null;
  const active = () => interviewState?.scheme === 'pato-entry-10';
  const clearMouth = () => {
    clearInterval(mouthTimer); clearTimeout(pulseTimer);
    document.querySelector('#duckStageContainer .pato-mascot')?.style.setProperty('--beak-open','0');
  };
  function mascot() {
    return `<svg class="pato-mascot pato-fallback" viewBox="0 0 244 329" role="img" aria-label="PATO, a professional duck avatar">
      <defs><clipPath id="patoLowerBill"><path d="M94 59 Q122 72 153 58 L153 72 Q119 81 94 68Z"/></clipPath></defs>
      <image href="assets/pato-interview-mascot.jpg" width="244" height="329"/>
      <path class="pato-mouth-gap" d="M97 62 Q121 71 150 62 Q132 79 108 72Z" fill="#5b3014"/>
      <g class="pato-lower-bill"><image href="assets/pato-interview-mascot.jpg" width="244" height="329" clip-path="url(#patoLowerBill)"/></g>
    </svg>`;
  }
  function drawMascot(state) {
    const el = $('duckStageContainer'); if (!el || !active()) return;
    const safe = ['speaking','listening','evaluating'].includes(state) ? state : 'idle';
    el.querySelector('.pato-3d-stage') && window.PATO3D?.mount(el.querySelector('.pato-3d-stage'))?.dispose();
    el.className = `duck-stage pato-interview-avatar pato-${safe}`;
    el.innerHTML = `<div class="pato-3d-stage" aria-label="Animated 3D PATO avatar"></div><span class="duck-state-badge">PATO · ${safe === 'evaluating' ? 'SCORING' : safe.toUpperCase()}</span>`;
    const stage=el.querySelector('.pato-3d-stage');
    if(window.PATO3D && window.THREE){
      const avatar=window.PATO3D.mount(stage,{background:'#238e43',equipped:appState?.profile?.equipped||{}});
      avatar?.setState(safe==='evaluating'?'thinking':safe);
    } else { stage.innerHTML=mascot(); }
  }
  setDuckState = function(state) {
    original.duck(state);
    if (active()) { drawMascot(state); if(state !== 'speaking') clearMouth(); }
  };
  function pulse() {
    const el = document.querySelector('#duckStageContainer .pato-mascot');
    if (!el || !window.speechSynthesis?.speaking || window.speechSynthesis.paused) return;
    el.style.setProperty('--beak-open', String(.35 + Math.random()*.65));
    clearTimeout(pulseTimer); pulseTimer=setTimeout(()=>el.style.setProperty('--beak-open','0'),110);
  }
  speakDuckText = function(text, done) {
    if (!active()) return original.speak(text,done);
    clearMouth();
    if (!ttsState.supported || ttsState.muted) return original.speak(text,done);
    if (interviewState.stage === 'recording' || interviewState.stage === 'mic_test') return;
    speechSynthesis.cancel();
    const session=interviewState;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate=ttsState.rate; utter.pitch=1.05;
    const voices=speechSynthesis.getVoices();
    const voice=voices.find(v=>/^en-(US|GB|PH)/i.test(v.lang)) || voices.find(v=>/^en/i.test(v.lang));
    if(voice) utter.voice=voice;
    let finished=false;
    const finish=()=>{if(finished)return;finished=true;clearMouth();setDuckState('idle');document.querySelector('#duckStageContainer .pato-3d-stage')&&window.PATO3D?.mount(document.querySelector('#duckStageContainer .pato-3d-stage'))?.setState('idle');if(interviewState===session && done)done();};
    utter.onstart=()=>{setDuckState('speaking');document.querySelector('#duckStageContainer .pato-3d-stage')&&window.PATO3D?.mount(document.querySelector('#duckStageContainer .pato-3d-stage'))?.setState('speaking');mouthTimer=setInterval(pulse,140);};
    // Boundary events align word-level beak gestures when supplied by the browser voice.
    utter.onboundary=pulse;
    utter.onpause=()=>{clearMouth();setDuckState('idle');document.querySelector('#duckStageContainer .pato-3d-stage')&&window.PATO3D?.mount(document.querySelector('#duckStageContainer .pato-3d-stage'))?.setState('idle');};
    utter.onresume=()=>{setDuckState('speaking');document.querySelector('#duckStageContainer .pato-3d-stage')&&window.PATO3D?.mount(document.querySelector('#duckStageContainer .pato-3d-stage'))?.setState('speaking');mouthTimer=setInterval(pulse,140);};
    utter.onend=finish;utter.onerror=finish;
    speechSynthesis.speak(utter);
  };
  const roleQuestions = {
    'Web Development': [
      'How would you make a web page responsive across mobile and desktop?',
      'How would you investigate a page that loads slowly?',
      'How would you handle a failed API request in the interface?',
      'How do you keep a form accessible and validate user input?',
      'Describe how you would debug a JavaScript error in the browser.'
    ],
    'Software Development': [
      'How would you break a programming problem into smaller steps?',
      'How would you debug a function that gives the wrong answer?',
      'What are variables, functions, and data structures used for?',
      'How would you test a feature before releasing it?',
      'How do you make code easy for your team to read and update?'
    ],
    'IT Support': [
      'A user cannot connect to the internet. What would you check first?',
      'A computer is slow. What would you check?',
      'How would you handle a user who cannot sign in to their account?',
      'When would you ask another technician for help?',
      'How would you write down a technical problem so others can understand it?'
    ],
    'Networking': [
      'A device is connected but cannot open websites. What would you check?',
      'What do DHCP and DNS do in a network?',
      'How would you tell if a connection problem affects one device or many?',
      'What does a default gateway do?',
      'How would you check a network outage without making it worse?'
    ],
    'Database Management': [
      'What are primary keys and foreign keys used for?',
      'How would you find duplicate data in a table?',
      'Why is database normalization useful?',
      'What would you check if a database query is slow?',
      'How would you keep data safe when making an update?'
    ],
    'Cybersecurity': [
      'What is phishing, and how can a user spot it?',
      'What is SQL injection, and how can a website prevent it?',
      'What would you do after a suspicious login alert?',
      'Why should users only have the access they need?',
      'How would you make a new application safer?'
    ]
  };
  const roleAdvancedQuestions = {
    'Web Development': [
      'How would you design a reusable component structure for a growing web application?',
      'How would you secure and validate data sent from a browser to a backend API?',
      'How would you improve accessibility for a form used by keyboard and screen-reader users?',
      'How would you investigate a frontend performance issue using browser developer tools?',
      'How would you deploy a web feature safely and monitor it after release?'
    ],
    'Software Development': [
      'How would you choose suitable data structures for a feature with frequent lookups?',
      'How would you design automated tests for edge cases and unexpected input?',
      'How would you review a teammate’s code for reliability and maintainability?',
      'How would you handle errors and logging in a multi-step application process?',
      'How would you plan a refactor while minimizing risk to existing features?'
    ],
    'IT Support': [
      'How would you prioritize several support tickets when multiple users are affected?',
      'How would you distinguish a hardware fault from an operating-system or driver issue?',
      'How would you protect user data before performing a repair or system reset?',
      'How would you explain a recurring technical issue to a non-technical user?',
      'How would you identify whether an incident needs escalation and what evidence would you provide?'
    ],
    'Networking': [
      'How would you design a small office network with separate staff and guest access?',
      'How would you use packet capture or logs to investigate intermittent packet loss?',
      'How would you troubleshoot a VLAN configuration that prevents devices from communicating?',
      'How would you plan a network change to reduce downtime and provide a rollback path?',
      'How would you monitor network availability and detect a developing outage?'
    ],
    'Database Management': [
      'How would you choose indexes for a frequently used query and measure the improvement?',
      'How would you design a transaction so partial failures do not leave inconsistent data?',
      'How would you plan a backup and restore test for a production database?',
      'How would you investigate deadlocks or contention during concurrent updates?',
      'How would you control access to sensitive records while keeping audit history?'
    ],
    'Cybersecurity': [
      'How would you prioritize vulnerabilities based on exploitability and business impact?',
      'How would you investigate a suspected account compromise while preserving evidence?',
      'How would you apply least privilege to an application with several user roles?',
      'How would you test whether a security control actually reduces the identified risk?',
      'How would you coordinate incident containment, recovery, and post-incident review?'
    ]
  };
  const roleFollowups = {
    'Web Development':'What would you check to make sure the solution works?',
    'Software Development':'How would you check that the problem is fixed?',
    'IT Support':'What would you check next, and how would you explain it simply?',
    'Networking':'What command or network detail could help you find the problem?',
    'Database Management':'How would you check the result and keep the data safe?',
    'Cybersecurity':'How would you check the risk and keep sensitive information safe?'
  };
  // Question strategy is deliberately separate from microphone/recognition handling.
  // Replace this object to change adaptive interview behavior without touching voice capture.
  const AdaptiveQuestionStrategy = {
    probes: {
      'Web Development': {
        clarify: 'For the web development task you just described, what exact step would you take first, and what tool or browser feature would you use?',
        easier: 'In a simple web page, what are the responsibilities of HTML, CSS, and JavaScript?',
        harder: 'How would you measure the performance impact of your solution and prevent the same issue from returning?'
      },
      'Software Development': {
        clarify: 'Can you walk through one concrete coding example and explain the steps you would take?',
        easier: 'What is one basic programming concept or debugging step you would use here?',
        harder: 'How would you compare two possible solutions for correctness, performance, and maintainability?'
      },
      'IT Support': {
        clarify: 'What would you check first on the user’s device, and what result would confirm your suspicion?',
        easier: 'What basic physical connection or device setting would you check before changing anything?',
        harder: 'How would you document the root cause, verify the fix, and prevent the issue from happening again?'
      },
      'Networking': {
        clarify: 'Which network command or device status would you check first, and what would its output tell you?',
        easier: 'What is the purpose of an IP address and default gateway?',
        harder: 'How would you isolate the fault by network layer and verify the fix without disrupting other users?'
      },
      'Database Management': {
        clarify: 'Can you give a specific SQL or database example and explain how you would verify the result?',
        easier: 'What is the purpose of a primary key in a database table?',
        harder: 'How would you evaluate query performance while preserving data integrity and transaction safety?'
      },
      'Cybersecurity': {
        clarify: 'What exact security indicator would you inspect first, and what action would you take based on it?',
        easier: 'What is one basic security practice that helps protect an account or application?',
        harder: 'How would you validate the risk, reduce exposure, and monitor whether the mitigation worked?'
      }
    },
    next({ category, evaluation, answer, nextIndex }) {
      const pool = roleQuestions[category] || [];
      const advanced = roleAdvancedQuestions[category] || [];
      const probes = this.probes[category] || this.probes['Software Development'];
      const text = String(answer || '').trim();
      const classification = String(evaluation?.classification || '').toLowerCase();
      const shallow = text.split(/\s+/).filter(Boolean).length < 18;
      let kind = 'standard', difficulty = 'Intermediate', prompt = nextIndex < 5
        ? (pool[nextIndex] || prompts[nextIndex]?.[0])
        : (advanced[nextIndex - 5] || 'How would you validate your solution in a real workplace setting?');
      if (['vague','incomplete','keyword-only','keywordonly','unassessable'].includes(classification) || shallow) {
        kind = 'clarify'; difficulty = 'Beginner'; prompt = probes.clarify;
      } else if (['incorrect','irrelevant'].includes(classification)) {
        kind = 'easier'; difficulty = 'Beginner'; prompt = probes.easier;
      } else if (classification === 'strong') {
        kind = 'harder'; difficulty = 'Advanced'; prompt = probes.harder;
      }
      const answerAnchor = text.replace(/\s+/g,' ').split(' ').slice(0,8).join(' ').slice(0,72);
      const adaptedPrompt = kind !== 'standard' && answerAnchor
        ? `You mentioned “${answerAnchor}”. ${prompt}` : prompt;
      return {
        kind, difficulty, text: adaptedPrompt,
        reason: kind === 'clarify' ? 'A focused follow-up will help clarify the answer.'
          : kind === 'easier' ? 'The next question starts with a core concept.'
          : kind === 'harder' ? 'Your answer showed depth, so the next question increases the challenge.'
          : 'Continue with the next question for this job role.'
      };
    }
  };
  const BASIC_PROMPTS = [
    'Tell me about yourself.',
    'What are your strengths?',
    'What is one weakness you are working to improve?',
    'Why do you want this job?',
    'Tell me about a time you worked well with a team.',
    'How do you handle pressure or a difficult situation?',
    'Describe a problem you solved and how you solved it.',
    'How do you handle feedback or criticism?',
    'Where do you see yourself in the next few years?',
    'Why should we hire you?'
  ];
  function question(index, followup, difficulty) {
    const row=prompts[index];
    const category=interviewState?.category || '';
    const technical=roleQuestions[category];
    const advanced=roleAdvancedQuestions[category];
    const text=BASIC_PROMPTS[index] || row[0];
    return {id:91000+index, category:interviewState.category, type:'technical',difficulty:difficulty || 'Intermediate',
      scheme:'pato-entry-10', text:followup || text, concepts: followup ? ['main idea','clear explanation'] : row[1],
      objectives:[row[2]], keywords:followup ? ['example','action','result','because'] : row[1], misconceptions:[],
      hints:[row[2], 'Start with your main point. Then explain it in a few simple sentences.', 'Keep your answer clear and focused. Short answers are okay when they cover the question.'],
      followups:{incomplete:roleFollowups[category] || 'Could you explain the main point a little more clearly?',vague:'Could you say a little more about your answer?',strong:'What is one important thing to remember about this?'}};
  }
  startInterviewSession = function(options) {
    // Scenario labs retain their existing dedicated flow.
    if(!options.scenarioTitle) { micTestState.passed=false; micTestState.recorded=false; micTestState.listened=false; micTestState.voiceDetected=false; }
    original.start(options);
    if(options.scenarioTitle) return;
    interviewState.scheme='pato-entry-10';interviewState.maxTurns=10;
    interviewState.currentQuestion=question(0);
    interviewState.voiceEvidence=[];interviewState.micVerified=false;
    recordings.forEach(r=>URL.revokeObjectURL(r.url));recordings=[];
    renderInterview();
  };
  startTurnCountdown = function() {
    if(active()) {
      if(interviewState.stage==='mic_test') {
        if(!(micTestState.permissionGranted && micTestState.recorded && micTestState.listened && micTestState.passed)) {toast('Record a voice sample and play it back before starting the interview.');return;}
        interviewState.micVerified=true;
      }
      if(!interviewState.micVerified)return;
      interviewState.recordDurationSec=0;
    }
    return original.countdown();
  };
  startVoiceRecording = async function() {
    if(!active())return original.record();
    if(!interviewState.micVerified || !['ready_to_record','transcript_review'].includes(interviewState.stage))return;
    const session=interviewState;
    session.submitError='';
    try {
      if(!window.MediaRecorder)throw new Error('Audio recording is not supported in this browser.');
      mediaStream=await navigator.mediaDevices.getUserMedia({audio:true});
      if(interviewState!==session){mediaStream.getTracks().forEach(t=>t.stop());return;}
      chunks=[];recorder=new MediaRecorder(mediaStream);
      recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};
      const turn=session.turnIndex;
      recorder.onstop=()=>{
        const blob=new Blob(chunks,{type:recorder.mimeType || 'audio/webm'});
        const old=recordings.findIndex(r=>r.turn===turn);
        if(old>=0){URL.revokeObjectURL(recordings[old].url);recordings.splice(old,1);}
        if(blob.size)recordings.push({turn,url:URL.createObjectURL(blob)});
        mediaStream?.getTracks().forEach(t=>t.stop());
      };
      recorder.start();session.audioCaptured=true;
      original.record();
    } catch(error) {toast('Recording could not start: '+error.message);}
  };
  stopVoiceRecording = function() {
    if(active() && recorder?.state==='recording')recorder.stop();
    return original.stopRecord();
  };
  stopAllAudioAndRecording = function() {
    clearMouth();
    if(recorder?.state==='recording')recorder.stop();
    mediaStream?.getTracks().forEach(t=>t.stop());
    return original.stop();
  };
  submitSpokenAnswer = async function() {
    if(!active())return original.submit();
    const st=interviewState;
    if(st.stage!=='transcript_review'){toast('Record and stop your spoken answer before submitting.');return;}
    const transcript=($('transcriptEditor')?.value || st.liveTranscript || '').trim();
    if(!transcript){
      st.submitError='Please open the microphone and put your answer first. Click the microphone, speak your answer, then submit it.';
      renderInterview();
      return;
    }
    st.submitError='';
    st.voiceEvidence[st.turnIndex]={duration:st.recordDurationSec,pauses:st.pauseCount,restarts:st.restarts,
      words:transcript.split(/\s+/).length,confidence:st.recognitionSamples?.length ? st.recognitionSamples.reduce((a,b)=>a+b,0)/st.recognitionSamples.length : null};
    await original.submit();
    if(interviewState===st && st.stage==='turn_feedback') {
      const ev=st.lastTurnEval;
      const next=st.turnIndex+1;
      const answer=st.turns[st.turns.length-1]?.transcript || '';
      st.pendingFollowup=null;
      ev.followupQuestion='';
      ev.branchReason='Basic interview question.';
      ev.difficultyShift='Basic';
      renderInterview();
      const feedbackLine = ev?.classification === 'strong'
        ? "Good answer. Your main point was clear. Nice work—no need to turn it into a novel."
        : ev?.classification === 'irrelevant'
          ? "Let's bring it back to the question. Tell me the main point. The duck is listening."
          : ev?.classification === 'incorrect'
            ? "Not quite. Review the main idea, then try again. Even ducks check their facts."
            : "Thanks for answering. Add a little more detail about your main point. Keep it simple.";
      const feedbackBox=document.querySelector("#turnFeedback") || document.querySelector(".turn-feedback");
      if(feedbackBox) {
        const patoTip=document.createElement("div");
        patoTip.className="pato-spoken-feedback";
        patoTip.innerHTML=`<strong>PATO's feedback</strong><p>${feedbackLine}</p>`;
        feedbackBox.appendChild(patoTip);
      }
      if(st.stage==='turn_feedback') {
        st.feedbackSpeaking=true;
        renderInterview();
        setDuckState('speaking');
        speakDuckText(feedbackLine,()=>{
          st.feedbackSpeaking=false;
          renderInterview();
          setDuckState('idle');
        });
      }
    }
  };
  advanceToAdaptiveNextQuestion = function() {
    if(!active())return original.advance();
    if(interviewState.stage!=='turn_feedback')return;
    if(interviewState.feedbackSpeaking){toast('Please wait until PATO finishes the feedback.');return;}
    if(interviewState.turnIndex===9)return finalizeInterviewSession();
    interviewState.turnIndex++;
    const pending=interviewState.pendingFollowup;
    interviewState.currentQuestion=pending
      ? {...question(interviewState.turnIndex,pending.text,pending.difficulty),id:pending.id,adaptiveKind:pending.kind}
      : question(interviewState.turnIndex);
    interviewState.pendingFollowup=null;
    interviewState.lastTurnEval=null;interviewState.audioCaptured=false;interviewState.recognitionSamples=[];
    interviewState.liveTranscript='';interviewState.interimTranscript='';
    startTurnCountdown();
  };
  unlockNextHint = function() {
    if(!active())return original.hints();
    if(interviewState.unlockedHintLevel>=3)return;
    interviewState.unlockedHintLevel++;interviewState.hintsUsedThisTurn=interviewState.unlockedHintLevel;
    interviewState.totalHintsUsed++;renderInterview();
  };
  const mean=a=>a.length ? Math.round(a.reduce((x,y)=>x+y,0)/a.length) : null;
  const number=n=>n===null?'Not assessed':`${n}<small>/100</small>`;
  function scorePanels(st) {
    const rows=st.turns.map((t,i)=>{
      const cs=t.evaluation?.criteria || [];
      const get=k=>{const c=cs.find(c=>c.key===k);return c?Math.round(Number(c.rating)*20):null;};
      return {n:i+1,content:get('answerContent') ?? get('content'),structure:get('organization'),relevance:get('relevance'),feedback:t.evaluation?.actionableImprovement || ''};
    });
    const content=mean(rows.map(r=>r.content).filter(v=>v!==null));
    const structure=mean(rows.map(r=>r.structure).filter(v=>v!==null));
    const relevance=mean(rows.map(r=>r.relevance).filter(v=>v!==null));
    const overall=mean([content,structure,relevance].filter(v=>v!==null));
    const voice=st.voiceEvidence.filter(v=>v?.duration>0).map(v=>{
      const wpm=v.words*60/v.duration;
      return {pace:Math.round(Math.max(0,100-Math.max(0,95-wpm,wpm-165)*1.2)),
        clarity:v.confidence===null?null:Math.round(v.confidence*100),
        confidence:Math.max(0,100-v.restarts*12-v.pauses*6)};
    });
    const pace=mean(voice.map(v=>v.pace)),clarity=mean(voice.map(v=>v.clarity).filter(v=>v!==null));
    const confidence=mean(voice.map(v=>v.confidence));
    const voiceOverall=mean([pace,clarity,confidence].filter(v=>v!==null));
    return `<div class="pato-score-grid">
      <section class="panel"><h2>Interview Skills Score</h2><div class="pato-score-number">${number(overall)}</div>
      <p>Content ${content ?? '—'} · Structure ${structure ?? '—'} · Relevance ${relevance ?? '—'}</p>
      <p>Answer the question, explain your main point, and keep your ideas clear.</p>
      <div class="table-wrap"><table><thead><tr><th>Answer</th><th>Answer Content</th><th>Structure</th><th>Relevance</th></tr></thead><tbody>
      ${rows.map(r=>`<tr><td>${r.n}</td><td>${r.content ?? '—'}</td><td>${r.structure ?? '—'}</td><td>${r.relevance ?? '—'}</td></tr><tr><td colspan="4">${escapeHtml(r.feedback)}</td></tr>`).join('')}</tbody></table></div>
      <p class="pato-score-note">Scores are practice feedback, not a hiring decision. Answer content reflects relevance, clarity, and key ideas. Engine: ${escapeHtml(st.turns[0]?.evaluation?.engine || 'Rubric evaluator')}.</p></section>
      <section class="panel"><h2>Voice Score</h2><div class="pato-score-number">${number(voiceOverall)}</div>
      <p>Clarity ${clarity ?? 'Not assessed'} · Pace ${pace ?? 'Not assessed'} · Confidence ${confidence ?? 'Not assessed'}</p>
      <p>Keep a steady conversational pace, pause between ideas, and rehearse complete answers without unnecessary restarts.</p>
      <p class="pato-score-note">Delivery estimates only: clarity uses browser speech-recognition confidence when available; pace uses transcript words and recording duration; confidence is a continuity proxy based on pauses and restarts, not a measurement of emotion or personal confidence. Edited transcripts can affect estimates. Missing measures are excluded from the overall mean.</p>
      <h3>Review recorded answers</h3>${recordings.map(r=>`<label class="pato-audio-label">Answer ${r.turn+1}<audio controls preload="metadata" src="${r.url}"></audio></label>`).join('')}
      <p class="pato-score-note">Recordings are held locally for this session, not uploaded or persisted.</p></section></div>`;
  }
  finalizeInterviewSession = async function() {
    if(!active())return original.complete();
    const st=interviewState;
    if(st.turns.length!==10 || st.saving)return;
    st.saving=true;stopAllAudioAndRecording();
    try {
      const res=await apiRequest('/api/interview/complete',{method:'POST',body:JSON.stringify({sessionId:st.sessionId,category:st.category,mode:st.mode,scenarioTitle:st.scenarioTitle,turns:st.turns})});
      lastCompletedSession=res.session;lastEarnedRewards={earnedXp:res.earnedXp,earnedCoins:res.earnedCoins,newAchievements:res.newAchievements||[]};
      lastSession=st;st.stage='scheme_results';st.saving=false;renderInterview();
      await refreshServerState().catch(()=>toast('Session saved. Refresh your profile to reload its summary.'));
    }catch(e){st.saving=false;toast('Could not save session: '+e.message);}
  };
  renderInterview = function() {
    if(!active())return original.render();
    const st=interviewState;
    if(st.stage==='scheme_results') {
      $('pageContent').innerHTML=`<div class="welcome-row"><div><h1>Interview complete</h1><p>10 questions · Branching-Dialogue Scheme</p></div><button class="secondary-btn" onclick="navigate('select')">New interview</button></div>${scorePanels(st)}<button class="secondary-btn" onclick="navigate('results')">Open full saved report</button>`;
      return;
    }
    // Keep the original mic check, controls, and Answer Blueprint Coach markup and logic.
    const mode=st.mode;st.mode='Practice';
    try{original.render();}finally{st.mode=mode;}
    const page=document.querySelector('#pageContent');
    const interviewHeader=page?.querySelector('.welcome-row');
    const titleBlock=interviewHeader?.firstElementChild;
        if(st.stage==='mic_test') {
      const intro=page?.querySelector('.mic-test-top');

    }
    if(st.stage==='recording') {
      const editor=page?.querySelector('#transcriptEditor');
      const controls=editor?.previousElementSibling?.previousElementSibling;
      if(controls && !page.querySelector('.pato-live-status')) {
        const paused=!!st.recordingPaused;
        const live=document.createElement('div');live.className='pato-live-status'+(paused?' is-paused':'');
        live.innerHTML=paused
          ? '<span class="pato-live-dot" aria-hidden="true"></span><strong>Paused</strong><span>Transcript is saved. Resume when ready.</span>'
          : '<span class="pato-live-dot" aria-hidden="true"></span><strong>Listening</strong><span>Live transcription is on</span>';
        controls.insertBefore(live,controls.firstChild);
        const pause=document.createElement('button');pause.type='button';pause.className='secondary-btn pato-pause-recording';
        pause.textContent=paused?'▶ Resume':'Ⅱ Pause';
        pause.addEventListener('click',()=>paused?window.resumePatoInterviewRecording():window.pausePatoInterviewRecording());
        controls.appendChild(pause);
      }
    }
    const badge=document.querySelector('#pageContent .welcome-row .pill');if(badge)badge.textContent=mode.toUpperCase()+' MODE';
    drawMascot(st.stage==='recording'?'listening':st.stage==='evaluating'?'evaluating':ttsState.duckState);
    const header=document.querySelector('#pageContent .welcome-row p');
    if(header)header.textContent='Branching-Dialogue Scheme · 10 questions total, with one clear question at a time';
    const steps=document.createElement('ol');steps.className='pato-interview-steps';steps.setAttribute('aria-label','Interview progress');
    const names=['Mic check','Countdown','Interview','Scores'];
    const index=st.stage==='mic_test'?0:st.stage==='countdown'?1:2;
    steps.innerHTML=names.map((n,i)=>`<li ${i===index?'aria-current="step"':''}>${i+1}. ${n}</li>`).join('');
    document.querySelector('#pageContent .welcome-row')?.after(steps);
    const stageCopy = st.stage==='duck_speaking' ? ['Speaking','PATO is asking your question aloud.']
      : st.stage==='evaluating' ? ['Processing','Your transcript is being evaluated for this job role.']
      : st.stage==='ready_to_record' ? ['Ready','Start recording when you are ready to answer.']
      : st.stage==='turn_feedback' ? ['Feedback','Review the feedback before moving to the next question.'] : null;
    if(stageCopy && !page.querySelector('.pato-stage-status')) {
      const status=document.createElement('div');status.className='pato-stage-status';
      status.setAttribute('role','status');status.setAttribute('aria-live','polite');
      status.innerHTML=`<strong>${stageCopy[0]}</strong><span>${stageCopy[1]}</span>`;
      steps.after(status);
    }
    const next=document.querySelector('button[onclick="advanceToAdaptiveNextQuestion()"]');
    if(next)next.textContent=st.turnIndex===9?'Complete interview & view scores':'Continue to question '+(st.turnIndex+2);
    // Speech/idle markup may have been rebuilt while a voice is active.
    if(window.speechSynthesis?.speaking && !window.speechSynthesis.paused)drawMascot('speaking');
  };
  window.pausePatoInterviewRecording = function() {
    const st=interviewState;
    if(!active() || st?.stage!=='recording')return;
    st.recordingPaused=true;
    if(st.recordStartTime){st.recordDurationSec+=Math.max(1,Math.round((Date.now()-st.recordStartTime)/1000));st.recordStartTime=null;}
    if(recorder?.state==='recording')recorder.pause();
    if(typeof activeSpeechRec!=='undefined' && activeSpeechRec){activeSpeechRec.onend=null;try{activeSpeechRec.stop();}catch{}}
    st.pauseCount=(st.pauseCount||0)+1;
    renderInterview();
  };
  window.resumePatoInterviewRecording = function() {
    const st=interviewState;
    if(!active() || st?.stage!=='recording' || !st.recordingPaused)return;
    st.recordingPaused=false;st.recordStartTime=Date.now();
    if(recorder?.state==='paused')recorder.resume();
    if(typeof activeSpeechRec!=='undefined' && activeSpeechRec){
      activeSpeechRec.onend=()=>{if(interviewState && interviewState.stage==='recording' && !interviewState.recordingPaused){try{activeSpeechRec.start();}catch{}}};
      try{activeSpeechRec.start();}catch{}
    }
    renderInterview();
  };
})();
