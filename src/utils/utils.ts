export const parseJsonErrorMessage = (error: string) => {
  try {
    const parsedError = JSON.parse(error);

    return `Status: ${parsedError.status} \n Message: ${parsedError.message}`;
  } catch {
    return error;
  }
};

export const dateToHHMMSS = (dateParam: number) => {
  const date = new Date(dateParam);
  const totalMilliseconds = date.getTime();
  const totalSeconds = Math.floor(totalMilliseconds / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);

  const hours = String(totalHours).padStart(2, "0");
  const minutes = String(totalMinutes % 60).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  const formattedTime = `${hours}:${minutes}:${seconds}`;

  return formattedTime;
};

export const colors = [
  {
    textColor: "#4C4F50",
    backgroundColor: "#FDF8F7",
    borderColor: "#EC6C4E",
  },
  {
    backgroundColor: "#F3F9F9",
    borderColor: "#5BB6B1",
    textColor: "#4C4F50",
  },
  {
    borderColor: "#912066",
    backgroundColor: "#F4E9F0",
    textColor: "#4C4F50",
  },
  {
    borderColor: "#F2C94C",
    backgroundColor: "#FEF9E7",
    textColor: "#4C4F50",
  },
];
