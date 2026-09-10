import React, { useEffect, useMemo, useState } from "react";
import { Volume2, VolumeX, Pause, RotateCcw, Home, Trophy, BookOpen, Settings, Play, ChevronRight, X } from "lucide-react";

const STAGES = [
  { name:"Ones", short:"ONES", description:"Toss one stone and pick up one stone at a time.", target:1 },
  { name:"Twos", short:"TWOS", description:"Toss one stone and pick up two stones at a time.", target:2 },
  { name:"Threes + One", short:"3 + 1", description:"Pick up three stones, then the remaining one.", target:3 },
  { name:"Sweeping", short:"SWEEP", description:"Sweep all four ground stones during one toss.", target:4 },
  { name:"Placing", short:"PLACE", description:"Place four stones down, then sweep them back up.", target:4 },
  { name:"Exchanging", short:"EXCHANGE", description:"Exchange ground stones with the airborne stone.", target:1 },
  { name:"Two + Catch", short:"2 + CATCH", description:"Toss two stones, pick one up, and catch both.", target:1 },
  { name:"Final Challenge", short:"FINAL", description:"Toss the selected stone, sweep four, and catch.", target:4 }
];

const INITIAL_STONES = () => [
  {id:0,x:22,y:55,r:-8,held:false},
  {id:1,x:38,y:65,r:12,held:false},
  {id:2,x:55,y:51,r:-15,held:false},
  {id:3,x:69,y:68,r:9,held:false},
  {id:4,x:80,y:48,r:-4,held:false}
];

function loadStats(){
  try { return JSON.parse(localStorage.getItem("anchangal-stats")) || {best:0,games:0}; }
  catch { return {best:0,games:0}; }
}

