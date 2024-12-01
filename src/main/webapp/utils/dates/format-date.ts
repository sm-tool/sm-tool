import { format } from 'date-fns';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, 'HH:mm d MMM yy');
};

export default formatDate;
