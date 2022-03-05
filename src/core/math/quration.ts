import { Vector4 } from "three";
import { CT_Cartesian3 } from ".";

export class CT_Quaternion extends Vector4 {
  private static _fromAxisAngleScratch = new CT_Cartesian3();

  static fromAxisAngle(
    aixs: CT_Cartesian3,
    angle: number,
    result: CT_Quaternion = new CT_Quaternion()
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

  private static _scratchHPRQuaternion = new CT_Quaternion();
  private static _scratchHeadingQuaternion = new CT_Quaternion();
  private static _scratchPitchQuaternion = new CT_Quaternion();
  private static _scratchRollQuaternion = new CT_Quaternion();

  static fromHeadingPitchRoll(
    heading: number,
    pitch: number,
    roll: number,
    result: CT_Quaternion = new CT_Quaternion()
  ) {
    this._scratchRollQuaternion = this.fromAxisAngle(
      CT_Cartesian3.UINT_X,
      roll,
      this._scratchHPRQuaternion
    );

    result = this.fromAxisAngle(
      CT_Cartesian3.UINT_Y,
      pitch,
      this._scratchPitchQuaternion
    );

    this._scratchPitchQuaternion.multiply(this._scratchRollQuaternion);

    this._scratchHeadingQuaternion = this.fromAxisAngle(
      CT_Cartesian3.UINT_Z,
      -heading,
      this._scratchHPRQuaternion
    );

    return result.copy(
      new CT_Quaternion().copy(this._scratchHeadingQuaternion).multiply(result)
    );
  }
}
