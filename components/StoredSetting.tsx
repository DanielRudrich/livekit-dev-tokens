import { TokenSettings, generateToken } from '@/lib/utils';
import Token from './Token';
import { useEffect, useState } from 'react';
import { Item } from '@/lib/Database';
import { db } from '@/lib/utils';

function StoredSetting({ settings }: { settings: Item<TokenSettings> }) {
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    generateToken(settings).then((t) => setToken(t));
  }, [settings]);

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-row items-center justify-between">
        <Info label="identity" value={settings.identity} />
        <Info label="name" value={settings.name} />
        <Info label="room" value={settings.room} />

        <button
          onClick={() => db.deleteItem(settings.id)}
          className="border border-gray-400 p-1 text-xs hover:border-red-400 hover:bg-red-400 hover:text-gray-900"
        >
          remove
        </button>
      </div>
      <Token token={token} small={true} />
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col text-xs text-gray-400">
      <div className="font-light text-gray-500">{label}</div>
      <div>{value ? value : '---'}</div>
    </div>
  );
}

export default StoredSetting;
