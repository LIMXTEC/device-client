/*
 * Copyright (C) 2015-2016 KeepKey, LLC
 * All Rights Reserved
 */

/* tslint:disable:no-bitwise */

export class ExtendedPurposeCodeHelper {
  public static encode(purpose: string): number {
    var encodedPurpose = 0;
    var count = 0;

    purpose.split('').forEach(function (chr: string) {
      if (count++ < 6) {
        encodedPurpose = encodedPurpose << 5 | encodeChar(chr.charCodeAt(0));
      }
    });

    for (; count < 6; count++) {
      encodedPurpose = encodedPurpose << 5;
    }

    /* set the hardened and extended purpose bits */
    return (encodedPurpose | 0xC0000000) >>> 0;
  }

  public static decode(encodedPurpose: number): string {
    var base32Decode = [
      '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K',
      'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X',
      'Y', 'Z'
    ];
    var purpose = [];

    if (((0xC0000000 & encodedPurpose) >>> 0) !== 0xC0000000) {
      return undefined;
    }

    /* strip hardened and extended purpose bits */
    encodedPurpose &= 0x3FFFFFFF;
    while (purpose.length < 6) {
      purpose.push(base32Decode[encodedPurpose & 0x1f]);
      encodedPurpose = encodedPurpose >>> 5;
    }

    return purpose.reverse().join('');
  }
}

function encodeChar(charCode: number): number {
  var base32Encode = [
    /* Digits */
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 0, 0, 0, 0, 0,
    /* Uppercase */
    0, 10, 11, 12, 13, 14, 15, 16, 17, 1, 18, 19, 1, 20, 21, 0, 22, 23, 24, 25, 26, 27, 27, 28, 29, 30, 31, 0, 0, 0, 0, 0,
    /* Lowercase */
    0, 10, 11, 12, 13, 14, 15, 16, 17, 1, 18, 19, 1, 20, 21, 0, 22, 23, 24, 25, 26, 27, 27, 28, 29, 30, 31
  ];
  if (charCode < 48 || charCode > 122) {
    return 0;
  } else {
    return base32Encode[charCode - 48];
  }
}
