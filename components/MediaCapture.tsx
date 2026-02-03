
import React, { useState, useRef, useEffect } from 'react';

interface MediaCaptureProps {
  onCapture: (url: string, type: 'image' | 'video') => void;
  onCancel: () => void;
}

const MediaCapture: React.FC<MediaCaptureProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        setError("Não foi possível acessar a câmera. Verifique as permissões.");
      }
    }
    setupCamera();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const takePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const url = canvas.toDataURL('image/jpeg');
      onCapture(url, 'image');
    }
  };

  const startRecording = () => {
    if (stream) {
      setIsRecording(true);
      setRecordedChunks([]);
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) setRecordedChunks(prev => [...prev, e.data]);
      };
      recorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        onCapture(url, 'video');
      };
      mediaRecorderRef.current = recorder;
      recorder.start();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorderRef.current?.stop();
  };

  if (error) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={onCancel} className="text-blue-600 font-bold underline">Voltar</button>
      </div>
    );
  }

  return (
    <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-6">
        <button 
          onClick={onCancel}
          className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {!isRecording ? (
          <>
            <button 
              onClick={takePhoto}
              className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 shadow-xl active:scale-90 transition-transform flex items-center justify-center"
              title="Tirar Foto"
            >
              <div className="w-12 h-12 bg-white rounded-full border-2 border-gray-200" />
            </button>
            <button 
              onClick={startRecording}
              className="w-16 h-16 bg-red-600 rounded-full border-4 border-red-300 shadow-xl active:scale-90 transition-transform flex items-center justify-center"
              title="Gravar Vídeo"
            >
              <div className="w-6 h-6 bg-red-600 rounded-sm" />
            </button>
          </>
        ) : (
          <button 
            onClick={stopRecording}
            className="w-16 h-16 bg-white rounded-full border-4 border-red-500 shadow-xl active:scale-90 transition-transform flex items-center justify-center"
          >
            <div className="w-6 h-6 bg-red-600 rounded-sm animate-pulse" />
          </button>
        )}
      </div>

      {isRecording && (
        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
          <div className="w-2 h-2 bg-white rounded-full mr-2 animate-ping" />
          GRAVANDO
        </div>
      )}
    </div>
  );
};

export default MediaCapture;
