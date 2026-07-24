import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Volume2, VolumeX } from 'lucide-react';

const scenes = [
  "나는 어릴 때부터 혼자 있는 시간이 많았다.\n집에는 늘 식은 반찬과 짧은 메모뿐이었다.",
  "그래서 문밖에 네가 서 있으면\n괜스레 더 크게 웃었던 것 같다.\n“왔어?”",
  "우리는 특별한 일 없이도 매일을 함께했다.\n그냥 같이 있는 순간이 행복했다.",
  "나에게 넌 그냥 친구가 아니었다.\n슬플때나 기쁠때나 누구보다 먼저 떠오르는 사람.\n어쩌면 내 삶의 전부였을지도 모른다..",
  "나의 봄은 영원할거라고 믿었다.\n항상 너는 내 곁에 있었으니까.",
  "그런데 어느 날부터 네가 멀게 느껴졌다.\n눈을 피하고, 대화를 피하고, 결국 나는 버려졌다고 믿었다.",
  "“왜 나 피해?”\n목 끝까지 차오른 그 말은 결국 삼켜야만 했다.\n네가 '그냥'이라고 대답할까 봐 두려웠으니까.",
  "그래서 나는 먼저 멀어진 척했다.\n기다리지 않는 척, 상처받지 않은 척.",
  "고등학생이 되어서도 우리는 같은 공간에서,\n서로 모르는 사람처럼 스쳐 지나갔다.",
  "정말 그렇게 쉽게 끝날 사이였을까?\n나에게 넌 전부였는데..",
  "다시 누군가에게 기대면 또 버려질까 봐,\n나를 그 겨울에 가두고 말았다.",
  "그래도 버리지 못한 것들.\n낡은 책갈피, 첫눈 오는 날의 약속,\n그리고 아직도 선명한 너의 목소리.",
  "소중히 간직하던 그날의 모습이 잊혀질때 쯤.\n이별을 기다리는 겨울의 교실에서,\n너는 내게 말을 걸어온다.",
  "고개를 돌리면 예전처럼 흔들릴 것 같아,\n일부러 더 차갑게 말했다.\n“이제 와서 나한테 할 말이 있어?”",
  "쏀척을 해보았지만,\n사실 나는 항상 너의 손길만을 기다리고 있었다.",
  "네가 없는 빈자리에서 홀로 버텨야 했던 날들.\n아무렇지 않은 척 웃어 넘기려 해도, 매일 밤 소리 없이 무너져 내리던 시린 시간들.",
  "다시는 누군가에게 기대지 않겠다 다짐하면서도,\n결국엔 매번 네가 돌아오기만을 간절히 바랐던 길고 외로웠던 나의 겨울.",
  "그 모든 아픔을 따뜻하게 녹여내듯,\n마침내 우리의 두 번째 계절이 시작되려 한다."
];

