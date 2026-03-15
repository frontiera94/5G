/**
 * Snow State Analyzer
 *
 * Analyzes 14 days of hourly snowfall and temperature data to determine:
 * - When it last snowed
 * - For each day after snowfall: were temperatures above 0 °C for more than 12 hours?
 *
 * @param {Object} hourlyData - { time: string[], snowfall: number[], temperature_2m: number[] }
 * @returns {Object|null} snow state analysis
 */
export function analyzeSnowState(hourlyData) {
  const { time, snowfall, temperature_2m } = hourlyData || {};
  if (!time || !snowfall || !temperature_2m || time.length === 0) return null;

  // Group hourly entries by date string ("YYYY-MM-DD")
  const byDate = {};
  for (let i = 0; i < time.length; i++) {
    const dateStr = time[i].split('T')[0];
    if (!byDate[dateStr]) byDate[dateStr] = { temps: [], snowfallSum: 0 };
    byDate[dateStr].temps.push(temperature_2m[i]);
    byDate[dateStr].snowfallSum += snowfall[i] || 0;
  }

  const sortedDates = Object.keys(byDate).sort();

  // Find the last date with snowfall > 0
  let lastSnowDateStr = null;
  for (let i = sortedDates.length - 1; i >= 0; i--) {
    if (byDate[sortedDates[i]].snowfallSum > 0) {
      lastSnowDateStr = sortedDates[i];
      break;
    }
  }

  if (!lastSnowDateStr) {
    return { hasSnow: false };
  }

  // Days since last snowfall (relative to last date in dataset)
  const lastDateInData = sortedDates[sortedDates.length - 1];
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysSinceSnow = Math.round(
    (new Date(lastDateInData + 'T12:00:00Z') - new Date(lastSnowDateStr + 'T12:00:00Z')) / msPerDay
  );

  // Analyze each day after the snowfall day
  const daysAfterSnow = sortedDates.filter((d) => d > lastSnowDateStr);
  const daysAnalysis = daysAfterSnow.map((dateStr) => {
    const { temps } = byDate[dateStr];
    const hoursAboveZero = temps.filter((t) => t > 0).length;
    return {
      date: dateStr,
      hoursAboveZero,
      isWarm: hoursAboveZero > 12,
    };
  });

  // Determine overall snow condition
  const warmDaysCount = daysAnalysis.filter((d) => d.isWarm).length;
  const totalDays = daysAnalysis.length;

  let condition, conditionColor, conditionDesc;

  if (daysSinceSnow === 0) {
    condition = 'Fresca';
    conditionColor = 'text-blue-300';
    conditionDesc = 'Nevicata in corso o recente — cristalli intatti, condizioni ottimali per la sciolina.';
  } else if (warmDaysCount === 0) {
    if (daysSinceSnow <= 3) {
      condition = 'Fresca';
      conditionColor = 'text-blue-300';
      conditionDesc = 'Neve recente conservata al freddo — cristalli ben definiti, presa ottimale.';
    } else {
      condition = 'Assestata';
      conditionColor = 'text-cyan-300';
      conditionDesc =
        'Neve invecchiata ma sempre fredda — sintering in corso, superficie più compatta e dura.';
    }
  } else if (warmDaysCount < totalDays) {
    condition = 'Trasformata';
    conditionColor = 'text-amber-300';
    conditionDesc = `Parzialmente metamorfosata: ${warmDaysCount} giorn${warmDaysCount > 1 ? 'i' : 'o'} con temperatura sopra 0 °C per oltre 12 h — cristalli arrotondati, considera una sciolina più calda.`;
  } else {
    condition = 'Rigenerata';
    conditionColor = 'text-orange-300';
    conditionDesc =
      'Neve completamente trasformata da cicli termici — cristalli molto arrotondati o bagnati, preferire scioline per neve bagnata/vecchia.';
  }

  return {
    hasSnow: true,
    lastSnowDate: lastSnowDateStr,
    daysSinceSnow,
    daysAnalysis,
    condition,
    conditionColor,
    conditionDesc,
    warmDaysCount,
  };
}
