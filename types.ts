/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AppMode = 'home' | 'at-home' | 'in-venue';

export type BrandName = 'SONEX' | 'RESONA' | 'SYNQ' | 'PULSEX';

export type CameraAngle = 'main' | 'bias' | 'dance';

export type LightstickPreset = 'kpop' | 'cyber' | 'sponsor';

export type DecibelTier = 'safe' | 'caution' | 'hazard';

export interface CheerReaction {
  id: string;
  type: 'heart' | 'stick' | 'spark' | 'confetti';
  label: string;
  x: number;
  y: number;
  color: string;
}

export interface WatchPartyMember {
  id: string;
  name: string;
  status: string;
  isHost?: boolean;
  avatarColor: string;
  energy: number;
}

export interface RadarNode {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isUser?: boolean;
  isHalo?: boolean;
  sector: number;
  status: 'normal' | 'surge' | 'halo';
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  text: string;
  direction: 'BLE_OUT' | 'BLE_IN' | 'SYS';
  type: 'info' | 'warn' | 'alert' | 'pulse';
}