function App(){
  const [screen,setScreen]=useState("menu");
  const [stage,setStage]=useState(0);
  const [score,setScore]=useState(0);
  const [mistakes,setMistakes]=useState(0);
  const [catches,setCatches]=useState(0);
  const [perfect,setPerfect]=useState(0);
  const [stones,setStones]=useState(INITIAL_STONES);
  const [active,setActive]=useState(null);
  const [airborne,setAirborne]=useState(false);
  const [picked,setPicked]=useState([]);
  const [message,setMessage]=useState("");
  const [paused,setPaused]=useState(false);
  const [sound,setSound]=useState(()=>localStorage.getItem("anchangal-sound")!=="off");
  const [playerCount,setPlayerCount]=useState(1);
  const [players,setPlayers]=useState([{name:"Player 1",stage:0,score:0}]);
  const [currentPlayer,setCurrentPlayer]=useState(0);
  const [stats,setStats]=useState(loadStats);
  const [modal,setModal]=useState(null);

  useEffect(()=>localStorage.setItem("anchangal-sound",sound?"on":"off"),[sound]);

  const stageInfo=STAGES[stage];
  const progress=Math.round((stage/8)*100);

  function resetStage(){
    setStones(INITIAL_STONES());
    setActive(null); setAirborne(false); setPicked([]); setMessage(""); setPaused(false);
  }

  function startGame(){
    const ps=Array.from({length:playerCount},(_,i)=>({name:`Player ${i+1}`,stage:0,score:0}));
    setPlayers(ps); setCurrentPlayer(0); setStage(0); setScore(0); setMistakes(0); setCatches(0); setPerfect(0);
    resetStage(); setScreen("game");
  }

  function finishStage(){
    const bonus=100;
    setScore(s=>s+bonus);
    setPlayers(p=>p.map((x,i)=>i===currentPlayer?{...x,score:x.score+bonus,stage:Math.min(8,x.stage+1)}:x));
    setPerfect(p=>p+1);
    setMessage("✓ STAGE COMPLETE");
    setTimeout(()=>{
      if(stage===7){
        const finalScore=score+bonus+500;
        setScore(finalScore);
        const next={...stats,best:Math.max(stats.best,finalScore),games:stats.games+1};
        setStats(next); localStorage.setItem("anchangal-stats",JSON.stringify(next));
        setScreen("victory");
      } else {
        const nextStage=stage+1;
        setStage(nextStage);
        resetStage();
        setMessage(`STAGE ${nextStage+1}: ${STAGES[nextStage].short}`);
      }
    },850);
  }

  function fail(reason="MISS!"){
    setMistakes(m=>m+1); setScore(s=>Math.max(0,s-10));
    setMessage(`✕ ${reason}`);
    setAirborne(false); setActive(null); setPicked([]);
    setTimeout(()=>setMessage("TURN OVER — RESUME THIS STAGE NEXT TURN"),900);
  }

  function toss(id){
    if(paused || airborne) return;
    const s=stones.find(x=>x.id===id);
    if(!s || s.held) return;
    setActive(id); setAirborne(true); setMessage("TOSS! PICK UP THE REQUIRED STONES");
    // Automatic arc animation is visual; player still performs the ground action.
    setTimeout(()=>setMessage("CATCH WINDOW"),900);
    setTimeout(()=>{ if(!airborne) return; },1300);
  }

  function pickup(id){
    if(paused) return;
    if(!airborne){ setMessage("TOSS A STONE FIRST"); return; }
    if(id===active){ setMessage("THAT IS THE AIRBORNE STONE"); return; }
    if(picked.includes(id)) return;

    const next=[...picked,id];
    setPicked(next);
    setStones(ss=>ss.map(s=>s.id===id?{...s,held:true}:s));
    const needed = stage===2 ? 3 : stage===3 || stage===4 || stage===7 ? 4 : stageInfo.target;

    if(next.length>=needed) setMessage("NOW CATCH THE AIRBORNE STONE");
    else setMessage(`PICK UP ${needed-next.length} MORE`);
  }

  function catchActive(){
    if(paused) return;
    if(!airborne){ setMessage("NO STONE TO CATCH"); return; }
    const needed = stage===2 ? 3 : stage===3 || stage===4 || stage===7 ? 4 : stageInfo.target;
    if(picked.length<needed){
      fail(`YOU NEEDED ${needed} STONE${needed>1?"S":""}`);
      return;
    }
    setAirborne(false); setCatches(c=>c+1); setScore(s=>s+30);
    setMessage("✓ PERFECT CATCH");
    setTimeout(()=>finishStage(),450);
  }

  function specialAction(){
    if(stage===4){
      setAirborne(true); setActive(0); setPicked([1,2,3,4]);
      setStones(s=>s.map(x=>x.id===0?x:{...x,held:true}));
      setMessage("FOUR PLACED — NOW CATCH");
    } else if(stage===5){
      setMessage("EXCHANGE MODE — PICK A GROUND STONE");
      setAirborne(true); setActive(active??0);
    } else if(stage===6){
      if(!airborne){ setActive(0); setAirborne(true); setMessage("TWO STONES ARE AIRBORNE"); }
      else { setPicked([1]); setMessage("CATCH BOTH FALLING STONES"); }
    } else if(stage===7){
      const selected=Math.floor(Math.random()*5);
      setActive(selected); setAirborne(true);
      setMessage(`OPPONENT CHOSE STONE ${selected+1} — SWEEP FOUR`);
    }
  }

  const stageInstruction=useMemo(()=>{
    if(stage===0) return "Toss one stone → pick up 1 → catch.";
    if(stage===1) return "Toss one stone → pick up 2 → catch.";
    if(stage===2) return "Toss → pick up 3 → catch → repeat for the last stone.";
    if(stage===3) return "Toss → sweep all 4 stones → catch.";
    if(stage===4) return "Place four stones → catch → toss again → sweep four.";
    if(stage===5) return "Toss → exchange with a ground stone → catch.";
    if(stage===6) return "Toss two → pick one → catch both.";
    return "Toss the chosen stone → sweep four → catch.";
  },[stage]);

  return <div className="app">
    {screen==="menu" && <Menu
      onPlay={()=>setScreen("setup")}
      onRules={()=>setModal("rules")}
      onLeaderboard={()=>setModal("leaderboard")}
      onSettings={()=>setModal("settings")}
      stats={stats}
    />}
    {screen==="setup" && <Setup playerCount={playerCount} setPlayerCount={setPlayerCount} onStart={startGame} onBack={()=>setScreen("menu")}/>}
    {screen==="game" && <Game
      stage={stage} stageInfo={stageInfo} score={score} mistakes={mistakes} catches={catches}
      perfect={perfect} stones={stones} active={active} airborne={airborne} picked={picked}
      message={message} paused={paused} setPaused={setPaused} sound={sound} setSound={setSound}
      stageInstruction={stageInstruction} onToss={toss} onPickup={pickup} onCatch={catchActive}
      onSpecial={specialAction} onReset={resetStage} onHome={()=>setScreen("menu")}
      currentPlayer={currentPlayer} playerCount={playerCount}
    />}
    {screen==="victory" && <Victory score={score} mistakes={mistakes} catches={catches} perfect={perfect} onAgain={startGame} onHome={()=>setScreen("menu")}/>}
    {modal==="rules" && <Rules onClose={()=>setModal(null)}/>}
    {modal==="leaderboard" && <Leaderboard stats={stats} setStats={setStats} onClose={()=>setModal(null)}/>}
    {modal==="settings" && <SettingsModal sound={sound} setSound={setSound} stats={stats} setStats={setStats} onClose={()=>setModal(null)}/>}
  </div>
}

