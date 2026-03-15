/**
 * WaxAI Wax Recommendation Engine
 *
 * Determines the optimal grip and glide wax for cross-country skiing
 * based on current weather conditions.
 *
 * @param {Object} weather - Weather data from Open-Meteo API
 * @param {number} weather.temperature  - Air temperature in °C
 * @param {number} weather.humidity     - Relative humidity in %
 * @param {number} weather.precipitation - Precipitation amount in mm/h
 * @param {number} weather.weatherCode  - WMO weather code
 * @param {boolean} weather.isSnowing   - True if it is currently snowing
 * @returns {Object} recommendation
 */
export function getWaxRecommendation(weather) {
  const { temperature, humidity, precipitation, isSnowing } = weather;

  // ─── GRIP WAX ──────────────────────────────────────────────────────────────

  let gripWax = null;
  let gripColor = null;
  let gripConfidence = 'high';
  let gripNotes = [];

  if (temperature <= -12) {
    gripWax = 'Special Green (Polar)';
    gripColor = '#16a34a';
    gripNotes.push('Very cold, hard snow. Apply a thin, hard layer.');
  } else if (temperature <= -7) {
    gripWax = 'Green (Extra Special Green)';
    gripColor = '#15803d';
    gripNotes.push('Cold, dry snow with fine crystals. Apply hard and smooth.');
  } else if (temperature <= -2) {
    gripWax = 'Blue (Violet Blue)';
    gripColor = '#1d4ed8';
    gripNotes.push('Classic cold conditions. 2–3 thin layers work best.');
  } else if (temperature <= 0) {
    gripWax = 'Violet';
    gripColor = '#7c3aed';
    gripNotes.push('Transitional zone. Test on skis before a full lap.');
    if (humidity > 75) {
      gripWax = 'Violet (Wet)';
      gripNotes.push('High humidity – opt for the wet variant of violet.');
      gripConfidence = 'medium';
    }
  } else if (temperature <= 2) {
    gripWax = 'Red (Special Red)';
    gripColor = '#dc2626';
    gripNotes.push('Wet, warm snow. Cork vigorously for best adhesion.');
    if (isSnowing && precipitation > 0.5) {
      gripNotes.push('Active snowfall – re-apply more frequently.');
      gripConfidence = 'medium';
    }
  } else if (temperature <= 5) {
    gripWax = 'Yellow (Silver)';
    gripColor = '#ca8a04';
    gripNotes.push('Very wet, slushy conditions. Apply thick and re-apply often.');
    gripConfidence = 'medium';
  } else {
    gripWax = 'Klister (Universal)';
    gripColor = '#9a3412';
    gripNotes.push('Above freezing – klister required. Clean skis after use.');
    gripConfidence = 'low';
    if (temperature > 8) {
      gripNotes.push('Consider a klister spray for convenience at this warmth.');
    }
  }

  // Klister override: refrozen wet snow is sticky and needs klister even at cold temps
  if (temperature <= 0 && temperature >= -4 && humidity > 90 && precipitation > 1) {
    gripWax = 'Klister (Blue Klister)';
    gripColor = '#1e40af';
    gripNotes.push('Very high humidity and precipitation → blue klister recommended despite cold temp.');
    gripConfidence = 'medium';
  }

  // ─── GLIDE WAX ─────────────────────────────────────────────────────────────

  let glideWax = null;
  let glideColor = null;
  let glideNotes = [];

  if (temperature <= -10) {
    glideWax = 'Cold Glide (LF Blue / CH6)';
    glideColor = '#1d4ed8';
    glideNotes.push('Low fluorocarbon blue wax for cold, hard tracks.');
  } else if (temperature <= -4) {
    glideWax = 'Universal Glide (LF Violet / CH7)';
    glideColor = '#7c3aed';
    glideNotes.push('All-around violet glide wax. Iron at 120 °C.');
  } else if (temperature <= 2) {
    glideWax = 'Warm Glide (LF Red / CH8)';
    glideColor = '#dc2626';
    glideNotes.push('Soft red glide wax for warm or humid conditions.');
    if (humidity > 80) {
      glideWax = 'Wet Glide (HF Red / CH8 Wet)';
      glideNotes.push('High humidity – use high-fluorocarbon or wet compound.');
    }
  } else {
    glideWax = 'Yellow Wet Glide (HF Yellow / CH10)';
    glideColor = '#ca8a04';
    glideNotes.push('Slushy / very wet snow – use a yellow or silver wet glide.');
  }

  // ─── GENERAL NOTES ─────────────────────────────────────────────────────────

  const generalNotes = [];

  if (isSnowing) {
    generalNotes.push('Active snowfall may change conditions quickly – reassess after 1 hour.');
  }
  if (humidity >= 85 && temperature < 0) {
    generalNotes.push('Near-saturated humidity: snow crystals are rounded and wet-acting. Go one wax warmer.');
  }
  if (temperature >= -1 && temperature <= 1) {
    generalNotes.push('Transition zone (±1 °C): bring both violet and red grip wax in your pack.');
  }

  // ─── TECHNIQUE TIP ─────────────────────────────────────────────────────────

  let technique = 'Classic technique – grip zone is critical today.';
  if (temperature > 3 || (temperature > 0 && humidity > 85)) {
    technique = "Wet conditions: skate skiing avoids grip issues entirely if that's an option.";
  }

  // ─── CONFIDENCE LEVEL ──────────────────────────────────────────────────────

  // Downgrade overall confidence when close to transition temperatures
  const nearTransition =
    (temperature >= -2.5 && temperature <= -1.5) ||
    (temperature >= -0.5 && temperature <= 0.5) ||
    (temperature >= 1.5 && temperature <= 2.5);

  if (nearTransition && gripConfidence === 'high') {
    gripConfidence = 'medium';
    gripNotes.push('Near a transition temperature – test on a short loop first.');
  }

  const confidenceLevels = { high: 3, medium: 2, low: 1 };
  const overallConfidence =
    nearTransition || gripConfidence !== 'high' ? 'medium' : 'high';

  return {
    gripWax,
    gripColor,
    gripConfidence,
    gripNotes,
    glideWax,
    glideColor,
    glideNotes,
    generalNotes,
    technique,
    overallConfidence,
    conditions: describeConditions(weather),
  };
}

