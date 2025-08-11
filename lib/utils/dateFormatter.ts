const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${getOrdinalSuffix(day)} of ${month}`;
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("default", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const formatDateRange = (startDate: string, endDate: string) => {
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);

  const isSameDay = startDateObj.toDateString() === endDateObj.toDateString();

  const hasTime = (dateStr: string): boolean => {
    const timePart = dateStr.split('T')[1];
    if (!timePart) return false;

    const [hours, minutes] = timePart.split(':');
    return !(hours === '00' && minutes === '00');
  };

  const showTime = hasTime(startDate) || hasTime(endDate);

  const getDayWithSuffix = (dateObj: Date) => {
    const day = dateObj.getDate();
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1: return `${day}st`;
      case 2: return `${day}nd`;
      case 3: return `${day}rd`;
      default: return `${day}th`;
    }
  };

  const formatMonth = (dateObj: Date) =>
    dateObj.toLocaleString("default", { month: "long" });

  if (isSameDay) {
    const formattedDate = formatDate(startDate);
    if (showTime) {
      const startTime = formatTime(startDate);
      const endTime = formatTime(endDate);
      return `${formattedDate} ${startTime} - ${endTime}`;
    }
    return formattedDate;
  }

  const sameMonth =
    startDateObj.getMonth() === endDateObj.getMonth() &&
    startDateObj.getFullYear() === endDateObj.getFullYear();

  if (sameMonth) {
    const startDay = getDayWithSuffix(startDateObj);
    const endDay = getDayWithSuffix(endDateObj);
    const month = formatMonth(startDateObj);

    if (showTime) {
      const startTime = formatTime(startDate);
      const endTime = formatTime(endDate);
      return `${startDay} ${startTime} - ${endDay} of ${month} ${endTime}`;
    }

    return `${startDay} - ${endDay} of ${month}`;
  }

  const startFormatted = formatDate(startDate);
  const endFormatted = formatDate(endDate);

  if (showTime) {
    const startTime = formatTime(startDate);
    const endTime = formatTime(endDate);
    return `${startFormatted} ${startTime} - ${endFormatted} ${endTime}`;
  }

  return `${startFormatted} - ${endFormatted}`;
};