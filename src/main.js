const hotels = require('./constants/hotels.json');

function getCheapestHotel(input) {
  // Creating an array with the client type and dates from input, using colon as separator.
  const [clientType, dates] = input.split(':');

  // Creating an array with the weekdays abbreviations.
  // .split() -> Returning chosen dates array, using comma as separator.
  // .match() -> Getting the value from inside the parentheses, using RegEx.
  const days = dates.split(',').map(date => date.match(/\((.*?)\)/)[1]);

  // Creating an array with the total value of all hotels.
  const reservationsTotal = hotels.map(hotel => {
    // Summing the value of each day in each hotel.
    const amountPerHotel = days.reduce((acc, day) => {
      // Checking if the chosen day is a weekend day.
      const isWeekendDay = ['saturday', 'sunday'].some(weekendDay => weekendDay.includes(day));

      // Catching the value of the day, according to the client type.
      const dayValue = hotel.prices[clientType.toLowerCase()][isWeekendDay ? 'weekendDay' : 'weekday'];
      
      // Returning the sum of accumulated value in loop and the day's value.
      return acc + dayValue;
    }, 0);
  
    // Returning each array element as an object, containing the hotel name, its rating, and the total daily rate.
    return ({
      name: hotel.name,
      rate: hotel.rate,
      total: amountPerHotel,
    });
  });

  // Ordering the array, according to the cheapest total daily rates and the rating of each hotel.
  const orderedReservationsTotal = reservationsTotal.sort((a, b) => {
    // If the total value of one hotel is equal to another, the ranking will be in descending order according to the hotel's rating.
    if (a.total === b.total) {
      return a.rate > b.rate ? -1 : 1;
    }

    // If the subtraction return is less than 0, the first compared element (a) moves to an index before the second (b). If it's greater, the second compared element (b) will move to a previous index to the first (a).
    return a.total - b.total;
  });

  // Returning the name of the first hotel (the cheapest) in the ordered array.
  return orderedReservationsTotal[0].name;
}

exports.getCheapestHotel = getCheapestHotel;
