export enum ESlaveConfigTopic {
  ALL = 'config',
  TEMPERATURE = 'config/temperature',
  WATER_PUMP = 'config/water',
  LED = 'config/led',
}

export enum ESlaveTurnPowerTopic {
  WATER_PUMP = 'power/water',
  LED = 'power/led',
}

export const POLLING = 'master/+/polling';

export const TEMPERATURE_WEEK = 'temperature/week';
