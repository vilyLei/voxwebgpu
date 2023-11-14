import IAABB from "../cgeom/IAABB"
import IOBB from "../cgeom/IOBB";
/**
 * entity volume space
 */
class EntityVolume {
	localBounds: IAABB;
	globalBounds: IAABB;
	obb: IOBB;
}
export { EntityVolume }