function Menu({onPlay,onRules,onLeaderboard,onSettings,stats}){
  return <main className="menu screen">
    <div className="motif">✦</div>
    <p className="eyebrow">A TRADITIONAL SOUTH INDIAN GAME</p>
    <h1>ANCHANGAL</h1><div className="subtitle">FIVE STONES</div>
    <p className="tagline">Skill · Timing · Precision</p>
    <div className="hero-stones">{[0,1,2,3,4].map(i=><div className="stone hero" key={i} style={{"--i":i}}/>)}</div>
    <div className="menu-actions">
      <button className="primary" onClick={onPlay}><Play size={18}/> PLAY GAME</button>
      <button onClick={onRules}><BookOpen size={18}/> HOW TO PLAY</button>
      <button onClick={onLeaderboard}><Trophy size={18}/> LEADERBOARD <span className="best">{stats.best}</span></button>
      <button onClick={onSettings}><Settings size={18}/> SETTINGS</button>
    </div>
    <p className="tiny">Best score: {stats.best} · Games: {stats.games}</p>
  </main>
}

function Setup({playerCount,setPlayerCount,onStart,onBack}){
  return <main className="setup screen">
    <button className="icon-btn" onClick={onBack}><Home size={20}/></button>
    <div className="card setup-card">
      <p className="eyebrow">GET READY</p><h2>Choose Players</h2>
      <p className="muted">Single player is fully skill-based. Multiplayer turns share the same eight-stage progression.</p>
      <div className="player-grid">{[1,2,3,4].map(n=><button className={playerCount===n?"selected":""} onClick={()=>setPlayerCount(n)} key={n}>{n}<small>{n===1?"PLAYER":"PLAYERS"}</small></button>)}</div>
      <div className="preview"><div className="mini-stones">{[0,1,2,3,4].map(i=><div className="stone" key={i}/>)}</div><strong>5 STONES · 8 STAGES</strong><span>Complete every stage to win.</span></div>
      <button className="primary wide" onClick={onStart}>START GAME <ChevronRight size={19}/></button>
    </div>
  </main>
}

