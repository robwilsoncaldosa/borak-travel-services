'use client'
import React from 'react';
import { FacebookProvider, CustomChat } from 'react-facebook';

export const FacebookChat = () => {
  return (
    <FacebookProvider appId="1337734957440570" chatSupport>
      <CustomChat pageId="102108262516675" minimized={false}/>
    </FacebookProvider>    
  );
}