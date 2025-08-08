import React from 'react';
import { useLocation } from 'wouter';
import MiniGames from './mini-games';

export default function GamesPage() {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    setLocation('/');
  };

  return <MiniGames onBack={handleBack} />;
}