export default function App() {
  const [current, setCurrent] = useState(0);
  const [isInitial, setIsInitial] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const isMutedByUserRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay may be blocked by the browser. 
        // We handle playing on the first user interaction.
      });
    }
  }, []);

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        isMutedByUserRef.current = true;
      } else {
        audioRef.current.play();
        isMutedByUserRef.current = false;
      }
      setIsPlaying(!isPlaying);
    }
  };

  const getImages = (index: number) => {
    // 15번째 씬(index 14)까지만 이미지를 렌더링하고 나머지는 null (검은 배경 또는 파란 배경)
    if (index >= 15) return null;
    const url = `https://pub-59a11d1a92c0405fa70a86806a5ade02.r2.dev/S${index + 1}.jpg`;
    return {
      pc: url,
      mobile: url
    };
  };

  const currentImages = getImages(current);

  const handleScreenClick = (e: React.MouseEvent) => {
    if (!hasStarted) return;

    if (audioRef.current && !isPlaying && !isMutedByUserRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }

    const screenWidth = window.innerWidth;
    // 화면의 왼쪽 1/3 클릭 시 이전, 나머지 중앙/오른쪽 클릭 시 다음
    if (e.clientX < screenWidth / 3) {
      prevScene();
    } else {
      nextScene();
    }
  };

  const nextScene = () => {
    setIsInitial(false);
    if (current < scenes.length - 1) {
      setCurrent(current + 1);
    }
  };

  const prevScene = () => {
    setIsInitial(false);
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasStarted) {
        if (e.key === ' ' || e.key === 'Enter') {
          setHasStarted(true);
          if (audioRef.current && !isPlaying && !isMutedByUserRef.current) {
            audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        }
        return;
      }

      if (audioRef.current && !isPlaying && !isMutedByUserRef.current) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') nextScene();
      if (e.key === 'ArrowLeft') prevScene();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [current, isPlaying, hasStarted]);

  return (
    <div 
      ref={containerRef}
      tabIndex={0}
      className="relative flex flex-col items-center justify-center min-h-screen w-full bg-zinc-950 text-zinc-200 overflow-hidden select-none cursor-pointer outline-none"
      onClick={handleScreenClick}
    >
      <audio 
        ref={audioRef} 
        src="https://pub-abbac3b23e994a62b0333051ea7d928e.r2.dev/Track%203%20-%20A%20lyrical%20song%2C%20with%20piano%20style%2C%20for%20a%20background.wav"
        loop
        autoPlay
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-[100] flex items-center space-x-3 bg-zinc-950/40 p-2 sm:p-3 rounded-full backdrop-blur-md">
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume} 
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          onClick={(e) => e.stopPropagation()}
          className="w-20 sm:w-24 accent-zinc-300 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
        />
        <button 
          onClick={toggleAudio} 
          className="text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer outline-none"
          aria-label="음량 조절"
        >
          {isPlaying && volume > 0 ? <Volume2 size={22} /> : <VolumeX size={22} />}
        </button>
      </div>

      <style>{`
        .font-serif {
          font-family: 'Noto Serif KR', serif;
        }
      `}</style>
      
      <AnimatePresence mode="wait">
        {currentImages ? (
          <motion.div
            key={`bg-${current}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* 배경 블러 효과 */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <picture>
                <source media="(min-width: 768px)" srcSet={currentImages.pc} />
                <img src={currentImages.mobile} alt="" className="w-full h-full object-cover blur-[40px] opacity-25 scale-125" />
              </picture>
              <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/30 via-zinc-950/60 to-zinc-950" />
            </div>
            
            {/* 메인 이미지 프레임 */}
            <div className="absolute inset-0 z-0 flex items-start justify-center p-6 sm:p-12 pt-6 sm:pt-8 pb-28 sm:pb-40">
              <picture className="w-full h-full max-w-6xl max-h-[75vh] flex items-center justify-center">
                <source media="(min-width: 768px)" srcSet={currentImages.pc} />
                <img 
                  src={currentImages.mobile} 
                  alt="" 
                  className="w-full h-full object-contain rounded-sm shadow-[0_4px_40px_rgba(0,0,0,0.6)] opacity-90" 
                />
              </picture>
            </div>

            {/* 가독성을 위한 하단 그라데이션 오버레이 */}
            <div className="absolute inset-x-0 bottom-0 h-[65vh] z-[5] bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent pointer-events-none" />
          </motion.div>
        ) : current === 17 ? (
          <motion.div
            key="bg-blue-bright"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, delay: 1.5 }}
            className="absolute inset-0 pointer-events-none overflow-hidden flex flex-col items-center justify-center"
          >
            {/* 교체된 배경 이미지 */}
            <div className="absolute inset-0 z-0">
              <img 
                src="https://pub-59a11d1a92c0405fa70a86806a5ade02.r2.dev/back.jpg" 
                alt="Background" 
                className="w-full h-full object-cover sm:object-cover" 
              />
            </div>

            {/* 중앙 타이틀 이미지 */}
            <motion.div
              className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 3, delay: 2.5, ease: "easeOut" }}
            >
              <img src="https://pub-59a11d1a92c0405fa70a86806a5ade02.r2.dev/title.png" alt="Title" className="w-[90%] sm:w-[140%] md:w-[120%] lg:w-[100%] max-w-[1600px] h-auto drop-shadow-2xl" />
            </motion.div>

            {/* 텍스트 가독성을 위한 하단 오버레이 */}
            <div className="absolute inset-x-0 bottom-0 h-[45vh] z-[5] bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent pointer-events-none" />
          </motion.div>
        ) : (
          <motion.div
            key="bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none" 
            style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 70%)' }}
          />
        )}
      </AnimatePresence>

      <div className="absolute bottom-22 sm:bottom-20 w-full max-w-4xl px-6 sm:px-12 z-20 flex flex-col items-center justify-end min-h-[150px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: isInitial ? 15 : 10, filter: isInitial ? 'blur(8px)' : 'blur(4px)' }}
            animate={
              current === 17 
                ? { opacity: [0, 1, 1, 0], y: [10, 0, 0, -15], filter: ['blur(4px)', 'blur(0px)', 'blur(0px)', 'blur(8px)'] } 
                : { opacity: 1, y: 0, filter: 'blur(0px)' }
            }
            exit={{ opacity: 0, y: isInitial ? -15 : -10, filter: isInitial ? 'blur(8px)' : 'blur(4px)' }}
            transition={
              current === 17 
                ? { duration: 8.5, times: [0, 0.1, 0.85, 1], ease: "easeInOut" } 
                : { duration: isInitial ? 1.1 : 0.4, ease: [0.25, 0.1, 0.25, 1] }
            }
            className="text-center font-serif relative"
          >
            {/* 텍스트 배경 가독성 보완 (블러 + 어두운 오버레이) */}
            <div className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm -m-6 sm:-m-10 rounded-2xl -z-10 shadow-[0_0_40px_rgba(0,0,0,0.6)] pointer-events-none" />

            {scenes[current].split('\n').map((line, i) => (
              <p 
                key={i} 
                className={`text-zinc-50 leading-[1.6] sm:leading-[1.7] ${line === '' ? 'h-3 sm:h-5' : 'mb-2 sm:mb-3'} text-[17px] sm:text-lg md:text-xl font-light tracking-wide break-keep`}
                style={{ textShadow: '0 2px 24px rgba(0,0,0,1), 0 0 10px rgba(0,0,0,0.8)' }}
              >
                {line}
              </p>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {!hasStarted && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-[200] flex flex-col items-center justify-center bg-zinc-950 text-zinc-300 cursor-pointer"
            onClick={() => {
              setHasStarted(true);
              if (audioRef.current && !isPlaying && !isMutedByUserRef.current) {
                audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
              }
            }}
          >
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <p className="text-lg sm:text-xl font-light tracking-widest mb-6">화면을 클릭하거나 터치하여 시작하세요</p>
              <p className="text-xs sm:text-sm text-zinc-500 tracking-wider">방향키(←, →) 또는 스페이스바로 조작할 수 있습니다</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-8 sm:bottom-12 left-0 w-full flex justify-between px-6 sm:px-12 pointer-events-none text-zinc-600">
        <div className="flex space-x-8 pointer-events-auto">
          <button 
            onClick={(e) => { e.stopPropagation(); prevScene(); }} 
            className={`p-2 transition-opacity duration-500 hover:text-zinc-300 ${current === 0 ? 'opacity-0 cursor-default' : 'opacity-100 cursor-pointer'}`}
            disabled={current === 0}
            aria-label="이전"
          >
            <ChevronLeft size={24} />
          </button>
        </div>
        
        <div className="flex space-x-1.5 sm:space-x-2 items-center">
          {scenes.map((_, i) => (
            <div 
              key={i} 
              className={`h-[3px] sm:h-1 rounded-full transition-all duration-700 ${current === i ? 'w-4 sm:w-6 bg-zinc-400' : 'w-1 sm:w-1.5 bg-zinc-800'}`} 
            />
          ))}
        </div>

        <div className="flex space-x-8 pointer-events-auto">
          <button 
            onClick={(e) => { e.stopPropagation(); nextScene(); }} 
            className={`p-2 transition-opacity duration-500 hover:text-zinc-300 ${current === scenes.length - 1 ? 'opacity-0 cursor-default' : 'opacity-100 cursor-pointer'}`}
            disabled={current === scenes.length - 1}
            aria-label="다음"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
