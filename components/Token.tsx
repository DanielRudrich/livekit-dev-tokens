'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';

function Token({ token, small }: { token: string; small?: boolean }) {
  const [copied, setCopied] = useState(false);

  const copyTokenToClipboard = useCallback(() => {
    if ('clipboard' in navigator) {
      navigator.clipboard.writeText(token);
      setCopied(true);
    }
  }, [token]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCopied(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [copied]);

  return (
    <div className="flex max-w-lg flex-col rounded bg-gray-900 p-1 font-mono">
      <div className="flex select-none flex-row items-end justify-between">
        <div className="h-4  text-xs text-gray-400">Token</div>
        <div className="h-4 text-xs text-sky-400">{copied && 'copied to clipboard'}</div>
      </div>

      <div
        className={clsx(
          ' break-words p-1 text-xs text-gray-300',
          small && 'relative max-h-8 overflow-hidden',
        )}
        onClick={copyTokenToClipboard}
      >
        {token}
        {small && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-b from-gray-900/0 to-gray-900"></div>
        )}
      </div>
    </div>
  );
}

export default Token;
