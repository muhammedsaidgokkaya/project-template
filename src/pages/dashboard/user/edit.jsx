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
      img.onload = () => resolve(src);
      img.onerror = () => resolve('');
    });
  };
  
  useEffect(() => {
    const fetchData = async () => {
      const imageSrc = await Promise.any([
        fetchImage(`/user/${id}.png`),
        fetchImage(`/user/${id}.jpg`),
        fetchImage(`/user/${id}.jpeg`)
      ]);
  
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await fetch(`${CONFIG.apiUrl}/Organization/user?userId=${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
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