function Game(p){
  return <main className="game screen">
    <header className="hud">
      <div><span className="label">PLAYER</span><strong>{p.currentPlayer+1}</strong></div>
      <div><span className="label">STAGE</span><strong>{p.stage+1}<small>/8</small></strong></div>
      <div className="stage-name"><span className="label">{p.stageInfo.short}</span><strong>{p.stageInfo.name}</strong></div>
      <div><span className="label">SCORE</span><strong>{p.score}</strong></div>
      <div className="hud-actions">
        <button onClick={()=>p.setSound(!p.sound)} aria-label="Sound">{p.sound?<Volume2/>:<VolumeX/>}</button>
        <button onClick={()=>p.setPaused(true)} aria-label="Pause"><Pause/></button>
      </div>
    </header>
    <div className="progress"><span style={{width:`${((p.stage)/8)*100+12.5}%`}}/></div>
    <section className="play-area">
      <div className="stage-banner"><b>STAGE {p.stage+1}</b><span>{p.stageInstruction}</span></div>
      <div className="ground">
        <div className="grain g1"/><div className="grain g2"/><div className="grain g3"/>
        {p.stones.map(s=><button
          key={s.id}
          className={`stone game-stone ${s.held?"held":""} ${p.active===s.id&&p.airborne?"airborne":""}`}
          style={{left:`${s.x}%`,top:`${s.y}%`,transform:`rotate(${s.r}deg)`}}
          onClick={()=>p.airborne ? p.onPickup(s.id) : p.onToss(s.id)}
          aria-label={`Stone ${s.id+1}`}
        ><span>{s.id+1}</span></button>)}
        {p.airborne && <div className="catch-zone" onClick={p.onCatch}>CATCH</div>}
      </div>
      <div className="instruction">
        <strong>{p.message || p.stageInfo.description}</strong>
        <div className="action-row">
          {(p.stage>=3) && <button onClick={p.onSpecial}>PERFORM STAGE ACTION</button>}
          <button onClick={p.onCatch} className="catch-btn">CATCH / COMPLETE ACTION</button>
        </div>
        <small>Tip: Click a stone to toss it. While airborne, click ground stones to pick them up. Then click CATCH.</small>
      </div>
    </section>
    <footer className="game-footer">
      <span>Picked: {p.picked.length}</span><span>Successful catches: {p.catches}</span><span>Mistakes: {p.mistakes}</span>
      <button onClick={p.onReset}><RotateCcw size={16}/> Restart Stage</button>
    </footer>
    {p.paused && <div className="overlay"><div className="pause-card card"><button className="close" onClick={()=>p.setPaused(false)}><X/></button><p className="eyebrow">PAUSED</p><h2>Game Paused</h2><button className="primary wide" onClick={()=>p.setPaused(false)}>RESUME</button><button className="wide" onClick={p.onReset}>RESTART STAGE</button><button className="wide" onClick={p.onHome}>QUIT GAME</button></div></div>}
  </main>
}

function Victory({score,mistakes,catches,perfect,onAgain,onHome}){
  return <main className="victory screen"><div className="confetti">✦ ✧ ✦ ✧ ✦</div><p className="eyebrow">THE EIGHT STAGES ARE COMPLETE</p><h1>ANCHANGAL<br/><span>COMPLETE!</span></h1><div className="trophy">🏆</div>
    <div className="stats"><div><b>{score}</b><span>FINAL SCORE</span></div><div><b>{perfect}</b><span>PERFECT STAGES</span></div><div><b>{catches}</b><span>CATCHES</span></div><div><b>{mistakes}</b><span>MISTAKES</span></div></div>
    <div className="menu-actions"><button className="primary" onClick={onAgain}><Play/> PLAY AGAIN</button><button onClick={onHome}><Home/> MAIN MENU</button></div>
  </main>
}

function Rules({onClose}){
  return <div className="overlay"><div className="rules card"><button className="close" onClick={onClose}><X/></button><p className="eyebrow">THE EIGHT STAGES</p><h2>How to Play</h2><div className="rules-list">{STAGES.map((s,i)=><article key={i}><div className="num">{i+1}</div><div><b>{s.name}</b><p>{s.description}</p></div></article>)}</div><p className="muted">A mistake ends the current turn. Your progress is retained, so you resume from the exact stage where you failed.</p></div></div>
}