/**
 * Returns a human-readable summary of the current conditions.
 */
function describeConditions({ temperature, humidity, isSnowing, weatherCode }) {
  const parts = [];
  if (temperature <= -10) parts.push('Polar cold');
  else if (temperature <= -4) parts.push('Cold');
  else if (temperature <= 0) parts.push('Freezing');
  else if (temperature <= 4) parts.push('Near freezing');
  else parts.push('Above freezing');

  if (isSnowing) parts.push('with active snowfall');
  else if (humidity > 85) parts.push('with very high humidity');
  else if (humidity > 65) parts.push('with moderate humidity');
  else parts.push('and dry air');

  return parts.join(' ');
}

/**
 * Maps WMO weather codes to a simplified condition object.
 * https://open-meteo.com/en/docs#weathervariables
 */
export function parseWeatherCode(code) {
  if (code === 0) return { label: 'Clear sky', icon: 'sun', isSnowing: false };
  if (code <= 3) return { label: 'Partly cloudy', icon: 'cloud-sun', isSnowing: false };
  if (code <= 49) return { label: 'Foggy', icon: 'cloud', isSnowing: false };
  if (code <= 59) return { label: 'Drizzle', icon: 'cloud-drizzle', isSnowing: false };
  if (code <= 69) return { label: 'Rain', icon: 'cloud-rain', isSnowing: false };
  if (code <= 79) return { label: 'Snow', icon: 'cloud-snow', isSnowing: true };
  if (code <= 84) return { label: 'Rain showers', icon: 'cloud-rain', isSnowing: false };
  if (code <= 94) return { label: 'Snow showers', icon: 'cloud-snow', isSnowing: true };
  return { label: 'Thunderstorm', icon: 'cloud-lightning', isSnowing: false };
}
