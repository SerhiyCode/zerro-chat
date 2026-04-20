import { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';

function App() {
  const [text, setText] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const triggerSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    const { error } = await supabase.from('messages').insert([{ text, room_id: 'secret-123' }]);
    if (!error) { setText(''); triggerSuccess(); }
  };

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const fileName = `${Math.random()}.${file.name.split('.').pop()}`;
    const { data } = await supabase.storage.from('chat-media').upload(fileName, file);
    if (data) {
      const { data: urlData } = supabase.storage.from('chat-media').getPublicUrl(fileName);
      await supabase.from('messages').insert([{ file_url: urlData.publicUrl, file_type: 'image', room_id: 'secret-123' }]);
      triggerSuccess();
    }
    setIsUploading(false);
  };

  const styles = {
    screen: {
      backgroundColor: '#000000',
      minHeight: '100vh',
      width: '100%',
      padding: isMobile ? '20px 10px' : '40px 20px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      fontFamily: 'sans-serif',
      boxSizing: 'border-box' as const,
      overflowX: 'hidden' as const,
    },
    title: {
      color: '#3b82f6',
      fontSize: isMobile ? '28px' : '48px',
      fontWeight: '900',
      marginBottom: '20px',
      textAlign: 'center' as const,
      textTransform: 'uppercase' as const,
    },
    container: {
      width: '100%',
      maxWidth: '900px',
      backgroundColor: '#111827',
      padding: isMobile ? '15px' : '30px',
      borderRadius: isMobile ? '25px' : '40px',
      border: '2px solid #374151',
      boxSizing: 'border-box' as const,
    },
    textarea: {
      width: '100%',
      minHeight: isMobile ? '200px' : '350px',
      backgroundColor: '#000000',
      color: '#ffffff',
      fontSize: isMobile ? '25px' : '44px',  
      fontWeight: 'bold',
      padding: '10px',
      borderRadius: '20px',
      border: '4px solid #3b82f6',
      outline: 'none',
      resize: 'none' as const,
      boxSizing: 'border-box' as const,
      lineHeight: '1.2',
    },
    buttonRow: {
      display: 'flex',
      flexDirection: isMobile ? 'column' as const : 'row' as const, // Кнопки в стовпчик на мобілці
      gap: '15px',
      marginTop: '20px',
    },
    photoBtn: {
      backgroundColor: '#374151',
      color: 'white',
      padding: '10px',
      borderRadius: '20px',
      cursor: 'pointer',
      textAlign: 'center' as const,
      fontSize: '20px',
      fontWeight: 'bold',
      border: '2px solid #4b5563',
    },
    sendBtn: {
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '10px',
      borderRadius: '10px',
      border: 'none',
      cursor: 'pointer',
      fontSize: isMobile ? '24px' : '32px',
      fontWeight: '700',
      boxShadow: '0 8px 0 #1d4ed8',
    },
    success: {
      position: 'fixed' as const,
      top: '10px',
      width: '80%',
      left: '10%',
      backgroundColor: '#10b981',
      color: 'white',
      padding: '15px',
      borderRadius: '15px',
      fontSize: '18px',
      fontWeight: 'bold',
      textAlign: 'center' as const,
      zIndex: 1000,
    }
  };

  return (
    <div style={styles.screen}>
      {showSuccess && <div style={styles.success}>✅Отправлено!</div>}
      <h1 style={styles.title}> 0-Нулевая терпимость</h1>
      <div style={styles.container}>
        <textarea 
          value={text} 
          onChange={(e) => setText(e.target.value)}
          placeholder=" Пишите здесь ..."
          style={styles.textarea}
        />

        <div style={styles.buttonRow}>
          <label style={styles.photoBtn}>
            {isUploading ? "⏳..." : "🖼️ ДОБАВИТЬ ФОТО"}
            <input type="file" accept="image/*" onChange={uploadImage} style={{ display: 'none' }} />
          </label>

          <button onClick={sendMessage} style={styles.sendBtn}>
            ОТПРАВИТЬ🚀
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;