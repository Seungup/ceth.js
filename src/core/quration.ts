import { Vector4 } from 'three';
import { HeadingPitchRoll } from './heading-pitch-roll';
import { Cartesian3 } from './math/cartesian3';

export class Quaternion extends Vector4 {
  private static _fromAxisAngleScratch = new Cartesian3();

  static fromAxisAngle(
    aixs: Cartesian3,
    angle: number,
    result: Quaternion = new Quaternion()
  ) {
    const halfAngle = angle / 2.0;

    const halfAnlgOfSin = Math.sin(halfAngle);

    this._fromAxisAngleScratch.copy(aixs).normalizeByMagnitude();

    return result.set(
      this._fromAxisAngleScratch.x * halfAnlgOfSin,
      this._fromAxisAngleScratch.y * halfAnlgOfSin,
      this._fromAxisAngleScratch.z * halfAnlgOfSin,
      Math.cos(halfAngle)
    );
  }

  private static _scratchHPRQuaternion = new Quaternion();
  private static _scratchHeadingQuaternion = new Quaternion();
  private static _scratchPitchQuaternion = new Quaternion();
  private static _scratchRollQuaternion = new Quaternion();
  static fromHeadingPitchRoll(
    headingPitchRoll: HeadingPitchRoll,
    result: Quaternion = new Quaternion()
  ) {
    this._scratchRollQuaternion = Quaternion.fromAxisAngle(
      Cartesian3.UINT_X,
      headingPitchRoll.roll,
      this._scratchHPRQuaternion
    );

    result = Quaternion.fromAxisAngle(
      Cartesian3.UINT_Y,
      headingPitchRoll.pitch,
      this._scratchPitchQuaternion
    );

    this._scratchPitchQuaternion.multiply(this._scratchRollQuaternion);

    this._scratchHeadingQuaternion = Quaternion.fromAxisAngle(
      Cartesian3.UINT_Z,
      -headingPitchRoll.heading,
      this._scratchHPRQuaternion
    );

    return result.copy(
      new Quaternion().copy(this._scratchHeadingQuaternion).multiply(result)
    );
  }
}
