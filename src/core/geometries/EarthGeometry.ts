import { SphereGeometry } from 'three';
import { EARTH_RADIUS } from '../../constants';

class EarthGeometry extends SphereGeometry {
	constructor(segments: number = 32) {
		super(EARTH_RADIUS, segments, segments);
	}
}

export { EarthGeometry };
