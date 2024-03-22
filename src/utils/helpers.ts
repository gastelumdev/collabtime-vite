function getRGB(c: string) {
  return parseInt(c, 16) || Number(c)
}

function getsRGB(c: string) {
  return getRGB(c) / 255 <= 0.03928
    ? getRGB(c) / 255 / 12.92
    : Math.pow((getRGB(c) / 255 + 0.055) / 1.055, 2.4)
}

function getLuminance(hexColor: string) {
  return (
    0.2126 * getsRGB(hexColor.slice(1, 2)) +
    0.7152 * getsRGB(hexColor.slice(3, 2)) +
    0.0722 * getsRGB(hexColor.slice(-2))
  )
}

function getContrast(f: string, b: string) {
  const L1 = getLuminance(f)
  const L2 = getLuminance(b)
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
}

export function getTextColor(bgColor: string) {
  const whiteContrast = getContrast(bgColor, '#ffffff')
  const blackContrast = getContrast(bgColor, '#000000')

  return whiteContrast > blackContrast ? '#ffffff' : '#000000'
}

const formatHours = (hours: any) => {
  if (hours > 12) {
    return hours - 12;
  }
  return hours;
};

const getMeridian = (hours: any) => {
  if (hours > 12) {
    return "PM";
  }
  return "AM";
};

export const formatTime = (date: Date) => {
  let newDate = new Date(date);
  let formattedDate = `${newDate.getMonth() + 1}/${newDate.getDate()}/${newDate.getFullYear()} ${formatHours(
    newDate.getHours()
  )}:${newDate.getUTCMinutes() > 9 ? "" : "0"}${newDate.getUTCMinutes()} ${getMeridian(newDate.getHours())}`;
  return formattedDate
};

const relocateSectionOfList = (arr: any, draggedId: number, overId: number) => {



  // Remove the item from the provided index and remember it
  const [draggedItem] = arr.splice(draggedId, 1);
  // Insert the item in the location provided
  arr.splice(overId, 0, draggedItem);

  return arr;
}

// const arr = ["item 1", "item 2", "item 3", "item 4", "item 5", "item 6"];


export const swapItems = (arr: any, draggedId: number, overId: number, numberOfItems: number) => {
  let result;

  if (draggedId <= overId) {
    for (let i = 0; i < numberOfItems; i++) {
      result = relocateSectionOfList(arr, draggedId - 1, overId - 1);
    }
  } else {
    for (let i = 0; i < numberOfItems; i++) {
      result = relocateSectionOfList(arr, draggedId - 1 + i, overId - 1 + i);
    }
  }

  return result;
}
