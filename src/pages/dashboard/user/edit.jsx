import { useState, useEffect } from 'react';

import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

import { UserEditView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

const metadata = { title: `Kullanıcı Düzenle - ${CONFIG.appName}` };

export default function Page() {
  const { id = '' } = useParams();
  const [currentUser, setCurrentUser] = useState(null);
  const fetchImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      const timeout = setTimeout(() => resolve(''), 3000); // 3 saniye timeout
      img.onload = () => {
        clearTimeout(timeout);
        resolve(src);
      };
      img.onerror = () => {
        clearTimeout(timeout);
        resolve('');
      };
    });
  };
  
  const fetchImageSources = async (id) => {
    const sources = [`/user/${id}.png`, `/user/${id}.jpg`, `/user/${id}.jpeg`];
    const results = await Promise.allSettled(sources.map(fetchImage));
  
    // Başarılı olan ilk sonucu döndür
    const validImage = results.find((result) => result.status === 'fulfilled' && result.value);
    return validImage ? validImage.value : ''; // Eğer hiçbir resim yoksa boş döner
  };
  
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('jwtToken');
      try {
        const [imageSrc, userResponse] = await Promise.all([
          fetchImageSources(id), // Resim yüklemeleri
          fetch(`${CONFIG.apiUrl}/Organization/user?userId=${id}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }), // Kullanıcı bilgisi
        ]);
  
        if (!userResponse.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await userResponse.json();
        setCurrentUser({
          ...data,
          photoURL: imageSrc,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchData();
  }, [id]);

  return (
    <>
      <Helmet>
        <title> {metadata.title}</title>
      </Helmet>

      <UserEditView user={currentUser} userId={id} />
    </>
  );
}
