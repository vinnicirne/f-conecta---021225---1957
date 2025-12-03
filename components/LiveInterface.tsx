import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, Activity, Radio, Volume2 } from 'lucide-react';
import { createBlob, decode, decodeAudioData } from '../utils/audioUtils';

export const LiveInterface: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0);
  const [status, setStatus] = useState<string>('Ready to connect');
  
  // Refs for audio processing and connection persistence
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Visualizer animation frame
  const animationFrameRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (outputContextRef.current) {
      outputContextRef.current.close();
      outputContextRef.current = null;
    }
    
    // Stop all playing audio sources
    activeSourcesRef.current.forEach(source => {
        try { source.stop(); } catch(e) {}
    });
    activeSourcesRef.current.clear();

    // Ideally close session here, but SDK doesn't expose easy close method on promise directly
    // relying on component unmount behavior mostly.
    
    setIsConnected(false);
    setVolume(0);
    setStatus('Disconnected');
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [cleanup]);

  const toggleConnection = async () => {
    if (isConnected) {
      cleanup();
      return;
    }

    try {
      setStatus('Initializing Audio...');
      
      // Initialize Audio Contexts
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      audioContextRef.current = inputCtx;
      outputContextRef.current = outputCtx;
      nextStartTimeRef.current = 0;

      setStatus('Requesting Microphone...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      setStatus('Connecting to Gemini...');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are a helpful, concise AI assistant. Respond naturally.',
        },
        callbacks: {
          onopen: () => {
            setStatus('Connected - Listening');
            setIsConnected(true);
            
            // Setup input streaming
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              if (isMuted) return; // Simple software mute
              
              const inputData = e.inputBuffer.getChannelData(0);
              
              // Visualizer logic (simple volume meter)
              let sum = 0;
              for(let i=0; i<inputData.length; i++) sum += inputData[i] * inputData[i];
              setVolume(Math.sqrt(sum / inputData.length));

              const pcmBlob = createBlob(inputData);
              
              sessionPromiseRef.current?.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);
            
            sourceRef.current = source;
            processorRef.current = processor;
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Model Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            
            if (base64Audio && outputCtx) {
              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                outputCtx,
                24000,
                1
              );
              
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              
              // Schedule playback
              // Ensure nextStartTime is at least currentTime to avoid overlapping previous delayed chunks
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              
              activeSourcesRef.current.add(source);
              source.onended = () => activeSourcesRef.current.delete(source);
            }

            // Handle Interruption
            if (message.serverContent?.interrupted) {
              console.log("Interrupted!");
              activeSourcesRef.current.forEach(src => {
                try { src.stop(); } catch(e) {}
              });
              activeSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            setStatus('Connection closed');
            setIsConnected(false);
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
            setStatus('Error occurred');
            setIsConnected(false);
          }
        }
      });

      sessionPromiseRef.current = sessionPromise;

    } catch (error) {
      console.error("Connection failed:", error);
      setStatus(`Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      cleanup();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-nexus-900 relative overflow-hidden">
      
      {/* Background Ambient Effect */}
      <div className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none ${isConnected ? 'opacity-30' : 'opacity-0'}`}>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[100px] animate-pulse-slow"></div>
      </div>

      <div className="z-10 flex flex-col items-center gap-8 p-8 max-w-lg w-full">
        
        {/* Status Display */}
        <div className={`
          flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md transition-colors
          ${isConnected 
            ? 'bg-green-500/10 border-green-500/30 text-green-400' 
            : 'bg-gray-800/50 border-gray-700 text-gray-400'}
        `}>
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
          <span className="text-sm font-mono font-medium">{status}</span>
        </div>

        {/* Visualizer / Avatar */}
        <div className="relative group">
          <div className={`
            w-48 h-48 rounded-full border-4 flex items-center justify-center transition-all duration-300
            ${isConnected 
              ? 'border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.3)] bg-nexus-800' 
              : 'border-gray-700 bg-nexus-800/50'}
          `}>
             {/* Dynamic scaling based on volume */}
             <div 
                className="absolute inset-0 bg-blue-500 rounded-full opacity-20 transition-transform duration-75"
                style={{ transform: `scale(${1 + volume * 5})` }}
             ></div>
             
             <Activity size={64} className={`${isConnected ? 'text-blue-400' : 'text-gray-600'}`} />
          </div>
          
          {/* Wave Animation Overlay */}
          {isConnected && (
             <div className="absolute -inset-4 border border-blue-500/20 rounded-full animate-[spin_4s_linear_infinite_reverse]"></div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button
            onClick={toggleConnection}
            className={`
              p-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl
              ${isConnected 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' 
                : 'bg-nexus-accent hover:bg-blue-600 text-white shadow-blue-500/20'}
            `}
          >
            {isConnected ? <MicOff size={32} /> : <Mic size={32} />}
          </button>
          
          {isConnected && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`
                p-4 rounded-full border transition-all duration-200
                ${isMuted 
                  ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                  : 'bg-nexus-800 border-gray-600 text-gray-300 hover:text-white'}
              `}
            >
              {isMuted ? <Volume2 size={24} className="opacity-50" /> : <Radio size={24} />}
            </button>
          )}
        </div>

        <p className="text-center text-gray-500 text-sm max-w-xs leading-relaxed">
          {isConnected 
            ? "Live session active. Speak naturally to the AI. Interruptions are handled automatically." 
            : "Connect to start a low-latency, real-time voice conversation powered by Gemini 2.5."}
        </p>

      </div>
    </div>
  );
};