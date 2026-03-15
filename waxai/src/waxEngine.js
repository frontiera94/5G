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
    gripWax = 'Verde Speciale (Polare)';
    gripColor = '#16a34a';
    gripNotes.push('Neve molto fredda e dura. Applica uno strato sottile e duro.');
  } else if (temperature <= -7) {
    gripWax = 'Verde (Verde Extra Speciale)';
    gripColor = '#15803d';
    gripNotes.push('Neve fredda e secca con cristalli fini. Applica duro e uniforme.');
  } else if (temperature <= -2) {
    gripWax = 'Blu (Blu Violetto)';
    gripColor = '#1d4ed8';
    gripNotes.push('Condizioni fredde classiche. Meglio 2–3 strati sottili.');
  } else if (temperature <= 0) {
    gripWax = 'Violetto';
    gripColor = '#7c3aed';
    gripNotes.push('Zona di transizione. Testa sugli sci prima di un giro completo.');
    if (humidity > 75) {
      gripWax = 'Violetto (Bagnato)';
      gripNotes.push('Alta umidità – scegli la variante bagnata del violetto.');
      gripConfidence = 'medium';
    }
  } else if (temperature <= 2) {
    gripWax = 'Rosso (Rosso Speciale)';
    gripColor = '#dc2626';
    gripNotes.push('Neve bagnata e calda. Strofina vigorosamente per una migliore adesione.');
    if (isSnowing && precipitation > 0.5) {
      gripNotes.push('Nevicata attiva – riapplica più frequentemente.');
      gripConfidence = 'medium';
    }
  } else if (temperature <= 5) {
    gripWax = 'Giallo (Argento)';
    gripColor = '#ca8a04';
    gripNotes.push('Condizioni molto bagnate e fanghose. Applica spesso e riapplica frequentemente.');
    gripConfidence = 'medium';
  } else {
    gripWax = 'Klister (Universale)';
    gripColor = '#9a3412';
    gripNotes.push('Sopra zero – klister necessario. Pulisci gli sci dopo l\'uso.');
    gripConfidence = 'low';
    if (temperature > 8) {
      gripNotes.push('Considera uno spray klister per comodità con queste temperature.');
    }
  }

  // Klister override: refrozen wet snow is sticky and needs klister even at cold temps
  if (temperature <= 0 && temperature >= -4 && humidity > 90 && precipitation > 1) {
    gripWax = 'Klister (Klister Blu)';
    gripColor = '#1e40af';
    gripNotes.push('Umidità molto alta e precipitazioni → klister blu consigliato nonostante la temperatura fredda.');
    gripConfidence = 'medium';
  }

  // ─── GLIDE WAX ─────────────────────────────────────────────────────────────

  let glideWax = null;
  let glideColor = null;
  let glideNotes = [];

  if (temperature <= -10) {
    glideWax = 'Scorrimento Freddo (LF Blu / CH6)';
    glideColor = '#1d4ed8';
    glideNotes.push('Cera blu a basso fluoro per piste fredde e dure.');
  } else if (temperature <= -4) {
    glideWax = 'Scorrimento Universale (LF Violetto / CH7)';
    glideColor = '#7c3aed';
    glideNotes.push('Cera da scorrimento violetta versatile. Ferro a 120 °C.');
  } else if (temperature <= 2) {
    glideWax = 'Scorrimento Caldo (LF Rosso / CH8)';
    glideColor = '#dc2626';
    glideNotes.push('Cera da scorrimento rossa morbida per condizioni calde o umide.');
    if (humidity > 80) {
      glideWax = 'Scorrimento Bagnato (HF Rosso / CH8 Bagnato)';
      glideNotes.push('Alta umidità – usa un composto ad alto fluoro o bagnato.');
    }
  } else {
    glideWax = 'Scorrimento Bagnato Giallo (HF Giallo / CH10)';
    glideColor = '#ca8a04';
    glideNotes.push('Neve fanghosa / molto bagnata – usa una sciolina gialla o argento per il bagnato.');
  }

  // ─── GENERAL NOTES ─────────────────────────────────────────────────────────

  const generalNotes = [];

  if (isSnowing) {
    generalNotes.push('La nevicata attiva può cambiare rapidamente le condizioni – rivaluta dopo 1 ora.');
  }
  if (humidity >= 85 && temperature < 0) {
    generalNotes.push('Umidità quasi satura: i cristalli di neve sono arrotondati e si comportano come bagnato. Usa una cera più calda.');
  }
  if (temperature >= -1 && temperature <= 1) {
    generalNotes.push('Zona di transizione (±1 °C): porta sia la sciolina violetta che quella rossa nello zaino.');
  }

  // ─── TECHNIQUE TIP ─────────────────────────────────────────────────────────

  let technique = 'Tecnica classica – la zona di presa è fondamentale oggi.';
  if (temperature > 3 || (temperature > 0 && humidity > 85)) {
    technique = "Condizioni bagnate: il pattinaggio evita completamente i problemi di presa se è un'opzione.";
  }

  // ─── CONFIDENCE LEVEL ──────────────────────────────────────────────────────

  // Downgrade overall confidence when close to transition temperatures
  const nearTransition =
    (temperature >= -2.5 && temperature <= -1.5) ||
    (temperature >= -0.5 && temperature <= 0.5) ||
    (temperature >= 1.5 && temperature <= 2.5);

  if (nearTransition && gripConfidence === 'high') {
    gripConfidence = 'medium';
    gripNotes.push('Vicino a una temperatura di transizione – testa prima su un piccolo giro.');
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
  if (temperature <= -10) parts.push('Freddo polare');
  else if (temperature <= -4) parts.push('Freddo');
  else if (temperature <= 0) parts.push('Gelo');
  else if (temperature <= 4) parts.push('Vicino al gelo');
  else parts.push('Sopra zero');

  if (isSnowing) parts.push('con nevicata attiva');
  else if (humidity > 85) parts.push('con umidità molto alta');
  else if (humidity > 65) parts.push('con umidità moderata');
  else parts.push('e aria secca');

  return parts.join(' ');
}

/**
 * Maps WMO weather codes to a simplified condition object.
 * https://open-meteo.com/en/docs#weathervariables
 */
export function parseWeatherCode(code) {
  if (code === 0) return { label: 'Cielo sereno', icon: 'sun', isSnowing: false };
  if (code <= 3) return { label: 'Parzialmente nuvoloso', icon: 'cloud-sun', isSnowing: false };
  if (code <= 49) return { label: 'Nebbioso', icon: 'cloud', isSnowing: false };
  if (code <= 59) return { label: 'Pioggerella', icon: 'cloud-drizzle', isSnowing: false };
  if (code <= 69) return { label: 'Pioggia', icon: 'cloud-rain', isSnowing: false };
  if (code <= 79) return { label: 'Neve', icon: 'cloud-snow', isSnowing: true };
  if (code <= 84) return { label: 'Acquazzoni', icon: 'cloud-rain', isSnowing: false };
  if (code <= 94) return { label: 'Rovesci di neve', icon: 'cloud-snow', isSnowing: true };
  return { label: 'Temporale', icon: 'cloud-lightning', isSnowing: false };
}
