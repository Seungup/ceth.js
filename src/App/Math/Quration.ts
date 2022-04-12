import { Quaternion } from "three";
import { Cartesian3 } from ".";

export namespace QuaternionUtils {
    const _scratchHPRQuaternion = new Quaternion();
    const _scratchHeadingQuaternion = new Quaternion();
    const _scratchPitchQuaternion = new Quaternion();
    const _scratchRollQuaternion = new Quaternion();

    const UINT_X = Cartesian3.UINT_X;
    const UINT_Y = Cartesian3.UINT_Y;
    const UINT_Z = Cartesian3.UINT_Z;

    const _tempQuaternion = new Quaternion();

    export const setFromHeadingPitchRoll = (
        result: Quaternion,
        parma: { heading: number; pitch: number; roll: number }
    ) => {
        const { heading, pitch, roll } = parma;

        _scratchHPRQuaternion.setFromAxisAngle(UINT_X, roll);
        _scratchRollQuaternion.copy(_scratchHPRQuaternion);
        _scratchPitchQuaternion.setFromAxisAngle(UINT_Y, pitch);

        _tempQuaternion.copy(_scratchPitchQuaternion);

        _scratchPitchQuaternion.multiply(_scratchRollQuaternion);
        _scratchHPRQuaternion.setFromAxisAngle(UINT_Z, -heading);
        _scratchHeadingQuaternion.copy(_scratchHPRQuaternion);

        result.copy(_scratchHeadingQuaternion.multiply(_tempQuaternion));
    };
}
