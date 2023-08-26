'use client';
import StoredSetting from '@/components/StoredSetting';
import TokenGenerator from '@/components/TokenGenerator';
import { DatabaseEvent, Item } from '@/lib/Database';
import { db } from '@/lib/utils';

import { TokenSettings } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function Home() {
  const [storedSettings, setStoredSettings] = useState<Item<TokenSettings>[]>([]);

  useEffect(() => {
    setStoredSettings([...db.getItems()]);

    const update = () => {
      setStoredSettings([...db.getItems()]);
    };

    db.on(DatabaseEvent.CHANGE, update);

    update();

    return () => {
      db.off(DatabaseEvent.CHANGE, update);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center space-y-8 p-24 font-mono">
      <div className="flex flex-col items-center space-y-1">
        <div className="text-2xl">LiveKit Dev-Server Token Generator</div>
        <div className="text-sm font-light text-gray-300">
          Tokens for{' '}
          <span className="rounded border border-gray-400 bg-gray-700 p-0.5">
            livekit-server --dev
          </span>
        </div>
        <div className="text-xs font-light text-gray-500">
          API-KEY/SECRET: <span className="text-sm font-normal">devkey</span>
          {' / '}
          <span className="text-sm font-normal">secret</span>
        </div>
      </div>

      <div className="border border-gray-800 p-4">
        <TokenGenerator />
      </div>

      {storedSettings.length > 0 && (
        <div className="flex flex-col items-center space-y-2">
          <div className="text-xs font-light text-gray-500">Stored Settings</div>
          {storedSettings.map((settings) => (
            <div key={settings.id} className="border border-gray-800 p-1">
              <StoredSetting settings={settings} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
