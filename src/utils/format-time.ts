export const formatTime = (time: string) => {
  if (+time >= 10) {
    return `${time}:00`
  }
  return `0${time}:00`
}
