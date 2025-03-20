'use client'
import React, { Component} from 'react';
import { FacebookProvider, CustomChat } from 'react-facebook';

export default class FacebookChat extends Component {
  render() {
    return (
      <FacebookProvider appId="1337734957440570" chatSupport>
        <CustomChat pageId="102108262516675" minimized={false}/>
      </FacebookProvider>    
    );
  }
}