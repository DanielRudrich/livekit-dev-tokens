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

        <a
          href="https://github.com/DanielRudrich/livekit-dev-tokens"
          className=" text-white hover:text-gray-300"
        >
          <svg
            aria-hidden="true"
            fill="currentColor"
            height="24"
            version="1.1"
            viewBox="0 0 16 16"
            width="24"
          >
            <path
              fillRule="evenodd"
              d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
            ></path>
          </svg>
        </a>
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
