import { Scenario } from '@/features/scenario/types';
import {
  addMinutes,
  differenceInHours,
  differenceInMinutes,
  format,
} from 'date-fns';

export type TimeReferenceMode = 'absolute' | 'startRelative' | 'endRelative';

export const isSupportedTimeUnit = (unit: string) => {
  return ['s', 'min', 'h'].includes(unit.toLowerCase());
};

export const formatTimeRelativeToEventIndex = (
  index: number,
  timeMode: TimeReferenceMode,
  scenario?: Scenario,
) => {
  if (!scenario) return '';

  const unit = scenario.eventUnit || '';
  const minutes = Math.floor(
    index * (scenario.eventDuration || 1) * (unit === 'h' ? 60 : 1),
  );
  if (!isSupportedTimeUnit(unit)) {
    return `${minutes}:00`;
  }

  const startDate = scenario.startDate
    ? new Date(scenario.startDate)
    : new Date();
  const endDate = scenario.endDate ? new Date(scenario.endDate) : new Date();
  const currentTime = addMinutes(startDate, minutes);
  const scenarioDuration = differenceInMinutes(endDate, startDate);

  switch (timeMode) {
    case 'startRelative': {
      switch (unit) {
        case 'h': {
          const diffInHours = differenceInHours(currentTime, startDate);
          return `Δ+${diffInHours}h`;
        }
        case 'min': {
          const diff = differenceInMinutes(currentTime, startDate);
          return `Δ+${diff}m`;
        }
        case 's': {
          const diff = differenceInMinutes(currentTime, startDate);
          return `Δ+${diff * 60}s`;
        }
        default: {
          const diff = differenceInMinutes(currentTime, startDate);
          return `Δ+${diff}m`;
        }
      }
    }
    case 'endRelative': {
      switch (unit) {
        case 'h': {
          const diffInHours = differenceInHours(endDate, currentTime);
          return `Δ-${diffInHours}h`;
        }
        case 'min': {
          const diff = differenceInMinutes(endDate, currentTime);
          return `Δ-${diff}m`;
        }
        case 's': {
          const diff = differenceInMinutes(endDate, currentTime);
          return `Δ-${diff * 60}s`;
        }
        default: {
          const diff = differenceInMinutes(endDate, currentTime);
          return `Δ-${diff}m`;
        }
      }
    }
    default: {
      if (scenarioDuration > 525_600) {
        return format(currentTime, 'yyyy.MM.dd • HH:mm');
      } else if (scenarioDuration > 43_200) {
        return format(currentTime, 'MM.dd • HH:mm');
      } else if (scenarioDuration > 1440) {
        return format(currentTime, 'dd.MM • HH:mm');
      } else if (scenarioDuration > 60) {
        return format(currentTime, 'HH:mm');
      } else {
        return format(currentTime, 'mm:ss');
      }
    }
  }
};
