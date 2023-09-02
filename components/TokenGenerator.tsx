'use client';

import Token from './Token';
import { ChangeEvent, useEffect, useState } from 'react';
import clsx from 'clsx';
import { TTL_REGEX, TokenSettings, generateToken } from '@/lib/utils';
import { db } from '@/lib/utils';

const DEFAULT_SETTINGS: TokenSettings = {
  identity: 'Person Doe',
  name: 'Person Doe',
  room: 'test',
  roomJoin: true,
  canSubscribe: true,
  canPublish: true,
  canPublishData: true,
};

function TokenGenerator({ initialSettings }: { initialSettings?: TokenSettings }) {
  const [token, setToken] = useState<string>('');
  const [ttlValid, setTtlValid] = useState<boolean>(true);

  const [settings, setSettings] = useState<TokenSettings>(initialSettings || DEFAULT_SETTINGS);

  useEffect(() => {
    generateToken(settings).then((t) => setToken(t));
  }, [settings, ttlValid]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'ttl') {
      if (!e.target.value) {
        setTtlValid(true);
      } else {
        const match = e.target.value.match(TTL_REGEX);
        setTtlValid(!!match);
      }
    }

    if (e.target.type === 'checkbox') {
      return setSettings({ ...settings, [e.target.name]: e.target.checked });
    }
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex w-max max-w-2xl flex-col items-center space-y-2 font-mono">
      <div className="flex flex-row space-x-5">
        <div className="flex flex-col space-y-1">
          <TextInput name="identity" value={settings.identity} changeCallback={handleChange} />
          <TextInput name="name" value={settings.name} changeCallback={handleChange} />
          <TextInput name="room" value={settings.room} changeCallback={handleChange} />
          <TextInput
            name="ttl"
            error={ttlValid ? undefined : 'invalid format'}
            value={settings.ttl}
            changeCallback={handleChange}
          />
        </div>

        <div className="flex flex-col space-y-0.5">
          <div className="text-xs text-gray-400">general grants</div>
          <CheckBox name="roomJoin" value={settings.roomJoin} changeCallback={handleChange} />
          <CheckBox name="canPublish" value={settings.canPublish} changeCallback={handleChange} />
          <CheckBox
            name="canSubscribe"
            value={settings.canSubscribe}
            changeCallback={handleChange}
          />
          <CheckBox
            name="canPublishData"
            value={settings.canPublishData}
            changeCallback={handleChange}
          />
          <CheckBox
            name="canUpdateOwnMetadata"
            value={settings.canUpdateOwnMetadata}
            changeCallback={handleChange}
          />
        </div>
        <div className="flex flex-col space-y-0.5">
          <div className="text-xs text-gray-400">advanced grants</div>
          <CheckBox name="roomCreate" value={settings.roomCreate} changeCallback={handleChange} />
          <CheckBox name="roomList" value={settings.roomList} changeCallback={handleChange} />
          <CheckBox name="roomRecord" value={settings.roomRecord} changeCallback={handleChange} />
          <CheckBox name="roomAdmin" value={settings.roomAdmin} changeCallback={handleChange} />
          <CheckBox
            name="ingressAdmin"
            value={settings.ingressAdmin}
            changeCallback={handleChange}
          />

          <CheckBox name="hidden" value={settings.hidden} changeCallback={handleChange} />
          <CheckBox name="recorder" value={settings.recorder} changeCallback={handleChange} />
        </div>
      </div>

      <Token token={token} />

      <div className="flex w-full flex-row justify-end">
        <button
          onClick={() => db.addItem(settings)}
          className="border border-gray-400 p-2 text-xs hover:bg-gray-400 hover:text-gray-800"
        >
          Store setting
        </button>
      </div>
    </div>
  );
}

function CheckBox({
  name,
  value,
  changeCallback,
}: {
  name: string;
  value: boolean | undefined;
  changeCallback: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const active = !!value;
  return (
    <label className="flex flex-row items-center space-x-2">
      <input type="checkbox" name={name} checked={active} onChange={changeCallback} />
      <div className={clsx('font-mono text-sm', active ? 'text-gray-200' : 'text-gray-400')}>
        {name}
      </div>
    </label>
  );
}

function TextInput({
  name,
  error,
  value,
  changeCallback,
}: {
  name: string;
  error?: string;
  value: string | undefined;
  changeCallback: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label>
      <div
        className={clsx(
          'flex flex-row items-center justify-between font-mono text-xs',
          error ? 'text-red-400' : 'text-gray-400',
        )}
      >
        <div>{name}</div>
        <div className="">{error}</div>
      </div>
      <input
        className="rounded border border-gray-400 bg-gray-700 p-0.5 font-mono text-sm font-light placeholder:text-center"
        type="text"
        name={name}
        value={value || ''}
        placeholder={`<${name}>`}
        onChange={changeCallback}
      />
    </label>
  );
}

export default TokenGenerator;
