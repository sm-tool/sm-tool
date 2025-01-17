import { Scenario } from '@/features/scenario/types';
import { addMinutes, differenceInMinutes, format } from 'date-fns';

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
  const minutes = Math.floor(index * (scenario.eventDuration || 1));
  const unit = scenario.eventUnit || '';

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
      const diff = differenceInMinutes(currentTime, startDate);
      switch (unit) {
        case 'h': {
          return `Δ+${Math.floor(diff / 60)}h`;
        }
        case 'min': {
          return `Δ+${diff}m`;
        }
        case 's': {
          return `Δ+${diff * 60}s`;
        }
        default: {
          return `Δ+${diff}m`;
        }
      }
    }
    case 'endRelative': {
      const diff = differenceInMinutes(endDate, currentTime);
      switch (unit) {
        case 'h': {
          return `Δ-${Math.floor(diff / 60)}h`;
        }
        case 'min': {
          return `Δ-${diff}m`;
        }
        case 's': {
          return `Δ-${diff * 60}s`;
        }
        default: {
          return `Δ+${diff}m`;
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
