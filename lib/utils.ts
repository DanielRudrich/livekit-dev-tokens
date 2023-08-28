import { AccessToken, VideoGrant } from 'livekit-server-sdk';
import * as jose from 'jose';
import { Database } from './Database';

export const db = new Database<TokenSettings>('storedSettings');

// 6 hours
const defaultTTL = 6 * 60 * 60;

// that's what jose uses to validate/parse the ttl
export const TTL_REGEX =
  /^(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)$/i;

export type TokenSettings = {
  identity: string;
  name: string;
  metadata?: string;
  ttl?: string;
} & VideoGrant;

export function generateToken(settings: TokenSettings) {
  const ttlValid = settings.ttl && TTL_REGEX.test(settings.ttl);

  // This is a hack to prevent the "Client-side usage errors"
  // from the livekit-server-sdk
  // DON'T ever do this in production!
  // DON'T ever use non-dev secrets on the client!
  const consoleError = console.error;
  console.error = () => {};
  const token = new AccessToken('devkey', 'secret', {
    identity: settings.identity,
    metadata: settings.metadata,
    ttl: ttlValid ? settings.ttl : undefined,
  });
  console.error = consoleError;

  const grant: VideoGrant = { room: settings.room };
  grant.roomJoin = settings.roomJoin || undefined;
  grant.roomList = settings.roomList || undefined;
  grant.roomRecord = settings.roomRecord || undefined;
  grant.roomAdmin = settings.roomAdmin || undefined;
  grant.ingressAdmin = settings.ingressAdmin || undefined;
  grant.canPublish = settings.canPublish || false;
  grant.canSubscribe = settings.canSubscribe || false;

  grant.canUpdateOwnMetadata = settings.canUpdateOwnMetadata || undefined;
  grant.hidden = settings.hidden || undefined;
  grant.recorder = settings.recorder || undefined;

  // defaults to true if not set
  if (!settings.canPublishData) grant.canPublishData = false;

  token.addGrant(grant);

  if (settings.name) {
    token.name = settings.name;
  }

  const secret = new TextEncoder().encode('secret');

  const TLL =
    typeof token.ttl === 'number'
      ? Math.floor(new Date().getTime() / 1000 + token.ttl)
      : typeof token.ttl === 'string'
      ? token.ttl
      : Math.floor(new Date().getTime() / 1000 + defaultTTL);

  // @ts-ignore
  return new jose.SignJWT(token.grants)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuer('devkey')
    .setSubject(settings.identity)
    .setExpirationTime(TLL)
    .setNotBefore('0s')
    .sign(secret);
}
