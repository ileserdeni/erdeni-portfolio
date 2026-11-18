import NanoscribeInterior from './Nanoscribe';
import RhythmGameInterior from './RhythmGame';
import ThermostatInterior from './Thermostat';
import ThinFilmInterior from './ThinFilm';

// Interior layers for photographs, keyed by `hero.xray` in content/work.js.
export const photoInteriors = {
  'rhythm-game': RhythmGameInterior,
  'thin-film': ThinFilmInterior,
  nanoscribe: NanoscribeInterior,
  thermostat: ThermostatInterior,
};
