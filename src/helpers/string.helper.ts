// helper for string manipulation!
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import * as jwt from 'jsonwebtoken';
import { defaultJWTSignOptions } from '../common/constants';
import { cloneDeep } from 'lodash';
import { SignOptions } from 'jsonwebtoken';
import * as matchAll from 'match-all';

@Injectable()
export class StringHelper {
  constructor(private readonly configService: ConfigService) {}

  async generateRandomString(length: number): Promise<string> {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    // tslint:disable-next-line:no-shadowed-variable
    for (let i = 0; i < length; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async colorLuminance(hexadecimal: string, luminance: number): Promise<string> {
    // validate hex string
    let hex = hexadecimal;
    let lum = luminance;
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    let rgb = '';
    let c;
    for (let i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
      rgb += ('00' + c).substr(c.length);
    }

    return rgb;
  }

  async rgbToHex(r: number, g: number, b: number): Promise<string> {
    let rHex = r.toString(16);
    rHex = rHex.length === 1 ? '0' + rHex : rHex;
    let gHex = g.toString(16);
    gHex = gHex.length === 1 ? '0' + gHex : gHex;
    let bHex = b.toString(16);
    bHex = bHex.length === 1 ? '0' + bHex : bHex;
    return '#' + rHex + gHex + bHex;
  }

  async generateRandomColor(): Promise<string> {
    const color = await this.rgbToHex(
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
    );
    return await this.colorLuminance(color, -0.3);
  }

  async generateRandomNumber(length: number): Promise<string> {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    // tslint:disable-next-line:no-shadowed-variable
    for (let i = 0; i < length; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  findPattern(content: string, regex): string[] {
    return matchAll(content, regex).toArray();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async signPayload(payload: any, subject: string): Promise<string> {
    const signOptions: SignOptions = cloneDeep(defaultJWTSignOptions);
    signOptions.subject = subject;
    return jwt.sign(payload, this.configService.jwtSecret, signOptions);
  }

  async verifyPayload(jwtToken: string): Promise<object | string> {
    return new Promise((resolve, reject) => {
      jwt.verify(jwtToken, this.configService.jwtSecret, (err, decoded) => {
        if (err) {
          reject(err);
        }
        resolve(decoded);
      });
    });
  }
}
