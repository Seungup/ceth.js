export class MathUtils {
  static readonly RADIANS_PER_DEGREE = Math.PI / 180.0;
  static readonly EPSILON_01: number = 0.1;
  static readonly EPSILON_02: number = 0.01;
  static readonly EPSILON_03: number = 0.001;
  static readonly EPSILON_04: number = 0.0001;
  static readonly EPSILON_05: number = 0.00001;
  static readonly EPSILON_06: number = 0.000001;
  static readonly EPSILON_07: number = 0.0000001;
  static readonly EPSILON_08: number = 0.00000001;
  static readonly EPSILON_09: number = 0.000000001;
  static readonly EPSILON_10: number = 0.0000000001;
  static readonly EPSILON_11: number = 0.00000000001;
  static readonly EPSILON_12: number = 0.000000000001;
  static readonly EPSILON_13: number = 0.0000000000001;
  static readonly EPSILON_14: number = 0.00000000000001;
  static readonly EPSILON_15: number = 0.000000000000001;
  static readonly EPSILON_16: number = 0.0000000000000001;
  static readonly EPSILON_17: number = 0.00000000000000001;
  static readonly EPSILON_18: number = 0.000000000000000001;
  static readonly EPSILON_19: number = 0.0000000000000000001;
  static readonly EPSILON_20: number = 0.00000000000000000001;
  static readonly EPSILON_21: number = 0.000000000000000000001;
  static toRadians(degrees: number) {
    return degrees * this.RADIANS_PER_DEGREE;
  }

  static randomOffset() {
    return Math.floor(Math.random() * 10000) * 0.000001;
  }

  /**
   * 절대 공차 검정 또는 상대 공차 검정을 사용하여 두 값이 같은지 여부를 확인합니다.
   *
   * @example
   * MathUtils.equalsEpsilon(0.1, 0.01, MathUtils.EPSILON_01) // true
   * MathUtils.equalsEpsilon(0.1, 0.01, MathUtils.EPSILON_02) // false
   *
   * @param left - The first value to compare.
   * @param right - The other value to compare.
   * @param relativeEpsilon
   * @param absoluteEpsilon
   * @returns
   */
  static equalsEpsilon(
    left: number,
    right: number,
    relativeEpsilon: number = this.EPSILON_14,
    absoluteEpsilon: number = this.EPSILON_14
  ) {
    const absDiff = Math.abs(left - right);
    if (absDiff <= absoluteEpsilon) return true;
    return (
      absDiff <= relativeEpsilon * Math.max(Math.abs(left), Math.abs(right))
    );
  }

  static magnitude(vec: { x: number; y: number; z: number }) {
    return Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
  }
}