function Leaderboard({stats,setStats,onClose}){
  function resetLeaderboard(){
    const empty={best:0,games:0};
    localStorage.setItem("anchangal-stats",JSON.stringify(empty));
    setStats(empty);
  }

  return <div className="overlay">
    <div className="rules card">
      <button className="close" onClick={onClose}><X/></button>
      <p className="eyebrow">HALL OF FAME</p>
      <h2>Leaderboard</h2>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"15px",margin:"24px 0"}}>
        <div style={{background:"#f3e4cf",padding:"20px",borderRadius:"14px",textAlign:"center"}}>
          <b style={{fontSize:"36px",color:"#5a321f",display:"block"}}>{stats.best}</b>
          <span style={{fontSize:"11px",letterSpacing:"0.1em",color:"#8b715c",fontWeight:800}}>ALL-TIME HIGH SCORE</span>
        </div>
        <div style={{background:"#f3e4cf",padding:"20px",borderRadius:"14px",textAlign:"center"}}>
          <b style={{fontSize:"36px",color:"#5a321f",display:"block"}}>{stats.games}</b>
          <span style={{fontSize:"11px",letterSpacing:"0.1em",color:"#8b715c",fontWeight:800}}>GAMES PLAYED</span>
        </div>
      </div>
      <div style={{display:"flex",justify:"space-between",alignItems:"center",marginTop:"20px"}}>
        <button onClick={resetLeaderboard} style={{fontSize:"12px",padding:"9px 14px",color:"#a33"}}><RotateCcw size={14}/> Reset Leaderboard</button>
        <button className="primary" onClick={onClose}>Close</button>
      </div>
    </div>
  </div>
}

function SettingsModal({sound,setSound,stats,setStats,onClose}){
  function resetAllData(){
    const empty={best:0,games:0};
    localStorage.setItem("anchangal-stats",JSON.stringify(empty));
    setStats(empty);
  }

  return <div className="overlay">
    <div className="rules card">
      <button className="close" onClick={onClose}><X/></button>
      <p className="eyebrow">PREFERENCES</p>
      <h2>Settings</h2>
      
      <div style={{display:"flex",flexDirection:"column",gap:"16px",margin:"24px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#f3e4cf",padding:"16px 20px",borderRadius:"14px"}}>
          <div>
            <strong style={{display:"block",fontSize:"15px",color:"#4e3020"}}>Audio / Sound Effects</strong>
            <small style={{color:"#7c6754"}}>Toggle game sounds</small>
          </div>
          <button onClick={()=>setSound(!sound)} style={{minWidth:"120px"}}>
            {sound ? <Volume2 size={18}/> : <VolumeX size={18}/>}
            {sound ? "Sound: ON" : "Sound: OFF"}
          </button>
        </div>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#f3e4cf",padding:"16px 20px",borderRadius:"14px"}}>
          <div>
            <strong style={{display:"block",fontSize:"15px",color:"#4e3020"}}>Reset Saved Stats</strong>
            <small style={{color:"#7c6754"}}>Clear high score and games history</small>
          </div>
          <button onClick={resetAllData} style={{color:"#b33"}}>
            <RotateCcw size={16}/> Clear Data
          </button>
        </div>

        <div style={{background:"#f3e4cf",padding:"16px 20px",borderRadius:"14px"}}>
          <strong style={{display:"block",fontSize:"15px",color:"#4e3020"}}>About Anchangal</strong>
          <small style={{color:"#7c6754",display:"block",marginTop:"4px"}}>Version 1.0.0 Desktop App · Traditional South Indian Five Stones Game</small>
        </div>
      </div>

      <div style={{display:"flex",justifyContent:"flex-end",marginTop:"15px"}}>
        <button className="primary" onClick={onClose}>Done</button>
      </div>
    </div>
  </div>
}

export default App;