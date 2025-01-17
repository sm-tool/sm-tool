import { format, parseISO } from 'date-fns';

const formatDate = (dateString: string) => {
  const date = parseISO(dateString);
  return format(date, 'HH:mm d MMM yy');
};

export default formatDate;
