function getRank(num: number): string {
  // Handle edge cases
  if (num <= 0) return num + "th";

  // Get the last two digits to handle special cases (11th, 12th, 13th)
  const lastTwoDigits = num % 100;

  // Special cases for 11th, 12th, 13th (these always end in 'th')
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return num + "th";
  }

  // Get the last digit to determine suffix
  const lastDigit = num % 10;

  switch (lastDigit) {
    case 1:
      function getRank(num: number): string {
        // Handle edge cases
        if (num <= 0) return num + "th";

        // Get the last two digits to handle special cases (11th, 12th, 13th)
        const lastTwoDigits = num % 100;

        // Special cases for 11th, 12th, 13th (these always end in 'th')
        if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
          return num + "th";
        }

        // Get the last digit to determine suffix
        const lastDigit = num % 10;

        switch (lastDigit) {
          case 1:
            return num + "st";
          case 2:
            return num + "nd";
          case 3:
            return num + "rd";
          default:
            return num + "th";
        }
      }
      return num + "st";
    case 2:
      return num + "nd";
    case 3:
      return num + "rd";
    default:
      return num + "th";
  }
}

export { getRank };